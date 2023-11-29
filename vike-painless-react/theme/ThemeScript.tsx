import React from 'react';
import { Head } from '../head/index.js';

export type ThemeType = 'light' | 'dark'
export type ThemeWithAutoType = ThemeType | 'auto'

export interface ColorSchemeScriptProps extends React.ComponentPropsWithoutRef<'script'> {
  defaultColorScheme?: ThemeWithAutoType
  localStorageKey?: string
}

export const getScript = ({
  defaultColorScheme = 'light',
  localStorageKey = 'app-color-scheme'
}: Pick<ColorSchemeScriptProps, 'defaultColorScheme' | 'localStorageKey'>) =>`try {
  var _colorScheme = window.localStorage.getItem("${localStorageKey}");
  var colorScheme = _colorScheme === "light" || _colorScheme === "dark" || _colorScheme === "auto" ? _colorScheme : "${defaultColorScheme}";
  var computedColorScheme = colorScheme !== "auto" ? colorScheme : window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  if (computedColorScheme === "light") {
    document.documentElement.classList.add('light');
    document.documentElement.classList.remove('dark');
  } else {
    document.documentElement.classList.add('dark');
    document.documentElement.classList.remove('light');
  }
  document.documentElement.style.setProperty('color-scheme', computedColorScheme);
} catch (e) {}
`;

export const ThemeScript = ({
  defaultColorScheme = 'light',
  localStorageKey = 'app-color-scheme',
  ...others
}: ColorSchemeScriptProps) => {
  const _defaultColorScheme = ['light', 'dark', 'auto'].includes(defaultColorScheme)
    ? defaultColorScheme
    : 'light';
  return (
    <Head>
        <script
            {...others}
            data-vike-painless-script
        >
            {getScript({
                defaultColorScheme: _defaultColorScheme,
                localStorageKey
            })}
        </script>
    </Head>
  );
}