import { createContext, useContext, useState } from 'react'
import axios from 'axios'

const BibleContext = createContext()

const API_KEY = import.meta.env.VITE_BIBLE_API_KEY
const BASE_URL = 'https://rest.api.bible/v1'
const BIBLE_ID = 'de4e12af7f28f599-02'

const api = axios.create({
  baseURL: BASE_URL,
  headers: { 'api-key': API_KEY }
})

export const DAILY_VERSES = [
  { bookId: 'PSA', chapterId: 'PSA.23',  verseId: 'PSA.23.1',    verseNumber: 1,   ref: 'Psalm 23:1' },
  { bookId: 'JHN', chapterId: 'JHN.3',   verseId: 'JHN.3.16',   verseNumber: 16,  ref: 'John 3:16' },
  { bookId: 'PSA', chapterId: 'PSA.27',  verseId: 'PSA.27.1',    verseNumber: 1,   ref: 'Psalm 27:1' },
  { bookId: 'PHP', chapterId: 'PHP.4',   verseId: 'PHP.4.13',    verseNumber: 13,  ref: 'Philippians 4:13' },
  { bookId: 'ISA', chapterId: 'ISA.40',  verseId: 'ISA.40.31',   verseNumber: 31,  ref: 'Isaiah 40:31' },
  { bookId: 'JER', chapterId: 'JER.29',  verseId: 'JER.29.11',   verseNumber: 11,  ref: 'Jeremiah 29:11' },
  { bookId: 'ROM', chapterId: 'ROM.8',   verseId: 'ROM.8.28',    verseNumber: 28,  ref: 'Romans 8:28' },
  { bookId: 'PSA', chapterId: 'PSA.46',  verseId: 'PSA.46.1',    verseNumber: 1,   ref: 'Psalm 46:1' },
  { bookId: 'MAT', chapterId: 'MAT.6',   verseId: 'MAT.6.33',    verseNumber: 33,  ref: 'Matthew 6:33' },
  { bookId: 'PSA', chapterId: 'PSA.119', verseId: 'PSA.119.105', verseNumber: 105, ref: 'Psalm 119:105' },
  { bookId: 'JHN', chapterId: 'JHN.14',  verseId: 'JHN.14.27',  verseNumber: 27,  ref: 'John 14:27' },
  { bookId: '1PE', chapterId: '1PE.5',   verseId: '1PE.5.7',     verseNumber: 7,   ref: '1 Peter 5:7' },
  { bookId: 'PRO', chapterId: 'PRO.3',   verseId: 'PRO.3.5',     verseNumber: 5,   ref: 'Proverbs 3:5' },
  { bookId: 'PSA', chapterId: 'PSA.121', verseId: 'PSA.121.2',   verseNumber: 2,   ref: 'Psalm 121:2' },
  { bookId: 'JOS', chapterId: 'JOS.1',   verseId: 'JOS.1.9',     verseNumber: 9,   ref: 'Joshua 1:9' },
  { bookId: 'PHP', chapterId: 'PHP.4',   verseId: 'PHP.4.7',     verseNumber: 7,   ref: 'Philippians 4:7' },
  { bookId: 'ISA', chapterId: 'ISA.41',  verseId: 'ISA.41.10',   verseNumber: 10,  ref: 'Isaiah 41:10' },
  { bookId: 'LAM', chapterId: 'LAM.3',   verseId: 'LAM.3.23',    verseNumber: 23,  ref: 'Lamentations 3:23' },
  { bookId: 'MAT', chapterId: 'MAT.11',  verseId: 'MAT.11.28',   verseNumber: 28,  ref: 'Matthew 11:28' },
  { bookId: 'ROM', chapterId: 'ROM.15',  verseId: 'ROM.15.13',   verseNumber: 13,  ref: 'Romans 15:13' },
  { bookId: 'PSA', chapterId: 'PSA.34',  verseId: 'PSA.34.8',    verseNumber: 8,   ref: 'Psalm 34:8' },
  { bookId: 'NEH', chapterId: 'NEH.8',   verseId: 'NEH.8.10',    verseNumber: 10,  ref: 'Nehemiah 8:10' },
  { bookId: 'HEB', chapterId: 'HEB.11',  verseId: 'HEB.11.1',    verseNumber: 1,   ref: 'Hebrews 11:1' },
  { bookId: 'PSA', chapterId: 'PSA.37',  verseId: 'PSA.37.4',    verseNumber: 4,   ref: 'Psalm 37:4' },
  { bookId: 'JHN', chapterId: 'JHN.15',  verseId: 'JHN.15.5',   verseNumber: 5,   ref: 'John 15:5' },
  { bookId: 'COL', chapterId: 'COL.3',   verseId: 'COL.3.17',    verseNumber: 17,  ref: 'Colossians 3:17' },
  { bookId: 'EPH', chapterId: 'EPH.2',   verseId: 'EPH.2.10',    verseNumber: 10,  ref: 'Ephesians 2:10' },
  { bookId: 'PSA', chapterId: 'PSA.107', verseId: 'PSA.107.1',   verseNumber: 1,   ref: 'Psalm 107:1' },
  { bookId: 'GAL', chapterId: 'GAL.5',   verseId: 'GAL.5.22',    verseNumber: 22,  ref: 'Galatians 5:22' },
  { bookId: 'REV', chapterId: 'REV.21',  verseId: 'REV.21.4',    verseNumber: 4,   ref: 'Revelation 21:4' },
]

