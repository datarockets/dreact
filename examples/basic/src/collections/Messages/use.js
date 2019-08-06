import { useCallback } from 'react'
import { useSelector } from 'dreact/helper-store'

export function useTriggerSayHello() {
  useSelector(s => console.log(s))

  return useCallback(() => {
    console.log('a')
  })
}
