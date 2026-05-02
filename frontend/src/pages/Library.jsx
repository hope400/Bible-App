import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import './Library.css'

const READING_PLANS = [
  {
    id: 'psalms-30',
    title: '30 Days of Psalms',
    subtitle: 'A month of praise and lament',
    icon: '🕊️',
    duration: '30 days',
    category: 'Devotional',
    description: 'Journey through the Psalms — songs of joy, sorrow, praise and trust. Perfect for building a daily habit.',
    verses: [
      { day: 1,  ref: 'Psalm 1',   bookId: 'PSA', chapterId: 'PSA.1',   verseNumber: 1  },
      { day: 2,  ref: 'Psalm 8',   bookId: 'PSA', chapterId: 'PSA.8',   verseNumber: 1  },
      { day: 3,  ref: 'Psalm 16',  bookId: 'PSA', chapterId: 'PSA.16',  verseNumber: 1  },
      { day: 4,  ref: 'Psalm 19',  bookId: 'PSA', chapterId: 'PSA.19',  verseNumber: 1  },
      { day: 5,  ref: 'Psalm 23',  bookId: 'PSA', chapterId: 'PSA.23',  verseNumber: 1  },
      { day: 6,  ref: 'Psalm 27',  bookId: 'PSA', chapterId: 'PSA.27',  verseNumber: 1  },
      { day: 7,  ref: 'Psalm 34',  bookId: 'PSA', chapterId: 'PSA.34',  verseNumber: 1  },
      { day: 8,  ref: 'Psalm 37',  bookId: 'PSA', chapterId: 'PSA.37',  verseNumber: 1  },
      { day: 9,  ref: 'Psalm 42',  bookId: 'PSA', chapterId: 'PSA.42',  verseNumber: 1  },
      { day: 10, ref: 'Psalm 46',  bookId: 'PSA', chapterId: 'PSA.46',  verseNumber: 1  },
      { day: 11, ref: 'Psalm 51',  bookId: 'PSA', chapterId: 'PSA.51',  verseNumber: 1  },
      { day: 12, ref: 'Psalm 62',  bookId: 'PSA', chapterId: 'PSA.62',  verseNumber: 1  },
      { day: 13, ref: 'Psalm 63',  bookId: 'PSA', chapterId: 'PSA.63',  verseNumber: 1  },
      { day: 14, ref: 'Psalm 71',  bookId: 'PSA', chapterId: 'PSA.71',  verseNumber: 1  },
      { day: 15, ref: 'Psalm 84',  bookId: 'PSA', chapterId: 'PSA.84',  verseNumber: 1  },
      { day: 16, ref: 'Psalm 90',  bookId: 'PSA', chapterId: 'PSA.90',  verseNumber: 1  },
      { day: 17, ref: 'Psalm 91',  bookId: 'PSA', chapterId: 'PSA.91',  verseNumber: 1  },
      { day: 18, ref: 'Psalm 100', bookId: 'PSA', chapterId: 'PSA.100', verseNumber: 1  },
      { day: 19, ref: 'Psalm 103', bookId: 'PSA', chapterId: 'PSA.103', verseNumber: 1  },
      { day: 20, ref: 'Psalm 107', bookId: 'PSA', chapterId: 'PSA.107', verseNumber: 1  },
      { day: 21, ref: 'Psalm 110', bookId: 'PSA', chapterId: 'PSA.110', verseNumber: 1  },
      { day: 22, ref: 'Psalm 116', bookId: 'PSA', chapterId: 'PSA.116', verseNumber: 1  },
      { day: 23, ref: 'Psalm 118', bookId: 'PSA', chapterId: 'PSA.118', verseNumber: 1  },
      { day: 24, ref: 'Psalm 119', bookId: 'PSA', chapterId: 'PSA.119', verseNumber: 1  },
      { day: 25, ref: 'Psalm 121', bookId: 'PSA', chapterId: 'PSA.121', verseNumber: 1  },
      { day: 26, ref: 'Psalm 130', bookId: 'PSA', chapterId: 'PSA.130', verseNumber: 1  },
      { day: 27, ref: 'Psalm 136', bookId: 'PSA', chapterId: 'PSA.136', verseNumber: 1  },
      { day: 28, ref: 'Psalm 139', bookId: 'PSA', chapterId: 'PSA.139', verseNumber: 1  },
      { day: 29, ref: 'Psalm 145', bookId: 'PSA', chapterId: 'PSA.145', verseNumber: 1  },
      { day: 30, ref: 'Psalm 150', bookId: 'PSA', chapterId: 'PSA.150', verseNumber: 1  },
    ]
  },
  {
    id: 'peace-anxiety',
    title: 'Peace Over Anxiety',
    subtitle: 'Finding stillness in the storm',
    icon: '🌿',
    duration: '7 days',
    category: 'Healing',
    description: 'A 7-day plan for those battling worry and anxiety. Let scripture anchor your heart in peace.',
    verses: [
      { day: 1, ref: 'Philippians 4:6-7', bookId: 'PHP', chapterId: 'PHP.4',  verseNumber: 6  },
      { day: 2, ref: '1 Peter 5:7',       bookId: '1PE', chapterId: '1PE.5',  verseNumber: 7  },
      { day: 3, ref: 'Isaiah 41:10',      bookId: 'ISA', chapterId: 'ISA.41', verseNumber: 10 },
      { day: 4, ref: 'John 14:27',        bookId: 'JHN', chapterId: 'JHN.14', verseNumber: 27 },
      { day: 5, ref: 'Matthew 11:28-30',  bookId: 'MAT', chapterId: 'MAT.11', verseNumber: 28 },
      { day: 6, ref: 'Psalm 46:1-3',      bookId: 'PSA', chapterId: 'PSA.46', verseNumber: 1  },
      { day: 7, ref: 'Romans 8:28',       bookId: 'ROM', chapterId: 'ROM.8',  verseNumber: 28 },
    ]
  },
  {
    id: 'strength-hard-times',
    title: 'Strength for Hard Times',
    subtitle: 'Courage when the path feels long',
    icon: '⚡',
    duration: '7 days',
    category: 'Strength',
    description: 'When life feels heavy, scripture reminds us we are not alone. Draw strength from God\'s promises.',
    verses: [
      { day: 1, ref: 'Isaiah 40:31',     bookId: 'ISA', chapterId: 'ISA.40', verseNumber: 31 },
      { day: 2, ref: 'Joshua 1:9',       bookId: 'JOS', chapterId: 'JOS.1',  verseNumber: 9  },
      { day: 3, ref: 'Philippians 4:13', bookId: 'PHP', chapterId: 'PHP.4',  verseNumber: 13 },
      { day: 4, ref: 'Psalm 27:1',       bookId: 'PSA', chapterId: 'PSA.27', verseNumber: 1  },
      { day: 5, ref: '2 Corinthians 12:9', bookId: '2CO', chapterId: '2CO.12', verseNumber: 9 },
      { day: 6, ref: 'Romans 8:37',      bookId: 'ROM', chapterId: 'ROM.8',  verseNumber: 37 },
      { day: 7, ref: 'Nehemiah 8:10',    bookId: 'NEH', chapterId: 'NEH.8',  verseNumber: 10 },
    ]
  },
  {
    id: 'gratitude-7',
    title: 'Gratitude in 7 Days',
    subtitle: 'A heart of thankfulness',
    icon: '🌸',
    duration: '7 days',
    category: 'Gratitude',
    description: 'Cultivate a thankful heart over 7 days. Gratitude transforms our perspective and draws us closer to God.',
    verses: [
      { day: 1, ref: 'Psalm 107:1',         bookId: 'PSA', chapterId: 'PSA.107', verseNumber: 1  },
      { day: 2, ref: '1 Thessalonians 5:18', bookId: '1TH', chapterId: '1TH.5',  verseNumber: 18 },
      { day: 3, ref: 'Colossians 3:17',      bookId: 'COL', chapterId: 'COL.3',  verseNumber: 17 },
      { day: 4, ref: 'James 1:17',           bookId: 'JAS', chapterId: 'JAS.1',  verseNumber: 17 },
      { day: 5, ref: 'Psalm 100:4',          bookId: 'PSA', chapterId: 'PSA.100', verseNumber: 4 },
      { day: 6, ref: 'Ephesians 5:20',       bookId: 'EPH', chapterId: 'EPH.5',  verseNumber: 20 },
      { day: 7, ref: 'Psalm 103:2',          bookId: 'PSA', chapterId: 'PSA.103', verseNumber: 2 },
    ]
  },
  {
    id: 'hope-future',
    title: 'Hope & the Future',
    subtitle: 'God\'s promises for tomorrow',
    icon: '🌅',
    duration: '7 days',
    category: 'Hope',
    description: 'When the future feels uncertain, these promises remind us that God holds every tomorrow in His hands.',
    verses: [
      { day: 1, ref: 'Jeremiah 29:11',  bookId: 'JER', chapterId: 'JER.29', verseNumber: 11 },
      { day: 2, ref: 'Romans 15:13',    bookId: 'ROM', chapterId: 'ROM.15', verseNumber: 13 },
      { day: 3, ref: 'Lamentations 3:22-23', bookId: 'LAM', chapterId: 'LAM.3', verseNumber: 22 },
      { day: 4, ref: 'Psalm 121:1-2',   bookId: 'PSA', chapterId: 'PSA.121', verseNumber: 1 },
      { day: 5, ref: 'Hebrews 11:1',    bookId: 'HEB', chapterId: 'HEB.11', verseNumber: 1  },
      { day: 6, ref: 'Revelation 21:4', bookId: 'REV', chapterId: 'REV.21', verseNumber: 4  },
      { day: 7, ref: 'Psalm 37:4',      bookId: 'PSA', chapterId: 'PSA.37', verseNumber: 4  },
    ]
  },
  {
    id: 'sermon-mount',
    title: 'Sermon on the Mount',
    subtitle: 'The teachings of Jesus',
    icon: '✝️',
    duration: '5 days',
    category: 'Teaching',
    description: 'Explore the most famous sermon ever preached — a radical call to a life of love, humility and faith.',
    verses: [
      { day: 1, ref: 'Matthew 5:1-12',  bookId: 'MAT', chapterId: 'MAT.5', verseNumber: 1  },
      { day: 2, ref: 'Matthew 5:13-48', bookId: 'MAT', chapterId: 'MAT.5', verseNumber: 13 },
      { day: 3, ref: 'Matthew 6:1-18',  bookId: 'MAT', chapterId: 'MAT.6', verseNumber: 1  },
      { day: 4, ref: 'Matthew 6:19-34', bookId: 'MAT', chapterId: 'MAT.6', verseNumber: 19 },
      { day: 5, ref: 'Matthew 7:1-29',  bookId: 'MAT', chapterId: 'MAT.7', verseNumber: 1  },
    ]
  },
]

