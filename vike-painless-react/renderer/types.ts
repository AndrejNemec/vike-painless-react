export type { Component }

import type { ComponentPropsWithoutRef, ReactElement } from 'react'
import { HeadProvider } from '../head/index.js'

// type Component = (props: Record<string, unknown>) => ReactElement
type Component = (props: any) => ReactElement

export type HeadContext = NonNullable<ComponentPropsWithoutRef<typeof HeadProvider>['context']>

declare global {
  namespace Vike {
    interface PageContext {
      Page?: Component
      Wrapper?: Component
      Layout?: Component
      pageProps?: Record<string, unknown>
      userAgent? :string;
      rootId?: string
    }
  }
}
