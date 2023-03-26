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

  return (
    <div className="chat-gpt-container-cursos">
      <textarea
        className="chatgpt-search"
        placeholder="Digite aqui sua dúvida do vídeo"
        onChange={(e) => setSearch(e.target.value)}
        required
      />
      {question && (
        <div className="chat-gpt-card">
          <ChatGPTCard question={question} triggerMode={TriggerMode.Manually} />
        </div>
      )}
    </div>
  )
}
