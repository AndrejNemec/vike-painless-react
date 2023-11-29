import { Head, useColorScheme } from 'vike-painless-react/core'
import React, { useId } from 'react'
import { Counter } from './Counter'
import { useTranslation } from 'react-i18next'

const Page = () => {
  const testReactId = useId()
  const {t} = useTranslation('common')
  const { setTheme, currentTheme } = useColorScheme()


  return (
    <>
      <Head>
        <title>{t('hello')}</title>
      </Head>
      <h1>Vike painless react</h1>
      This page is:
      <ul>
        <li>Rendered to HTML.</li>
        <li>
          Interactive. <Counter />
        </li>
        <li>
          React ssr/client id: {testReactId}
        </li>
        <li>Translations: {t('hello')}</li>
        <li>Mode: {currentTheme}</li>
        <li>Change theme: <button onClick={() => setTheme(currentTheme === 'dark' ? 'light' : 'dark')}>{currentTheme}</button></li>
      </ul>
    </>
  )
}

export default Page
