'use client'
import { useRef } from 'react'
import { Provider } from 'react-redux'
import { makeStore, AppStore } from '@/lib/store'
import { initializeEvents } from '@/lib/features/events/eventsSlice'

export default function StoreProvider({
  events,
  children,
}: {
  events?: []
  children: React.ReactNode
}) {
  const storeRef = useRef<AppStore>()
  if (!storeRef.current) {
    // Create the store instance the first time this renders
    storeRef.current = makeStore()
    // storeRef.current.dispatch(initializeEvents(events))
  }

  return <Provider store={storeRef.current}>{children}</Provider>
}