const CATEGORIES = ['All', 'Devotional', 'Healing', 'Strength', 'Gratitude', 'Hope', 'Teaching']


const MUSIC_PLAYLISTS = [
  { title: 'Morning Worship',      mood: 'Peaceful',  youtubeId: 'yhFccHgf_FQ', icon: '🌅', desc: 'Start your day in stillness' },
  { title: 'Anxiety Relief',       mood: 'Anxious',   youtubeId: '512YPP7ssDQ', icon: '🌿', desc: 'Calming worship for troubled hearts' },
  { title: 'Songs of Strength',    mood: 'Strength',  youtubeId: 'hZlpSIuU7ZE', icon: '⚡', desc: 'Uplifting praise for hard days' },
  { title: 'Grateful Heart',       mood: 'Grateful',  youtubeId: 'keJal6ftePU', icon: '🌸', desc: 'Thanksgiving and praise' },
  { title: 'Joyful Noise',         mood: 'Joyful',    youtubeId: 'f2oxGYpuLkw', icon: '☀️', desc: 'Celebrate with gladness' },
  { title: 'Evening Reflections',  mood: 'Peaceful',  youtubeId: 'yhFccHgf_FQ', icon: '🌙', desc: 'Wind down with peaceful worship' },
]

function Library() {
  const navigate    = useNavigate()
  const [activeCategory, setActiveCategory] = useState('All')
  const [expandedPlan,   setExpandedPlan]   = useState(null)
  const [activeTab,      setActiveTab]      = useState('plans') // 'plans' | 'music'
  const [playingMusic,   setPlayingMusic]   = useState(null)

  const filteredPlans = activeCategory === 'All'
    ? READING_PLANS
    : READING_PLANS.filter(p => p.category === activeCategory)

  const goToVerse = (verse) => {
    navigate('/bible', {
      state: {
        bookId:        verse.bookId,
        chapterId:     verse.chapterId,
        verseNumber:   verse.verseNumber,
        bookName:      verse.bookId,
        chapterNumber: verse.chapterId.split('.')[1],
      }
    })
  }

  return (
    <div className="lib-wrapper">
      <Navbar />

      {/* ── HEADER ── */}
      <div className="lib-header">
        <p className="lib-eyebrow">GOLDEN HOUR READING</p>
        <h1 className="lib-title">The Archive</h1>
        <p className="lib-subtitle">Reading plans and worship music for every season of life.</p>

        {/* Tab switcher */}
        <div className="lib-tabs">
          <button
            className={`lib-tab ${activeTab === 'plans' ? 'active' : ''}`}
            onClick={() => setActiveTab('plans')}
          >
            📚 Reading Plans
          </button>
          <button
            className={`lib-tab ${activeTab === 'music' ? 'active' : ''}`}
            onClick={() => setActiveTab('music')}
          >
            🎵 Music
          </button>
        </div>
      </div>

      {/* ── READING PLANS TAB ── */}
      {activeTab === 'plans' && (
        <div className="lib-content">

          {/* Category filter */}
          <div className="lib-categories">
            {CATEGORIES.map(cat => (
              <button
                key={cat}
                className={`lib-cat-btn ${activeCategory === cat ? 'active' : ''}`}
                onClick={() => setActiveCategory(cat)}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Plans grid */}
          <div className="lib-plans-grid">
            {filteredPlans.map(plan => (
              <div key={plan.id} className="lib-plan-card">
                <div className="lib-plan-top">
                  <span className="lib-plan-icon">{plan.icon}</span>
                  <div className="lib-plan-meta">
                    <span className="lib-plan-category">{plan.category}</span>
                    <span className="lib-plan-duration">{plan.duration}</span>
                  </div>
                </div>
                <h3 className="lib-plan-title">{plan.title}</h3>
                <p className="lib-plan-subtitle">{plan.subtitle}</p>
                <p className="lib-plan-desc">{plan.description}</p>

                <button
                  className="lib-plan-expand"
                  onClick={() => setExpandedPlan(expandedPlan === plan.id ? null : plan.id)}
                >
                  {expandedPlan === plan.id ? 'Hide Plan ∧' : 'View Plan ∨'}
                </button>

                {/* Expanded verse list */}
                {expandedPlan === plan.id && (
                  <div className="lib-verse-list">
                    {plan.verses.map((verse, i) => (
                      <div
                        key={i}
                        className="lib-verse-item"
                        onClick={() => goToVerse(verse)}
                      >
                        <span className="lib-verse-day">Day {verse.day}</span>
                        <span className="lib-verse-ref">{verse.ref}</span>
                        <span className="lib-verse-arrow">→</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── MUSIC TAB ── */}
      {activeTab === 'music' && (
        <div className="lib-content">
          <p className="lib-music-intro">
            Curated worship playlists to accompany your reading and reflection.
          </p>
          <div className="lib-music-grid">
            {MUSIC_PLAYLISTS.map((playlist, i) => (
              <div key={i} className="lib-music-card">
                <div className="lib-music-top">
                  <span className="lib-music-icon">{playlist.icon}</span>
                  <div>
                    <p className="lib-music-title">{playlist.title}</p>
                    <p className="lib-music-desc">{playlist.desc}</p>
                    <span className="lib-music-mood">{playlist.mood}</span>
                  </div>
                </div>

                {playingMusic === i ? (
                  <div className="lib-music-player">
                    <iframe
                      width="100%"
                      height="160"
                      src={`https://www.youtube.com/embed/${playlist.youtubeId}?autoplay=1&rel=0`}
                      allow="autoplay; encrypted-media"
                      allowFullScreen
                      style={{ border: 'none', borderRadius: '10px' }}
                    />
                    <button
                      className="lib-music-btn stop"
                      onClick={() => setPlayingMusic(null)}
                    >
                      ⏹ Stop
                    </button>
                  </div>
                ) : (
                  <button
                    className="lib-music-btn play"
                    onClick={() => setPlayingMusic(i)}
                  >
                    ▶ Play
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      <footer className="lib-footer">
        <p>"Your word is a lamp to my feet and a light to my path." — Psalm 119:105</p>
      </footer>
    </div>
  )
}

export default Library