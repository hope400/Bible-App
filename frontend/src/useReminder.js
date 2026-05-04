// useReminder.js
// This hook runs in the background on every page.
// Every 60 seconds it checks: is it reminder time?
// If yes → fires a real browser notification.

import { useEffect, useRef } from 'react'

export function useReminder() {
  const firedToday = useRef(false) // prevent firing multiple times in same minute

  useEffect(() => {
    // Check every 60 seconds
    const interval = setInterval(() => {
      const enabled     = localStorage.getItem('bibble-streak-reminder') !== 'false'
      const savedTime   = localStorage.getItem('bibble-reminder-time') // e.g. "19:30"
      const permission  = Notification.permission

      if (!enabled || !savedTime || permission !== 'granted') return

      const now     = new Date()
      const nowHH   = String(now.getHours()).padStart(2, '0')
      const nowMM   = String(now.getMinutes()).padStart(2, '0')
      const nowTime = `${nowHH}:${nowMM}`

      if (nowTime === savedTime) {
        if (!firedToday.current) {
          firedToday.current = true

          new Notification('Bibble — Daily Reminder 📖', {
            body:    "It's your golden hour. Open the Word and reflect.",
            icon:    '/favicon.svg',
            badge:   '/favicon.svg',
            tag:     'bibble-daily-reminder', // prevents duplicate notifications
          })

          // Reset flag after 2 minutes so it doesn't re-fire
          setTimeout(() => { firedToday.current = false }, 120_000)
        }
      } else {
        // New minute → allow firing again tomorrow
        firedToday.current = false
      }
    }, 60_000) // check every minute

    return () => clearInterval(interval)
  }, [])
}