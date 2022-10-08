import { createContext, ReactNode, useCallback, useContext, useState } from 'react';

export enum ELanguage {
  VI = 'vi',
  EN = 'en'
}

interface ILanguageOption {
  [key: string]: {
    label: string,
    value: ELanguage,
    icon: string
  }
}

const languageOptions: ILanguageOption = {
  [ELanguage.VI] : {
    label: 'Tiếng Việt',
    value: ELanguage.VI,
    icon: '/assets/icons/flags/ic_flag_vn.svg'
  },
  [ELanguage.EN] : {
    label: 'English',
    value: ELanguage.EN,
    icon: '/assets/icons/flags/ic_flag_en.svg'
  },
}


interface ILanguageContextContent {
  [key: string] : string
}

type ILanguageParams = {
  [key: string] : string
} | undefined

export type ILangConvertFunc = (c: ILanguageContextContent, p?: ILanguageParams) => string
interface ILanguageContext {
  current: ELanguage,
  t: ILangConvertFunc,
  tt: (a: Array<string>) => string
  ttt: (...props: Array<string>) => string
  changeLanguage: (lang: ELanguage) => void,
  languageOptions: ILanguageOption
}

const defaultLanguageContext: ILanguageContext = {
  current: ELanguage.VI,
  t: () => { return '' },
  tt: () => { return '' },
  ttt: () => { return '' },
  changeLanguage: () => { return },
  languageOptions: languageOptions

}

const LanguageContext = createContext<ILanguageContext>(defaultLanguageContext);

export const useLangContext = () => useContext<ILanguageContext>(LanguageContext)

export const LanguageProvider = ({children}: {children: ReactNode}) => {

  const [current, setCurrent] = useState<ELanguage>(ELanguage.VI)

  const t = useCallback((c: ILanguageContextContent, p: ILanguageParams) => {
    let str = ''
    if (c[current]) {
      str = c[current]
    } else {
      str = c[Object.keys(c)[0]]
    }
    if (p) {
      for (const k of Object.keys(p)) {
        str = str.replace(new RegExp(`[${k}]`, 'g'), p[k])
      }
    }
    return str

  }, [current])

  const tt = useCallback((a: Array<string>) => {
    return t({
      [ELanguage.VI]: a[0],
      [ELanguage.EN]: a[1],
    }, {})
  }, [t])

  const ttt = useCallback((...a: Array<string>) => {
    return t({
      [ELanguage.VI]: a[0],
      [ELanguage.EN]: a[1],
    }, {})
  }, [t])

  const changeLanguage = useCallback((language: ELanguage) => {
    setCurrent(language)
  }, [])

  return <LanguageContext.Provider value={
    {
      current: current,
      t: t,
      tt: tt,
      ttt,
      changeLanguage: changeLanguage,
      languageOptions: languageOptions
    }
  }>
    {children}
  </LanguageContext.Provider>
}

