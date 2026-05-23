// Curated YouTube channels for "New Releases" feeds.
// All channel IDs verified via YouTube search resolution.
// RSS endpoint: https://www.youtube.com/feeds/videos.xml?channel_id=<UC...>

export const CATEGORIES = {
  globalPop: {
    title: '🌍 Global pop & rock',
    channels: [
      { id: 'UCqECaJ8Gagnn7YCbPEzWH6g', name: 'Taylor Swift' },
      { id: 'UC0C-w0YjGpqDXGB8IHb662A', name: 'Ed Sheeran' },
      { id: 'UCDGmojLIoWpXok597xYo8cg', name: 'Billie Eilish' },
      { id: 'UCY_3wo8FmYeHkp9zoBPBWJA', name: 'Dua Lipa' },
      { id: 'UC2pmfLm7iq6Ov1UwYrWYkZA', name: 'Adele' },
      { id: 'UC9CoOnJkIBMdeijd9qYoT_g', name: 'Ariana Grande' },
      { id: 'UCPVhZsC2od1xjGhgEc2NEPQ', name: 'Lana Del Rey' },
      { id: 'UCoUM-UJ7rirJYP8CQ0EIaHA', name: 'Bruno Mars' },
      { id: 'UCBVjMGOIkavEAhyqpxJ73Dw', name: 'Maroon 5' },
      { id: 'UCDPM_n1atn2ijUwHd0NNRQw', name: 'Coldplay' },
      { id: 'UCT9zcQNlyht7fRlcjmflRSA', name: 'Imagine Dragons' },
      { id: 'UCIwFjwMjI0y7PDBVEO9-bkQ', name: 'Justin Bieber' },
    ],
  },

  hipHop: {
    title: '🎤 Hip-hop & rap',
    channels: [
      { id: 'UCByOQJjav0CUDwxCk-jVNRQ', name: 'Drake' },
      { id: 'UC3lBXcrKFnFAFkfVk5WuKcQ', name: 'Kendrick Lamar' },
      { id: 'UCnc6db-y3IU7CkT_yeVXdVg', name: 'J. Cole' },
      { id: 'UCtxdfwb9wfkoGocVUAJ-Bmg', name: 'Travis Scott' },
      { id: 'UCs6eXM7s8Vl5WcECcRHc2qQ', name: 'Kanye West' },
      { id: 'UCfM3zsQsOnfWNUppiycmBuw', name: 'Eminem' },
      { id: 'UC3jOd7GUMhpgJRBhiLzuLsg', name: 'Nicki Minaj' },
      { id: 'UCOjEHmBKwdS7joWpW0VrXkg', name: '21 Savage' },
      { id: 'UCO9zJy7HWrIS3ojB4Lr7Yqw', name: 'Lil Wayne' },
      { id: 'UCSDvKdIQOwTfcyOimSi9oYA', name: 'Future' },
      { id: 'UCsQBsZJltmLzlsJNG7HevBg', name: 'Tyler, the Creator' },
    ],
  },

  electronic: {
    title: '🎛️ Electronic & EDM',
    channels: [
      { id: 'UC5H_KXkPbEsGs0tFt8R35mA', name: 'Martin Garrix' },
      { id: 'UC1l7wYrva1qCH-wgqcHaaRg', name: 'David Guetta' },
      { id: 'UCIjYyZxkFucP_W-tmXg_9Ow', name: 'Calvin Harris' },
      { id: 'UCPNokRZ9hacjIQ3IQL6HNUQ', name: 'Zedd' },
      { id: 'UCPHjpfnnGklkRBBTd0k6aHg', name: 'Avicii' },
      { id: 'UC_kRDKYrUlrbtrSiyu5Tflg', name: 'Daft Punk' },
      { id: 'UC_TVqp_SyG6j5hG-xVRy95A', name: 'Skrillex' },
      { id: 'UCPk3RMMXAfLhMJPFpQhye9g', name: 'Tiësto' },
      { id: 'UCEdvpU2pFRCVqU6yIPyTpMQ', name: 'Marshmello' },
      { id: 'UCJrOtniJ0-NWz37R30urifQ', name: 'Alan Walker' },
      { id: 'UC_x8HoD18XJkILQBreVENUQ', name: 'DJ Snake' },
      { id: 'UCTyZ4LCVRiCEVfkVqdi0m3A', name: 'Disclosure' },
    ],
  },

  indieAlt: {
    title: '🌿 Indie & alternative',
    channels: [
      { id: 'UC-KTRBl9_6AX10-Y7IKwKdw', name: 'Arctic Monkeys' },
      { id: 'UCq19-LqvG35A-30oyAiPiqA', name: 'Radiohead' },
      { id: 'UCdI8MAC5HoPJSJ4zrgDDI-Q', name: 'Tame Impala' },
      { id: 'UC_LfW1R3B0of9qOw1uI-QNQ', name: 'The 1975' },
      { id: 'UCqnMk5GA1spXDiHYFcPN-eA', name: 'Mac DeMarco' },
      { id: 'UCh4PO1W9tVmHujIPZnfK8TQ', name: 'Phoebe Bridgers' },
      { id: 'UCBQZwaNPFfJ1gZ1fLZpAEGw', name: 'Twenty One Pilots' },
      { id: 'UCUyVHhyGAR3djWzqlljIN1A', name: 'Mumford & Sons' },
    ],
  },

  bollywood: {
    title: '🎬 Bollywood',
    channels: [
      { id: 'UChz5aEi3dfrDVC8-YJsMUDA', name: 'T-Series' },
      { id: 'UCFFbwnve3yF62-tVXkTyHqg', name: 'Zee Music Company' },
      { id: 'UCJrDMFOdv1I2k8n9oK_V21w', name: 'Tips Official' },
      { id: 'UCGzzga499Hr2AB1btQ3XtoQ', name: 'Saregama Music' },
      { id: 'UCtFOW7jJXChfFNoucRFqRmw', name: 'Arijit Singh' },
      { id: 'UCcL78rRNuUQ8t7Dx4CLmRqA', name: 'Shreya Ghoshal' },
      { id: 'UCDYFISYJx2tSc6cyhvx0N5Q', name: 'Sonu Nigam' },
      { id: 'UCOy7uPsjass2DCY4a_UUp-Q', name: 'Sunidhi Chauhan' },
      { id: 'UCzqQvVAkCEFrWI2VOPzFpeg', name: 'Jubin Nautiyal' },
      { id: 'UCicMnWThgzNjUmqpd-nUTXQ', name: 'Neha Kakkar' },
      { id: 'UCMwcN9RwlmgTaqkNryq1voQ', name: 'Armaan Malik' },
      { id: 'UCSRpjCcSJlh714MfGptdfog', name: 'Dhvani Bhanushali' },
      { id: 'UCdNZZ9znjaiOXNi004mHxSg', name: 'Darshan Raval' },
    ],
  },

  oldIsGoldIndia: {
    title: '🪔 Old is gold — India',
    channels: [
      { id: 'UC68zY8Df_wOJcVrQL3kJjbw', name: 'Asha Bhosle' },
      { id: 'UCrYczeBh8tcxLLAgn8m2wWQ', name: 'Udit Narayan' },
      { id: 'UCLH5ojAg1XIyxcOCazK4n-Q', name: 'Alka Yagnik' },
      { id: 'UCyhq3s9caQkOl-lY1laVC5w', name: 'Kumar Sanu' },
    ],
  },

  punjabi: {
    title: '🟠 Punjabi & rap (India)',
    channels: [
      { id: 'UC3XBkDeCVXCoCofFgfUZXGw', name: 'Karan Aujla' },
      { id: 'UCZRdNleCgW-BGUJf-bbjzQg', name: 'Diljit Dosanjh' },
      { id: 'UCV4iYJ7wTDWrRGbGZEvQsSg', name: 'Sidhu Moose Wala' },
      { id: 'UC9ChdqQRCaZmTCwSJ49tcbw', name: 'Sidhu Moose Wala (alt)' },
      { id: 'UCUQg_UBQfVjptn7Wqcgzz-w', name: 'Badshah' },
      { id: 'UC1KonH1j8WMhc5cT6Bp7NtA', name: 'Yo Yo Honey Singh' },
      { id: 'UC8MyBFjXbTezvZgMTEBFwgA', name: 'Guru Randhawa' },
      { id: 'UCMXMp3Lc6v6v8dJH5ZGwtqA', name: 'Raftaar' },
      { id: 'UCFX8go5jeQ_9_Pk9WFl5tmA', name: 'DIVINE' },
      { id: 'UCBApn9oICcOg083Ie7XvAEA', name: 'Mankirt Aulakh' },
      { id: 'UCHuLFyYug1hDBBI4Zqlwmzw', name: 'Jass Manak' },
      { id: 'UCNd_LT9nT7Q3kzFBITIL78g', name: 'Garry Sandhu' },
    ],
  },

  southIndia: {
    title: '🌴 South Indian — Tamil & Telugu',
    channels: [
      { id: 'UCAEv0ANkT221wXsTnxFnBsQ', name: 'T-Series Tamil' },
      { id: 'UCnJjcn5FrgrOEp5_N45ZLEQ', name: 'T-Series Telugu' },
      { id: 'UCn4rEMqKtwBQ6-oEwbd4PcA', name: 'Sony Music South' },
      { id: 'UCNApqoVYJbYSrni4YsbXzyQ', name: 'Aditya Music' },
      { id: 'UC3mb5QRlm4VQmOZD_P0ctGw', name: 'A.R. Rahman' },
      { id: 'UC1mupr-2YbkxQVmcO3ve6SA', name: 'Anirudh Ravichander' },
      { id: 'UC3Izrk2fUSIEwdcH0kNdzeQ', name: 'Hiphop Tamizha' },
      { id: 'UCrnDk_4-MwHR7HeUS-5BK8A', name: 'Devi Sri Prasad' },
      { id: 'UCqA05jJsIlK5E0XH91fb2rg', name: 'Sid Sriram' },
      { id: 'UCf0KybguYN3FqbRoxCbR6kw', name: 'U1 Records (Yuvan)' },
      { id: 'UCLnKZRT9orZAgttWtS2np2g', name: 'G.V. Prakash Kumar' },
      { id: 'UCF4uIIqbIy05Cmzx3rRt_8g', name: 'Atif Aslam' },
    ],
  },

  marathiBengali: {
    title: '🌺 Marathi, Bengali & regional',
    channels: [
      { id: 'UCf40kH47yvowumzzK9LVKKg', name: 'Zee Music Marathi' },
      { id: 'UCJSX0gNr2U5lawLXE6IjRmA', name: 'Saregama Marathi' },
      { id: 'UCRh-4WUJx8M86gUYL2pyKSQ', name: 'Saregama Bengali' },
      { id: 'UCc052CoYw9cF27quifoL_mg', name: 'Sony Music Bangla' },
      { id: 'UCG8Rvn_BCfu77iO4XgmEyfw', name: 'Sahil Sarkar' },
      { id: 'UCPbbrsi255oBt8EU-eaklMg', name: 'Anupam Roy' },
    ],
  },

  latin: {
    title: '🌶️ Latin',
    channels: [
      { id: 'UCmBA_wu8xGg1OfOkfW13Q0Q', name: 'Bad Bunny' },
      { id: 'UCZuPJZ2kGFdlbQu1qotZaHw', name: 'KAROL G' },
      { id: 'UCt-k6JwNWHMXDBGm9IYHdsg', name: 'J Balvin' },
      { id: 'UCQt9awGIFZeldFsATZNeJag', name: 'ROSALÍA' },
      { id: 'UC9TO_oo4c_LrOiKNaY6aysA', name: 'Daddy Yankee' },
      { id: 'UCYLNGLIzMhRTi6ZOLjAPSmw', name: 'Shakira' },
    ],
  },

  kpop: {
    title: '🩷 K-pop & J-pop',
    channels: [
      { id: 'UCJCAlMsCuld3v96t-9SffdA', name: 'BTS' },
      { id: 'UCQi67q4kGdmnJaRzX81uK5g', name: 'BLACKPINK' },
      { id: 'UCzgxx_DM2Dcb9Y1spb9mUJA', name: 'TWICE' },
      { id: 'UCMki_UkHb4qSc0qyEcOHHJw', name: 'NewJeans' },
      { id: 'UC9rMiEjNaCSsebs31MRDCRA', name: 'Stray Kids' },
      { id: 'UCfkXDY7vwkcJ8ddFGz8KusA', name: 'SEVENTEEN' },
      { id: 'UCArLZtok93cO5R9RI4_Y5Jw', name: 'ENHYPEN' },
      { id: 'UCvpredjG93ifbCP1Y77JyFA', name: 'YOASOBI' },
      { id: 'UC3vg17IZ1IV73xx069jG44w', name: 'Official Hige Dandism' },
    ],
  },

  classics: {
    title: '👑 Classics — old is gold',
    channels: [
      { id: 'UCJtvg6ZFwzdFdtcHBqetvwg', name: 'Frank Sinatra' },
      { id: 'UC5OrDvL9DscpcAstz7JnQGA', name: 'Michael Jackson' },
      { id: 'UCiMhD4jzUqG-IgPzUmmytRQ', name: 'Queen' },
      { id: 'UCYPs4y5esNqx6ax1CxZws6Q', name: 'ABBA' },
      { id: 'UCW6G95TBLCh5SdC-DHDSf5w', name: 'Elvis Presley' },
      { id: 'UCcd0tBtip8YzdTCUw3OVv_Q', name: 'Elton John' },
      { id: 'UC8YgWcDKi1rLbQ1OtrOHeDw', name: 'David Bowie' },
      { id: 'UCAb60rVrvVQVfSgrX1UWb0g', name: 'Fleetwood Mac' },
      { id: 'UCGD7CfG3JgZF52QpIRivV1Q', name: 'Stevie Wonder' },
      { id: 'UCnRI0ay61tY-fKYzzB3fCnw', name: 'Bob Dylan' },
      { id: 'UCAlTDckOOQ2jREOvuCShGbw', name: 'Bob Marley' },
      { id: 'UCZU9T1ceaOgwfLRq7OKFU4Q', name: 'Linkin Park' },
      { id: 'UCY2qt3dw2TQJxvBrDiYGHdQ', name: 'Pink Floyd' },
    ],
  },

  lofi: {
    title: '☕ Lo-fi & chill',
    channels: [
      { id: 'UCSJ4gkVC6NrvII8umztf0Ow', name: 'Lofi Girl' },
      { id: 'UCc5afI6TobiZjRke2sYBDPA', name: 'Lofi Girl (Synthwave)' },
      { id: 'UCOxqgCwgOqC2lMqC5PYz_Dg', name: 'Chillhop Music' },
      { id: 'UCfR8HhkbpDAwvYxrecNg4Mg', name: 'Ambient Worlds' },
    ],
  },
}

// Backward-compatible exports for existing call sites
export const GLOBAL_LABELS = [
  ...CATEGORIES.globalPop.channels,
  ...CATEGORIES.hipHop.channels,
  ...CATEGORIES.electronic.channels,
  ...CATEGORIES.indieAlt.channels,
]

export const INDIAN_LABELS = [
  ...CATEGORIES.bollywood.channels,
  ...CATEGORIES.punjabi.channels,
  ...CATEGORIES.southIndia.channels,
  ...CATEGORIES.marathiBengali.channels,
  ...CATEGORIES.oldIsGoldIndia.channels,
]
