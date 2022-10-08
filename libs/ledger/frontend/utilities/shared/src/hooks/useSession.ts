import React, { useContext, useEffect } from 'react'
import Router from 'next/router'
import useSWR from 'swr'
import { IStaffLoginSession } from '@beta-titan/shared/data-types';
const fetcher = (url: string) => fetch(url).then((res) => res.json());

// export const SessionInitContext = React.createContext<IStaffLoginSession|null>(null);

export function useSession(): {session: IStaffLoginSession, isLoading: boolean, isError: boolean, mutate: any} {
  const { data, error, mutate } = useSWR('/api/auth/session', fetcher)
  return {
    session: data && data.session,
    isLoading: !error && !data,
    isError: error,
    mutate: mutate
  }
}

