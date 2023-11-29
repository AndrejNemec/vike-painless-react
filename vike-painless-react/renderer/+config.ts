import type { Config, ConfigEnv, PageContext } from 'vike/types'

export default {
  onRenderHtml: 'import:vike-painless-react/renderer/onRenderHtml:onRenderHtml',
  onRenderClient: 'import:vike-painless-react/renderer/onRenderClient:onRenderClient',
  passToClient: ['pageProps', 'rootId', 'i18n'],
  clientRouting: true,
  hydrationCanBeAborted: true,
  rootId: 'root',
  meta: {
    i18n: {
      env: { client: true, server: true }
    },
    rootId: {
      env: { client: true, server: true }
    },
    Wrapper: {
      env: { client: true, server: true }
    },
    Layout: {
      env: { client: true, server: true }
    },
    renderMode: {
      env: { config: true },
      effect({ configDefinedAt, configValue = 'SSR' }) {
        let env: ConfigEnv | undefined
        if (configValue === 'HTML') env = { server: true }
        if (configValue === 'SPA') env = { client: true }
        if (configValue === 'SSR') env = { server: true, client: true }
        if (!env || typeof configValue !== 'string' || !['HTML', 'SPA', 'SSR'].includes(configValue as string)) throw new Error(`${configDefinedAt} should be 'SSR', 'SPA', or 'HTML'`)
        return {
          meta: {
            Page: { env }
          }
        }
      }
    }
  }
} satisfies Config

// We purposely define the ConfigVikeReact interface in this file: that way we ensure it's always applied whenever the user `import vikeReact from 'vike-painless-react'`
import type { Component } from './types'
import { type i18n } from 'i18next'

declare global {
  namespace VikePackages {
    interface ConfigVikeReact {
      /** The page's root React component */
      Page?: Component
      /** A component, usually common to several pages, that wraps the root component `Layout` */
      Wrapper?: Component
      /** A component, usually common to several pages, that wraps the root component `Page` */
      Layout?: Component,
      /** A function that returns the i18n instance */
      /** The id of the root element */
      rootId?: string
      i18n?: ((pageContext: PageContext) => Promise<i18n>) | i18n
    }
  }
}