export const MOOD_VERSES = {
  Peaceful: [
    { text: '"The Lord gives strength to his people; the Lord blesses his people with peace."', ref: 'PSALM 29:11', bookId: 'PSA', chapterId: 'PSA.29', verseNumber: 11 },
    { text: '"You will keep in perfect peace those whose minds are steadfast."',                 ref: 'ISAIAH 26:3', bookId: 'ISA', chapterId: 'ISA.26', verseNumber: 3 },
  ],
  Joyful: [
    { text: '"Shout for joy to the Lord, all the earth. Worship the Lord with gladness."', ref: 'PSALM 100:1',   bookId: 'PSA', chapterId: 'PSA.100', verseNumber: 1 },
    { text: '"The joy of the Lord is your strength."',                                     ref: 'NEHEMIAH 8:10', bookId: 'NEH', chapterId: 'NEH.8',   verseNumber: 10 },
  ],
  Seeking: [
    { text: '"Call to me and I will answer you, and will tell you great and hidden things that you have not known."', ref: 'JEREMIAH 33:3', bookId: 'JER', chapterId: 'JER.33', verseNumber: 3 },
    { text: '"And your ears shall hear a word behind you, saying, This is the way, walk in it."',                    ref: 'ISAIAH 30:21',  bookId: 'ISA', chapterId: 'ISA.30', verseNumber: 21 },
  ],
  Anxious: [
    { text: '"Cast all your anxiety on him because he cares for you."',                                                          ref: '1 PETER 5:7',     bookId: '1PE', chapterId: '1PE.5', verseNumber: 7 },
    { text: '"Do not be anxious about anything, but in every situation, by prayer and petition, present your requests to God."', ref: 'PHILIPPIANS 4:6', bookId: 'PHP', chapterId: 'PHP.4', verseNumber: 6 },
  ],
  Grateful: [
    { text: '"Give thanks to the Lord, for he is good; his love endures forever."', ref: 'PSALM 107:1', bookId: 'PSA', chapterId: 'PSA.107', verseNumber: 1 },
    { text: '"Every good and perfect gift is from above."',                          ref: 'JAMES 1:17',  bookId: 'JAS', chapterId: 'JAS.1',   verseNumber: 17 },
  ],
}

function parseVersesFromHtml(html) {
  if (!html) return []
  const parser = new DOMParser()
  const doc    = parser.parseFromString(html, 'text/html')
  const verses = []
  doc.querySelectorAll('p').forEach(p => {
    const span = p.querySelector('span[data-number]')
    if (!span) return
    const number = parseInt(span.getAttribute('data-number'))
    if (isNaN(number)) return
    span.remove()
    const text = p.textContent.replace(/\s+/g, ' ').trim()
    if (text) verses.push({ number, text })
  })
  return verses
}

