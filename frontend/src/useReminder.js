
import { useEffect, useRef } from 'react'

export function useReminder() {
  const firedToday = useRef(false)

  useEffect(() => {
  
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
            tag:     'bibble-daily-reminder', 
          })

      
          setTimeout(() => { firedToday.current = false }, 120_000)
        }
      } else {
        
        firedToday.current = false
      }
    }, 60_000) 

    return () => clearInterval(interval)
  }, [])
}