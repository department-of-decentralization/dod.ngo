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
import alexImg from './images/alex.jpg'
import liliImg from './images/lili.jpg'
import carlImg from './images/carl.jpg'
import jommiImg from './images/jommi.jpg'
import nichImg from './images/nich.jpg'
import casparImg from './images/caspar.jpg'
import gutoImg from './images/guto.jpg'
import philImg from './images/phil.jpg'
import griffImg from './images/griffin.jpg'
import adeolImg from './images/adeola.jpg'
import eliasImg from './images/elias.jpg'
import eylImg from './images/eylon.jpg'
import yrnImg from './images/yaron.jpg'
import mirImg from './images/miriam.jpg'
import ptrImg from './images/peter.jpg'
import noImg from './images/noPhoto.jpg'

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
      twitter: 'https://twitter.com/q9fcc',
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
      github: 'https://github.com/kirushik',
    },
  },
  {
    name: 'Raul',
    avatar: raulImg,
    isAlumni: false,
    socials: {
      twitter: 'https://twitter.com/nachortti',
    },
  },
  {
    name: 'Stina',
    avatar: stinaImg,
    isAlumni: true,
    socials: {
      twitter: 'https://twitter.com/stinalinneag',
    },
  },
  {
    name: 'Lea',
    avatar: leaImg,
    isAlumni: true,
    socials: {
      twitter: 'https://twitter.com/_schmitted',
    },
  },
  {
    name: 'Rose',
    avatar: roseImg,
    isAlumni: true,
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
    isAlumni: true,
    socials: {
      twitter: 'https://twitter.com/MPtherealmvp',
      website: 'https://www.mariapaula.net/',
    },
  },
  {
    name: 'Alexandra',
    avatar: alexImg,
    isAlumni: true,
    socials: {
      twitter: 'https://twitter.com/cto_o_alex',
    },
  },
  {
    name: 'Alex',
    avatar: noImg,
    isAlumni: true,
    socials: {},
  },
  {
    name: 'Lili',
    avatar: liliImg,
    isAlumni: true,
    socials: {
      website: 'https://impermanence.co/',
      twitter: 'https://twitter.com/lililashka',
    },
  },
  {
    name: 'Guto',
    avatar: gutoImg,
    isAlumni: true,
    socials: {
      twitter: 'https://x.com/gutomartino',
    },
  },
  {
    name: 'Caspar',
    avatar: casparImg,
    isAlumni: true,
    socials: {
      twitter: 'https://twitter.com/casparschwa',
    },
  },
  {
    name: 'Elias',
    avatar: eliasImg,
    isAlumni: true,
    socials: {
      twitter: 'https://x.com/8bitpal',
    },
  },
  {
    name: 'Nichanan',
    avatar: nichImg,
    isAlumni: true,
    socials: {
      twitter: 'https://twitter.com/nichanank',
      github: 'https://github.com/nichanank',
    },
  },
  {
    name: 'Adeola',
    avatar: adeolImg,
    isAlumni: true,
    socials: {
      twitter: 'https://x.com/adeolaogunwole',
    },
  },
  {
    name: 'Phil',
    avatar: philImg,
    isAlumni: true,
    socials: {
      twitter: 'https://x.com/ph_lux',
    },
  },
  {
    name: 'Griffin',
    avatar: griffImg,
    isAlumni: true,
    socials: {
      twitter: 'https://x.com/gichiba',
    },
  },
  {
    name: 'Carl',
    avatar: carlImg,
    isAlumni: false,
    socials: {
      github: 'https://github.com/Cbezzenberger',
    },
  },
  {
    name: 'Jommi',
    avatar: jommiImg,
    isAlumni: false,
    socials: {
      twitter: 'https://twitter.com/joakimhi',
    },
  },
  {
    name: 'Eylon',
    avatar: eylImg,
    isAlumni: true,
    socials: {
      twitter: 'https://twitter.com/TheEylon',
    },
  },
  {
    name: 'Yaron',
    avatar: yrnImg,
    isAlumni: false,
    socials: {
      twitter: 'https://twitter.com/yaronski',
    },
  },
  {
    name: 'Miriam',
    avatar: mirImg,
    isAlumni: false,
    socials: {
      twitter: 'https://twitter.com/mcnaclh2o',
    },
  },
  {
    name: 'Peter',
    avatar: ptrImg,
    isAlumni: false,
    socials: {
      website: 'https://kalambet.dev/',
      github: 'https://github.com/kalambet',
    },
  },
]
