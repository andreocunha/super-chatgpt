import {
  CheckIcon,
  CopyIcon,
  MuteIcon,
  ThumbsdownIcon,
  ThumbsupIcon,
  UnmuteIcon,
} from '@primer/octicons-react'
import { useEffect } from 'preact/hooks'
import { memo, useCallback, useState } from 'react'
import Browser from 'webextension-polyfill'

interface Props {
  messageId: string
  conversationId: string
  answerText: string
}

function ChatGPTFeedback(props: Props) {
  const [copied, setCopied] = useState(false)
  const [action, setAction] = useState<'thumbsUp' | 'thumbsDown' | null>(null)
  const [isSpeaking, setIsSpeaking] = useState<boolean | null>(null)

  const clickThumbsUp = useCallback(async () => {
    if (action) {
      return
    }
    setAction('thumbsUp')
    await Browser.runtime.sendMessage({
      type: 'FEEDBACK',
      data: {
        conversation_id: props.conversationId,
        message_id: props.messageId,
        rating: 'thumbsUp',
      },
    })
  }, [action, props.conversationId, props.messageId])

  const clickThumbsDown = useCallback(async () => {
    if (action) {
      return
    }
    setAction('thumbsDown')
    await Browser.runtime.sendMessage({
      type: 'FEEDBACK',
      data: {
        conversation_id: props.conversationId,
        message_id: props.messageId,
        rating: 'thumbsDown',
        text: '',
        tags: [],
      },
    })
  }, [action, props.conversationId, props.messageId])

  const clickCopyToClipboard = useCallback(async () => {
    await navigator.clipboard.writeText(props.answerText)
    setCopied(true)
  }, [props.answerText])

  function startSpeak() {
    const text = props.answerText
    if (!text) return
    const textChunks = text.split('.').filter((chunk) => chunk.trim().length > 0)

    // clear any previous speech
    window.speechSynthesis.cancel()

    setIsSpeaking(true)
    const speakChunk = (index: number) => {
      if (index >= textChunks.length) {
        setIsSpeaking(null)
        return
      }

      const utterance = new SpeechSynthesisUtterance(textChunks[index])
      utterance.lang = 'pt-BR'
      utterance.rate = 1.25
      utterance.pitch = 0.9
      utterance.volume = 1

      utterance.addEventListener('end', () => {
        speakChunk(index + 1)
      })

      window.speechSynthesis.speak(utterance)
    }

    speakChunk(0)
  }

  const pauseSpeaking = () => {
    window.speechSynthesis.pause()
    setIsSpeaking(false)
  }

  const resumeSpeaking = () => {
    window.speechSynthesis.resume()
    setIsSpeaking(true)
  }

  useEffect(() => {
    if (copied) {
      const timer = setTimeout(() => {
        setCopied(false)
      }, 500)
      return () => clearTimeout(timer)
    }
  }, [copied])

  return (
    <div className="gpt-feedback">
      <span
        onClick={isSpeaking === null ? startSpeak : isSpeaking ? pauseSpeaking : resumeSpeaking}
      >
        {isSpeaking === null ? (
          <UnmuteIcon size={14} />
        ) : isSpeaking ? (
          <MuteIcon size={14} />
        ) : (
          <UnmuteIcon size={14} />
        )}
      </span>
      <span
        onClick={clickThumbsUp}
        className={action === 'thumbsUp' ? 'gpt-feedback-selected' : undefined}
      >
        <ThumbsupIcon size={14} />
      </span>
      <span
        onClick={clickThumbsDown}
        className={action === 'thumbsDown' ? 'gpt-feedback-selected' : undefined}
      >
        <ThumbsdownIcon size={14} />
      </span>
      <span onClick={clickCopyToClipboard}>
        {copied ? <CheckIcon size={14} /> : <CopyIcon size={14} />}
      </span>
    </div>
  )
}

export default memo(ChatGPTFeedback)
