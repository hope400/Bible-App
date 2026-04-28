import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { DAILY_VERSES, useBible } from '../context/BibleContext'
import Navbar from '../components/Navbar'
import './DailyVerse.css'

function getDayOfYear(date) {
  const d = new Date(date)
  d.setHours(12, 0, 0, 0)
  const start = new Date(d.getFullYear(), 0, 0)
  return Math.floor((d - start) / 864e5)
}

function getVerseForDate(date) {
  const day = getDayOfYear(date)
  return DAILY_VERSES[day % DAILY_VERSES.length]
}

function buildCalendarDays() {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const days = []
  for (let offset = -180; offset <= 90; offset++) {
    const d = new Date(today)
    d.setDate(today.getDate() + offset)
    d.setHours(0, 0, 0, 0)
    days.push({
      date:     new Date(d),
      offset,
      doy:      getDayOfYear(d),
      verse:    getVerseForDate(d),
      isPast:   offset < 0,
      isToday:  offset === 0,
      isFuture: offset > 0,
    })
  }
  return days
}

function groupByMonth(days) {
  const months = {}
  days.forEach(day => {
    const key = `${day.date.getFullYear()}-${day.date.getMonth()}`
    if (!months[key]) months[key] = { year: day.date.getFullYear(), month: day.date.getMonth(), days: [] }
    months[key].days.push(day)
  })
  return Object.values(months)
}

const MONTH_NAMES = ['January','February','March','April','May','June','July','August','September','October','November','December']
const MONTH_SHORT = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']
const DAY_NAMES   = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat']

function DailyVerse() {
  const navigate                            = useNavigate()
  const { dailyVerseText, fetchDailyVerse } = useBible()

  const today      = new Date()
  today.setHours(0, 0, 0, 0)
  const days       = buildCalendarDays()
  const todayVerse = getVerseForDate(today)
  const months     = groupByMonth(days)

  const [selected, setSelected] = useState(days.find(d => d.offset === 1))

  useEffect(() => { fetchDailyVerse() }, [])

  const goToVerse = (verse) => {
    navigate('/bible', {
      state: {
        bookId:        verse.bookId,
        chapterId:     verse.chapterId,
        verseNumber:   verse.verseNumber,
        bookName:      verse.ref.split(' ')[0],
        chapterNumber: verse.chapterId.split('.')[1],
      }
    })
  }

  return (
    <div className="dv-wrapper">
      <Navbar />

      <div className="dv-header">
        <p className="dv-eyebrow">WORD FOR EVERY DAY</p>
        <h1 className="dv-title">Daily Verse</h1>
        <p className="dv-subtitle">
          {today.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
        </p>
      </div>

      <div className="dv-today-card" onClick={() => goToVerse(todayVerse)}>
        <p className="dv-today-label">TODAY'S VERSE</p>
        <p className="dv-today-text">"{dailyVerseText || todayVerse.ref}"</p>
        <p className="dv-today-ref">{todayVerse.ref.toUpperCase()}</p>
        <p className="dv-today-cta">READ IN BIBLE →</p>
      </div>

      {selected && (
        <div className="dv-preview">
          <div className="dv-preview-inner">
            <div className="dv-preview-top">
              <div>
                <p className="dv-preview-date">
                  {selected.isToday ? 'Today' : selected.isPast ? 'Past' : selected.offset === 1 ? 'Tomorrow' : `In ${selected.offset} days`}
                  {' · '}
                  {selected.date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                </p>
                <p className="dv-preview-ref">{selected.verse.ref}</p>
              </div>
              {selected.isToday  && <span className="dv-today-badge">TODAY</span>}
              {selected.isPast   && <span className="dv-past-badge">PAST</span>}
              {selected.isFuture && (
                <span className="dv-future-badge">
                  {selected.offset === 1 ? 'TOMORROW' : `IN ${selected.offset} DAYS`}
                </span>
              )}
            </div>
            <button className="dv-preview-btn" onClick={() => goToVerse(selected.verse)}>
              Read {selected.verse.ref} in Bible →
            </button>
          </div>
        </div>
      )}

      <div className="dv-calendar-section">
        <p className="dv-calendar-label">VERSE CALENDAR</p>
        <p className="dv-calendar-sub">Tap any day to see its verse — past, present & upcoming</p>
        {months.map((monthData, mi) => {
          const firstDayOfWeek = monthData.days[0].date.getDay()
          const blanks = Array.from({ length: firstDayOfWeek })
          return (
            <div key={mi} className="dv-month-block">
              <p className="dv-month-label">{MONTH_NAMES[monthData.month]} {monthData.year}</p>
              <div className="dv-day-headers">
                {DAY_NAMES.map(d => <div key={d} className="dv-day-header">{d}</div>)}
              </div>
              <div className="dv-month-grid">
                {blanks.map((_, i) => <div key={`b${i}`} className="dv-blank-cell" />)}
                {monthData.days.map((day, di) => (
                  <button
                    key={di}
                    className={`dv-day-cell ${day.isToday ? 'today' : ''} ${day.isPast ? 'past' : ''} ${day.isFuture ? 'future' : ''} ${selected?.doy === day.doy ? 'selected' : ''}`}
                    onClick={() => setSelected(day)}
                  >
                    <span className="dv-cell-date">{day.date.getDate()}</span>
                    <span className="dv-cell-ref">{day.verse.ref.split(':')[0]}</span>
                  </button>
                ))}
              </div>
            </div>
          )
        })}
      </div>

      <div className="dv-upcoming">
        <p className="dv-upcoming-label">NEXT 7 DAYS</p>
        <div className="dv-upcoming-list">
          {days.filter(d => d.offset >= 1 && d.offset <= 7).map((day, i) => (
            <div key={i} className="dv-upcoming-item" onClick={() => setSelected(day)}>
              <div className="dv-upcoming-date-col">
                <p className="dv-upcoming-day">{DAY_NAMES[day.date.getDay()]}</p>
                <p className="dv-upcoming-num">{day.date.getDate()}</p>
                <p className="dv-upcoming-mon">{MONTH_SHORT[day.date.getMonth()]}</p>
              </div>
              <div className="dv-upcoming-verse">
                <p className="dv-upcoming-ref">{day.verse.ref}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <footer className="dv-footer">
        <p>"His mercies are new every morning." — Lamentations 3:23</p>
      </footer>
    </div>
  )
}

export default DailyVerse
