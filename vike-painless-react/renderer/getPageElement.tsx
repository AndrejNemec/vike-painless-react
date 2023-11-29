import React from 'react'
import { PageContextProvider } from './PageContextProvider.js'
import type { PageContext } from 'vike/types'
import { HeadContext } from './types'
import HeadProvider from '../head/Provider.js'
import { I18nextProvider } from 'react-i18next'
import i18next from 'i18next'

export const getPageElement = async (
  pageContext: PageContext,
  headContext?: HeadContext
): Promise<JSX.Element> => {
  const Layout = pageContext.config.Layout ?? PassThrough
  const Wrapper = pageContext.config.Wrapper ?? PassThrough
  const i18n = typeof pageContext.config.i18n === 'function' ?
   (await pageContext.config.i18n(pageContext)) : 
   (pageContext.config.i18n ?? i18next)
  const { Page, pageProps } = pageContext

  const page = (
    <React.StrictMode>
      <PageContextProvider pageContext={pageContext}>
        <I18nextProvider i18n={i18n}>
          <HeadProvider context={headContext}>
            <Wrapper>
              <Layout>
                {Page ? <Page {...pageProps} /> : null}
              </Layout>
            </Wrapper>
          </HeadProvider>
        </I18nextProvider>
      </PageContextProvider>
    </React.StrictMode >
  )
  return page
}

function PassThrough({ children }: any) {
  return <>{children}</>
}
