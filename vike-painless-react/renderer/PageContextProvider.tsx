import React, { useContext } from 'react'
import { getGlobalObject } from './utils/getGlobalObject.js'
import type { PageContext } from 'vike/types'

const { Context } = getGlobalObject('PageContextProvider.ts', {
  Context: React.createContext<PageContext>(undefined as never)
})

export const PageContextProvider = ({ pageContext, children }: { pageContext: PageContext; children: React.ReactNode }) => {
  if (!pageContext) throw new Error('Argument pageContext missing')
  return <Context.Provider value={pageContext}>{children}</Context.Provider>
}

/** Access the pageContext from any React component */
export const usePageContext = () => {
  const pageContext = useContext(Context)
  if (!pageContext) throw new Error('<PageContextProvider> is needed for being able to use usePageContext()')
  return pageContext
}
