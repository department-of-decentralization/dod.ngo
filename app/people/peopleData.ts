import { StaticImageData } from 'next/image'
import stinaImg from './images/stina.jpeg'
import roseImg from './images/rose.gif'
import raulImg from './images/raul.jpeg'
import mpImg from './images/MP.jpeg'
import martinImg from './images/martin.jpeg'
import ligiImg from './images/ligi.jpg'
import leaImg from './images/lea.jpeg'
import kirillImg from './images/kirill.jpeg'
import kaanImg from './images/Kaan.jpeg'
import jacobImg from './images/jacob.jpeg'
import helsImg from './images/hels.jpeg'
import franziImg from './images/franzi.jpeg'
import afriImg from './images/afri.jpeg'

export interface PersonData {
  name: string
  avatar: StaticImageData
  isAlumni: boolean
  socials: {
    twitter?: string
    github?: string
    website?: string
    linkedin?: string
  }
}

export const peopleData: PersonData[] = [
  {
    name: 'ligi',
    avatar: ligiImg,
    isAlumni: false,
    socials: {
      website: 'https://ligi.de',
      twitter: 'https://twitter.com/mr_ligi',
      github: 'https://github.com/ligi',
    },
  },
  {
    name: 'Afri',
    avatar: afriImg,
    isAlumni: false,
    socials: {
      github: 'https://github.com/q9f',
      website: 'https://q9f.cc/',
    },
  },
  {
    name: 'Franziska',
    avatar: franziImg,
    isAlumni: false,
    socials: {
      twitter: 'https://twitter.com/_franzihei',
      github: 'https://github.com/franzihei',
    },
  },
  {
    name: 'Jacob',
    avatar: jacobImg,
    isAlumni: false,
    socials: {
      twitter: 'https://twitter.com/_czepluch',
      github: 'https://github.com/czepluch',
    },
  },
  {
    name: 'Kaan',
    avatar: kaanImg,
    isAlumni: false,
    socials: {
      twitter: 'https://twitter.com/kaanuzdogan',
      github: 'https://github.com/kuzdogan',
    },
  },
  {
    name: 'Kirill',
    avatar: kirillImg,
    isAlumni: false,
    socials: {
      website: 'https://pimenov.cc/',
    },
  },
  {
    name: 'Raul',
    avatar: raulImg,
    isAlumni: false,
    socials: {},
  },
  {
    name: 'Stina',
    avatar: stinaImg,
    isAlumni: false,
    socials: {
      twitter: 'https://twitter.com/stinalinneag',
    },
  },
  {
    name: 'Lea',
    avatar: leaImg,
    isAlumni: false,
    socials: {
      twitter: 'https://twitter.com/_schmitted',
    },
  },
  {
    name: 'Rose',
    avatar: roseImg,
    isAlumni: false,
    socials: {
      twitter: 'https://twitter.com/roseighteth',
    },
  },
  {
    name: 'Helena',
    avatar: helsImg,
    isAlumni: false,
    socials: {
      twitter: 'https://twitter.com/helsfoftroy',
    },
  },
  {
    name: 'Martin',
    avatar: martinImg,
    isAlumni: false,
    socials: {
      twitter: 'https://twitter.com/MartinBreiten',
    },
  },
  {
    name: 'MP',
    avatar: mpImg,
    isAlumni: false,
    socials: {
      twitter: 'https://twitter.com/MPtherealmvp',
    },
  },
]
