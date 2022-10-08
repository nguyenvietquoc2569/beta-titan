import React, { useContext, useEffect } from 'react'
import Router from 'next/router'
import useSWR, { Cache, useSWRConfig } from 'swr'
import { INotification, IStaffLoginSession } from '@beta-titan/shared/data-types';
const fetcher = (url: string) => fetch(url).then((res) => res.json());

// export const SessionInitContext = React.createContext<IStaffLoginSession|null>(null);

export function useStaffNotifications(): {notifications: Array<INotification>, isLoading: boolean, isError: boolean, mutate: any, cache: Cache<any>} {
  const { data, error, mutate } = useSWR('/api/v1/notifications/get', fetcher)
  const { cache } = useSWRConfig()
  return {
    notifications: data && data.data,
    isLoading: !error && !data,
    isError: error,
    mutate: mutate,
    cache: cache
  }
}

