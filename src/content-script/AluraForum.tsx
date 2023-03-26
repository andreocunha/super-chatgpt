import { useEffect, useState } from 'react'
import ChatGPTCard from './ChatGPTCard'

export default function AluraForum() {
  const [buttonClicked, setButtonClicked] = useState(false)
  const [question, setQuestion] = useState('')
  const [makeQuestion, setMakeQuestion] = useState(false)

  useEffect(() => {
    const previewButton = document.querySelector('.preview')
    // Cria um novo elemento de botão e imagem
    const chatGPTButton = document.createElement('button')
    const chatGPTImg = document.createElement('img')

    // Define as classes, o tipo, o título e o texto do botão
    chatGPTButton.className = 'chatgpt-button'
    chatGPTButton.type = 'button'
    chatGPTButton.title = 'Usar ChatGPT'
    // centralizar os itens dentro do botao
    chatGPTButton.style.display = 'flex'
    chatGPTButton.style.justifyContent = 'center'
    chatGPTButton.style.alignItems = 'center'

    // Define a URL da imagem e adiciona-a ao elemento de imagem
    chatGPTImg.src = 'https://seeklogo.com/images/C/chatgpt-logo-02AFA704B5-seeklogo.com.png'

    // Adiciona a imagem como filho do botão
    chatGPTButton.appendChild(chatGPTImg)

    // Insere o novo botão ao lado do botão de pré-visualização existente
    previewButton?.parentNode?.insertBefore(chatGPTButton, previewButton.nextSibling)

    // add a listener to the button
    chatGPTButton.addEventListener('click', () => {
      // console.log('ChatGPT button clicked!');
      setButtonClicked(true)
    })
  }, [])

  useEffect(() => {
    if (buttonClicked) {
      // get the title with class 'topic-header-container-title'
      const title = document.querySelector('.topic-header-container-title')?.textContent?.trim()
      // get the reference with class 'topic-header-relatedLinks'
      const referenceTopic = document
        .querySelector('.topic-header-relatedLinks')
        ?.textContent?.trim()
      // get the text of link <a> with class 'topic-post-author-name'
      const author = document.querySelector('.topic-post-author-name')?.textContent?.trim()
      // get all topic-post
      const topicPostContent = document.querySelectorAll('.topic-post')
      // for each topic-post, get the user name in topic-post-author-name class
      // and the question in topic-post-content class
      let question = ''
      topicPostContent.forEach((topicPost) => {
        const topicPostAuthorName = topicPost
          .querySelector('.topic-post-author-name')
          ?.textContent?.trim()
        const topicPostContent = topicPost.querySelector('.topic-post-content')?.textContent?.trim()
        question += `Interação do ${topicPostAuthorName}:\n ${topicPostContent}\n\n`
      })

      setQuestion(`
        Responda o fórum do aluno ${author} sobre ${title} de forma educada, clara e respeitosa com no máximo 2000 palavras. Começe com "Olá, {primeiro nome}, tudo bem? e finalize com "Espero que tenha te ajudado, bons estudos!".

        Referência do curso: ${referenceTopic}
        Fórum: ${question}

        Reposta com no máximo 2000 palavras. Respostas simples e objetivas. Sempre que possível use trechos de código para explicar sua resposta, se necessário.
      `)

      setButtonClicked(false)
      setMakeQuestion(true)
    }
  }, [buttonClicked])

  return (
    <>
      <div className="chat-gpt-card">
        {makeQuestion && <ChatGPTCard question={question} triggerMode={'always' as any} />}
      </div>
    </>
  )
}
