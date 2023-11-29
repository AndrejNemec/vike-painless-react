import { initReactI18next } from "react-i18next"
import i18next from "i18next"

const initI18n = async () => {
  const i18n = await i18next.createInstance()

  await i18n.use(initReactI18next)
    .init({
      defaultNS: 'common',
      ns: [
        'common',
      ],
      lng: 'en',
      fallbackLng: 'en',
      debug: false,
      interpolation: {
        escapeValue: false
      },
      partialBundledLanguages: true,
      resources: {
        en: {
          common: {
            hello: 'Hello world'
          }
        }
      }
    })

  return i18n
}

export default initI18n