import Browser from 'webextension-polyfill'
import { Theme } from './config'

export function detectSystemColorScheme() {
  if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    return Theme.Escuro
  }
  return Theme.Claro
}

export function getExtensionVersion() {
  return Browser.runtime.getManifest().version
}
