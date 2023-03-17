import Browser from 'webextension-polyfill'

export function getPossibleElementByQuerySelector<T extends Element>(
  queryArray: string[],
): T | undefined {
  for (const query of queryArray) {
    const element = document.querySelector(query)
    if (element) {
      return element as T
    }
  }
}

export function endsWithQuestionMark(question: string) {
  return (
    question.endsWith('?') || // ASCII
    question.endsWith('？') || // Chinese/Japanese
    question.endsWith('؟') || // Arabic
    question.endsWith('⸮') // Arabic
  )
}

export function isBraveBrowser() {
  return (navigator as any).brave?.isBrave()
}

export async function shouldShowRatingTip() {
  const { ratingTipShowTimes = 0 } = await Browser.storage.local.get('ratingTipShowTimes')
  if (ratingTipShowTimes >= 5) {
    return false
  }
  await Browser.storage.local.set({ ratingTipShowTimes: ratingTipShowTimes + 1 })
  return ratingTipShowTimes >= 2
}

export async function getGoogleSearchResult(question: string) {
  try {
    const response = await fetch(`https://www.google.com/search?q=${question}`);
    const html = await response.text();
    const spans = new DOMParser().parseFromString(html, 'text/html').querySelectorAll('.hgKElc');
    const spansTexts = Array.from(spans).map(span => span?.textContent?.trim()).filter(Boolean);
  
    const divs = new DOMParser().parseFromString(html, 'text/html').querySelectorAll('.kvH3mc.BToiNc.UK95Uc');
    const texts = Array.from(divs).map(div => div?.textContent?.trim()).filter(Boolean);
  
    const results = spansTexts.concat(texts).join('\n\n');
    return `
      Use your knowledge and Web search to answer the question.
      Web search results:
      ${results}
    `;
  } catch (error) {
    console.error(error);
    return '';
  }
  
}