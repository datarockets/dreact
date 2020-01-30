import { useCallback } from 'react'
import { useDispatch } from 'dreact/helper-store'

import * as actions from './actions'

export function useTriggerSayHello(callbacks) {
  const dispatch = useDispatch()

  return useCallback(() => {
    dispatch(actions.saveMessage.init({ ...callbacks, text: 'Hello' }))
  }, [])
}
