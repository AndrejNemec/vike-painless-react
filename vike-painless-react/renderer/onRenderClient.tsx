import ReactDOM from 'react-dom/client'
import type { PageContextClient } from 'vike/types'
import { getPageElement } from './getPageElement.js'

let root: ReactDOM.Root
export const onRenderClient = async (pageContext: PageContextClient) => {
  const page = await getPageElement(pageContext)
  const container = document.getElementById(pageContext.config.rootId || 'root')!

  // SPA
  if (container.innerHTML === '' || !pageContext.isHydration) {
    if (!root) {
      root = ReactDOM.createRoot(container)
    }
    root.render(page)
    // SSR
  } else {
    root = ReactDOM.hydrateRoot(container, page)
  }
}
