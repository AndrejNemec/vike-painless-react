import './index.css'
import React, { PropsWithChildren } from 'react'
import { Head, ThemeProvider } from 'vike-painless-react/core'
import faviconUrl from '../assets/logo.svg'

const Wrapper = ({ children }: PropsWithChildren<{}>) => {
  return (
    <ThemeProvider>
      <Head>
        <meta charSet='utf-8'/>
        <title>This is default title</title>
        <link rel="icon" sizes="any" type="image/svg+xml" href={faviconUrl}/>
      </Head>
      <div className='p-1'>
        {children}
      </div>
    </ThemeProvider>
  )
}


export default Wrapper