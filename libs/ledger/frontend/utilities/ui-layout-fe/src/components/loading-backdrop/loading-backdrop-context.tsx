import { LoadingScreen } from '@beta-titan/ledger/frontend/utilities/core-components'
import { Backdrop, CircularProgress } from '@mui/material'
import { createContext, ReactNode, useContext, useState } from 'react'

const LoadingContext = createContext<{
  setLoading: (isLoading: boolean) => void,
}>({
  setLoading: () => { console.log('') }
})

export const LoadingBackDrop = ({children}: {children: ReactNode}) => {
  const [isLoading, setLoading] = useState(false)
  return <LoadingContext.Provider value={{
    setLoading
  }}>
    <Backdrop
      sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}
      open={isLoading}
    >
      <LoadingScreen></LoadingScreen>
    </Backdrop>
    {children}
  </LoadingContext.Provider>
}

export const useLoading = () => useContext(LoadingContext)