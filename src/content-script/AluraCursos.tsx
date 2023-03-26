import { useEffect, useState } from 'react'
import { TriggerMode } from '../config'
import ChatGPTCard from './ChatGPTCard'

export default function AluraCursos() {
  const [search, setSearch] = useState('')
  const [question, setQuestion] = useState('')
  const [content, setContent] = useState('')

  useEffect(() => {
    // get the input with class="chatgpt-search"
    const searchInput = document.querySelector('.chatgpt-search')

    // when input was selected, dont propagate the event for other elements
    searchInput?.addEventListener('keydown', (e: any) => {
      e.stopPropagation()
    })

    const formattedText = document.querySelector('.formattedText')?.textContent?.trim()
    setContent(formattedText || '')
  }, [document])

  useEffect(() => {
    if (search == '') return setQuestion('')
    setQuestion(`
Responda a pergunta do aluno de forma educada, clara e respeitosa com no máximo 3000 palavras. Use somente o conteúdo da aula abaixo. Se tiver dúvidas e a resposta não estiver explícita no conteúdo diga: "Desculpe, não sei como te ajudar nesse caso, mas você pode perguntar para a comunidade no fórum da Alura."

Conteúdo da aula:
${content}

Pergunta do aluno:
${search}

Responda em Markdown. Respostas diretas e curtas são bem vindas.
  `)
  }, [search])

  useEffect(() => {
    // get textarea class= chatgpt-search
    const textareaElement = document.querySelector('.chatgpt-search') as HTMLElement
    if (textareaElement && search != '') {
      textareaElement.style.height = 'auto'
      textareaElement.style.height = textareaElement.scrollHeight + 'px'
    }
  }, [search])

  function listen() {
    if ('webkitSpeechRecognition' in window) {
      const recognition = new webkitSpeechRecognition()
      recognition.lang = 'pt-BR'
      recognition.interimResults = true

      const textareaElement = document.querySelector('.chatgpt-search') as HTMLTextAreaElement

      recognition.onresult = (event: any) => {
        const result = event.results[event.resultIndex]
        if (result.isFinal) {
          textareaElement.value = result[0].transcript
          setSearch(result[0].transcript)
        } else {
          textareaElement.value = result[0].transcript
        }
      }

      recognition.start()
    } else {
      alert(
        'Seu navegador não suporta o recurso de reconhecimento de voz. Por favor, tente com o Google Chrome.',
      )
    }
  }

  return (
    <div className="chat-gpt-container-cursos">
      <div className="chat-gpt-search-container">
        <textarea
          className="chatgpt-search"
          placeholder="Digite aqui sua dúvida do vídeo"
          onChange={(e) => setSearch(e.target.value)}
          required
        />
        <button id="startButton" onClick={listen}>
          🎤
        </button>
      </div>
      {question && (
        <div className="chat-gpt-card">
          <ChatGPTCard question={question} triggerMode={TriggerMode.Manually} />
        </div>
      )}
    </div>
  )
}
