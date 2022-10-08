import React, { useContext, useEffect } from 'react'
import Router from 'next/router'
import useSWR from 'swr'
import { ICenter } from '@beta-titan/shared/data-types'

export function useCenterSettings(): {center: ICenter, isLoading: boolean, isError: boolean, mutate: any} {
  const { data, error, mutate } = useSWR('/api/v1/centers/getCurrentCenterSetting')

  return {
    center: data && data.result,
    isLoading: !error && !data,
    isError: error,
    mutate: mutate
  }
}