export const BibleProvider = ({ children }) => {
  const [books,          setBooks]         = useState([])
  const [chapters,       setChapters]      = useState([])
  const [verses,         setVerses]        = useState([])
  const [currentBook,    setCurrentBook]   = useState(null)
  const [currentChapter, setCurrentChapter]= useState(null)
  const [loading,        setLoading]       = useState(false)
  const [highlights,     setHighlights]    = useState(() => JSON.parse(localStorage.getItem('bibble-highlights') || '{}'))
  const [favorites,      setFavorites]     = useState(() => JSON.parse(localStorage.getItem('bibble-favorites')  || '{}'))
  const [notes,          setNotes]         = useState(() => JSON.parse(localStorage.getItem('bibble-notes')      || '{}'))
  const [dailyVerseText, setDailyVerseText]= useState(localStorage.getItem('bibble-daily-text') || '')
  const [dailyVerseDate, setDailyVerseDate]= useState(localStorage.getItem('bibble-daily-date') || '')

  const _now = new Date()
  _now.setHours(12, 0, 0, 0)
  const dayOfYear  = Math.floor((_now - new Date(_now.getFullYear(), 0, 0)) / 864e5)
  const dailyVerse = DAILY_VERSES[dayOfYear % DAILY_VERSES.length]

  const fetchBooks = async () => {
    try {
      setLoading(true)
      const res = await api.get(`/bibles/${BIBLE_ID}/books`)
      setBooks(res.data.data)
    } catch (err) { console.error(err) }
    finally { setLoading(false) }
  }

  const fetchChapters = async (bookId) => {
    try {
      setLoading(true)
      const res = await api.get(`/bibles/${BIBLE_ID}/books/${bookId}/chapters`)
      setChapters(res.data.data)
    } catch (err) { console.error(err) }
    finally { setLoading(false) }
  }

  const fetchChapterContent = async (chapterId) => {
    try {
      setLoading(true)
      const res = await api.get(`/bibles/${BIBLE_ID}/chapters/${chapterId}`, {
        params: { 'content-type': 'html', 'include-verse-numbers': true }
      })
      const parsed = parseVersesFromHtml(res.data.data.content)
      setVerses(parsed)
    } catch (err) { console.error(err) }
    finally { setLoading(false) }
  }

  const fetchDailyVerse = async () => {
    const todayKey = new Date().toDateString()
    if (dailyVerseDate === todayKey && dailyVerseText) return
    try {
      const res = await api.get(`/bibles/${BIBLE_ID}/verses/${dailyVerse.verseId}`, {
        params: { 'content-type': 'text' }
      })
      const text = res.data.data.content?.replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim()
      setDailyVerseText(text)
      setDailyVerseDate(todayKey)
      localStorage.setItem('bibble-daily-text', text)
      localStorage.setItem('bibble-daily-date', todayKey)
    } catch (err) { console.error('Daily verse fetch error:', err) }
  }

  const toggleHighlight = (verseId) => {
    setHighlights(prev => {
      const next = { ...prev }
      next[verseId] ? delete next[verseId] : (next[verseId] = true)
      localStorage.setItem('bibble-highlights', JSON.stringify(next))
      return next
    })
  }

  const toggleFavorite = (verseId, verseText, verseRef) => {
    setFavorites(prev => {
      const next = { ...prev }
      next[verseId] ? delete next[verseId] : (next[verseId] = { text: verseText, ref: verseRef })
      localStorage.setItem('bibble-favorites', JSON.stringify(next))
      return next
    })
  }

  const saveNote = (verseId, noteText) => {
    setNotes(prev => {
      const next = { ...prev }
      noteText.trim() ? (next[verseId] = noteText) : delete next[verseId]
      localStorage.setItem('bibble-notes', JSON.stringify(next))
      return next
    })
  }

  return (
    <BibleContext.Provider value={{
      books, chapters, verses,
      currentBook,    setCurrentBook,
      currentChapter, setCurrentChapter,
      loading,
      dailyVerse, dailyVerseText, fetchDailyVerse,
      highlights, favorites, notes,
      fetchBooks, fetchChapters, fetchChapterContent,
      toggleHighlight, toggleFavorite, saveNote,
    }}>
      {children}
    </BibleContext.Provider>
  )
}

export const useBible = () => useContext(BibleContext)