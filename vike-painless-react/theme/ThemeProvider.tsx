import React, { ReactNode, createContext, useContext, useEffect, useMemo, useState, useRef } from 'react'
import { ThemeScript, type ThemeWithAutoType, ThemeType } from "./ThemeScript.js"
import { getGlobalObject } from '../renderer/utils/getGlobalObject'

export type ThemeProviderProps = {
    defaultColorScheme?: ThemeWithAutoType
    localStorageKey?: string
    children?: ReactNode
}

const { Context: ThemeContext } = getGlobalObject('ThemeProvider.tsx', {
    Context: createContext<{
        setTheme: (theme: ThemeWithAutoType) => void
        theme: ThemeWithAutoType
        currentTheme: ThemeType
    }>({} as any)
})

export const useColorScheme = () => {
    return useContext(ThemeContext)
}

const getThemeFromStorage = (localStorageKey: string): ThemeWithAutoType | null => {
    if (typeof localStorage !== 'undefined') {
        try {
            const theme = localStorage.getItem(localStorageKey)
            if (theme === 'light' || theme === 'dark' || theme === 'auto') {
                return theme
            }
        } catch (e) { }
    }
    return null
}

const getSystemTheme = (): ThemeType => {
    if (typeof window !== 'undefined') {
        return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
    }
    return 'light'
}

export const ThemeProvider = ({
    defaultColorScheme = 'auto',
    localStorageKey = 'app-color-scheme',
    children
}: ThemeProviderProps) => {
    const [theme, setThemeState] = useState<ThemeWithAutoType>(defaultColorScheme)
    const [currentTheme, setCurrentTheme] = useState<ThemeType>(theme === 'auto' ? 'light' : theme)

    useEffect(() => {
        const newTheme = getThemeFromStorage(localStorageKey) || defaultColorScheme
        setThemeState(newTheme)
        if (newTheme === 'auto') {
            setCurrentTheme(getSystemTheme())
        }
    }, [])

    useEffect(() => {
        if (theme === 'auto') {
            setCurrentTheme(getSystemTheme())
            return
        }
        setCurrentTheme(theme)
    }, [theme])

    useEffect(() => {
        if (currentTheme === 'light') {
            document.documentElement.classList.add('light')
            document.documentElement.classList.remove('dark')
        } else {
            document.documentElement.classList.add('dark')
            document.documentElement.classList.remove('light')
        }
        document.documentElement.style.setProperty('color-scheme', currentTheme)
    }, [currentTheme])

    useEffect(() => {
        const handleStorage = (e: StorageEvent) => {
            if (e.key !== localStorageKey) {
                return
            }
            setThemeState(getThemeFromStorage(localStorageKey) || defaultColorScheme)
        }

        const handleMedia = () => {
            if (theme === 'auto') {
                setCurrentTheme(getSystemTheme())
            }
        }

        window.addEventListener('storage', handleStorage)
        
        const darkModeMediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
        darkModeMediaQuery.addListener(handleMedia)

        return () => {
            window.removeEventListener('storage', handleStorage)
            darkModeMediaQuery.removeListener(handleMedia)
        }

    }, [])

    const setTheme = (theme: ThemeWithAutoType) => {
        setThemeState(theme)
        localStorage.setItem(localStorageKey, theme)
    }

    return (
        <ThemeContext.Provider value={{
            theme,
            currentTheme,
            setTheme
        }}>
            <ThemeScript
                defaultColorScheme={defaultColorScheme}
                localStorageKey={localStorageKey}
            />
            {children}
        </ThemeContext.Provider>
    )
}