import { render } from 'preact'
import '../base.css'
import { getUserConfig, Language, Theme } from '../config'
import { detectSystemColorScheme } from '../utils'
import ChatGPTContainer from './ChatGPTContainer'
import { config, SearchEngine } from './search-engine-configs'
import './styles.scss'
import { getGoogleSearchResult, getPossibleElementByQuerySelector } from './utils'
import AluraForum from './AluraForum'

async function mount(question: string, siteConfig: SearchEngine) {
  const container = document.createElement('div')
  container.className = 'chat-gpt-container'

  const userConfig = await getUserConfig()
  let theme: Theme
  if (userConfig.theme === Theme.Auto) {
    theme = detectSystemColorScheme()
  } else {
    theme = userConfig.theme
  }
  if (theme === Theme.Dark) {
    container.classList.add('gpt-dark')
  } else {
    container.classList.add('gpt-light')
  }

  const siderbarContainer = getPossibleElementByQuerySelector(siteConfig.sidebarContainerQuery)
  if (siderbarContainer) {
    siderbarContainer.prepend(container)
  } else {
    container.classList.add('sidebar-free')
    const appendContainer = getPossibleElementByQuerySelector(siteConfig.appendContainerQuery)
    if (appendContainer) {
      appendContainer.appendChild(container)
    }
  }

  render(
    <ChatGPTContainer question={question} triggerMode={userConfig.triggerMode || 'always'} />,
    container,
  )
}

const siteRegex = new RegExp(Object.keys(config).join('|') + '|cursos\\.alura\\.com\\.br\\/forum');
const siteName = location.hostname.match(siteRegex)![0]
const siteConfig = config[siteName]

async function run() {
  const searchInput = getPossibleElementByQuerySelector<HTMLInputElement>(siteConfig.inputQuery)
  if (searchInput && searchInput.value) {
    console.debug('Mount ChatGPT on', siteName)
    const userConfig = await getUserConfig()
    let question = searchInput.value

    if (userConfig.googleSearch) {
      question = (await getGoogleSearchResult(question)) + `\n\nQuestion:\n ${question}`
    }

    question =
      userConfig.language === Language.Auto  ? 
      question
      : 
      `Answer the question in ${userConfig.language}:\n\n ${question}`
    mount(question, siteConfig)
  }
}

run()

if (siteConfig.watchRouteChange) {
  siteConfig.watchRouteChange(run)
}

function watchTheUrlChange() {
  // if url has https://cursos.alura.com.br/forum/...
  if (location.href.match(/https:\/\/cursos\.alura\.com\.br\/forum\/.*/)) {
    // wait for the page to load
    window.onload = function() {
      const form = document.querySelector('.topic-reply-form') as HTMLFormElement;
      // get class container inside section calss="topic-reply"
      if (form) {
        // add a div inside the form with all elements inside it
        // form.innerHTML = `
        //   <div>
        //   ${form.innerHTML}
        //   </div>
        // `;

        // render AluraForum component on top of '.topic-reply-form'
        const container = document.createElement('div');
        container.className = 'chat-gpt-container gpt-light sidebar-free';
        document.querySelector('.topic-reply-form')?.prepend(container);

        // add styles in form to make display: flex and row direction
        // form.style.display = 'flex';
        // form.style.flexDirection = 'row-reverse';
        render(<AluraForum />, container);
      }
    }
  }
}

watchTheUrlChange();