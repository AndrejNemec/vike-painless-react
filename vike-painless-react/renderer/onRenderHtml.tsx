import ReactDOMServer from 'react-dom/server'
import { escapeInject, dangerouslySkipEscape, version } from 'vike/server'
import type { PageContextServer } from 'vike/types'
import { getPageElement } from './getPageElement.js'
import { HeadContext } from './types'

export const onRenderHtml = async (pageContext: PageContextServer) => {
  const headContext: HeadContext = {} as HeadContext

  let pageHtml
  if (!pageContext.Page) {
    // SPA
    pageHtml = ''
  } else {
    const page = await getPageElement(pageContext, headContext)
    // SSR / HTML-only
    pageHtml = ReactDOMServer.renderToString(page)
  }

  return escapeInject`<!DOCTYPE html>
    <html ${dangerouslySkipEscape(headContext.head?.htmlAttributes ? headContext.head.htmlAttributes.toString() : '')}>
      <head>
        ${dangerouslySkipEscape(headContext.head?.meta.toString() || '')}
        ${dangerouslySkipEscape(headContext.head?.title.toString() || '')}
        ${dangerouslySkipEscape(headContext.head?.link.toString() || '')}
        ${dangerouslySkipEscape(headContext.head?.script.toString() || '')}
        ${dangerouslySkipEscape(headContext.head?.style.toString() || '')}
      </head>
      <body ${dangerouslySkipEscape(headContext.head?.bodyAttributes ? headContext.head.bodyAttributes.toString() : '')}>
        ${dangerouslySkipEscape(headContext.head?.noscript.toString() || '')}
        <div id="${dangerouslySkipEscape(pageContext.config.rootId || 'root')}">${dangerouslySkipEscape(pageHtml)}</div>
      </body>
    </html>`
}

const checkVikeVersion = () => {
  if (version) {
    const versionParts = version.split('.').map((s) => parseInt(s, 10)) as [number, number, number]
    if (versionParts[0] > 0) return
    if (versionParts[1] > 4) return
    if (versionParts[2] >= 147) return
  }
  throw new Error('Update Vike to its latest version (or vike@0.4.147 and any version above)')
}

checkVikeVersion()