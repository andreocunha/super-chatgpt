import { useEffect, useState } from "react"
import ChatGPTCard from "./ChatGPTCard";

export default function AluraForum() {
  const [buttonClicked, setButtonClicked] = useState(false);
  const [question, setQuestion] = useState("");
  const [makeQuestion, setMakeQuestion] = useState(false);

  useEffect(() => {
    var previewButton = document.querySelector('.preview');
    // Cria um novo elemento de botão e imagem
    var chatGPTButton = document.createElement('button');
    var chatGPTImg = document.createElement('img');

    // Define as classes, o tipo, o título e o texto do botão
    chatGPTButton.className = 'chatgpt-button';
    chatGPTButton.type = 'button';
    chatGPTButton.title = 'Usar ChatGPT';

    // Define a URL da imagem e adiciona-a ao elemento de imagem
    chatGPTImg.src = 'https://seeklogo.com/images/C/chatgpt-logo-02AFA704B5-seeklogo.com.png';

    // Adiciona a imagem como filho do botão
    chatGPTButton.appendChild(chatGPTImg);

    // Insere o novo botão ao lado do botão de pré-visualização existente
    previewButton?.parentNode?.insertBefore(chatGPTButton, previewButton.nextSibling);

    // add a listener to the button
    chatGPTButton.addEventListener('click', () => {
      // console.log('ChatGPT button clicked!');
      setButtonClicked(true);
    });
  }, [])

  useEffect(() => {
    if (buttonClicked) {
      // get the title with class 'topic-header-container-title'
      const title = document.querySelector('.topic-header-container-title')?.textContent?.trim();
      // get the reference with class 'topic-header-relatedLinks'
      const referenceTopic = document.querySelector('.topic-header-relatedLinks')?.textContent?.trim();
      // get the text of link <a> with class 'topic-post-author-name'
      const author = document.querySelector('.topic-post-author-name')?.textContent?.trim();
      // get the question with class 'topic-post-content'
      const question = document.querySelector('.topic-post-content')?.textContent?.trim();

      setQuestion(`
        Responda a duvida de ${author} sobre ${title} de forma educada e respeitosa.
        Referência do curso: ${referenceTopic}
        Pergunta: ${question}

        Sempre que possível use trechos de código para explicar sua resposta, se necessário.
      `)

      // console.log('title', title);
      // console.log('referenceTopic', referenceTopic);
      // console.log('author', author);
      // console.log('question', question);
      setButtonClicked(false);
      setMakeQuestion(true);
    }
  }, [buttonClicked])

  return (
    <>
      <div className="chat-gpt-card">
        {
          makeQuestion && (
            <ChatGPTCard
              question={question}
              triggerMode={'always' as any}
            />
          )
        }
      </div>
    </>
  )
}