import React from 'react'
import useSWR from 'swr'
import { ICenterCodeTree } from '@beta-titan/shared/data-types'
const fetcher = (url: string) => fetch(url).then((res) => res.json());

export function useCenterBaseGroup(shouldLoad: boolean): {result: Array<ICenterCodeTree>, isLoading: boolean, isError: boolean, mutate: any} {
  const { data, error, mutate } = useSWR('/api/v1/centers/getCenterOfCurrentUser', fetcher)

  return {
    result: data && data.result,
    isLoading: !error && !data,
    isError: error,
    mutate: mutate
  }
}

