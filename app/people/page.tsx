import Image from 'next/image'
import SocialIcon from '@/components/social-icons'
import { peopleData, PersonData } from './peopleData'

function SocialLinks({ socials }: { socials: Record<string, string> }) {
  return (
    <div className="mt-1 flex gap-2">
      {socials.twitter && <SocialIcon kind="twitter" href={socials.twitter} size={5} />}
      {socials.github && <SocialIcon kind="github" href={socials.github} size={5} />}
      {socials.website && <SocialIcon kind="website" href={socials.website} size={5} />}
      {socials.mail && <SocialIcon kind="mail" href={`mailto:${socials.mail}`} size={5} />}
      {socials.linkedin && <SocialIcon kind="linkedin" href={socials.linkedin} size={5} />}
    </div>
  )
}

function PersonCard({ person }: { person: PersonData }) {
  return (
    <div className="flex flex-col items-center">
      <div className="relative mb-1 h-32 w-32">
        <Image
          src={person.avatar}
          alt={person.name}
          fill
          className="rounded-full object-cover"
          sizes="(max-width: 128px) 100vw, 128px"
        />
      </div>
      <h3 className="text-xl font-semibold">{person.name}</h3>
      <SocialLinks socials={person.socials} />
    </div>
  )
}

export default function PeoplePage() {
  const currentMembers = peopleData
    .filter((person) => !person.isAlumni)
    .sort(() => Math.random() - 0.5)
  const alumni = peopleData.filter((person) => person.isAlumni).sort(() => Math.random() - 0.5)

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="mb-12 text-center text-4xl font-bold">Collective Members</h1>

      <section className="mb-16">
        <h2 className="mb-8 text-2xl font-semibold">Office</h2>
        <div className="flex flex-wrap gap-8">
          {currentMembers.map((person) => (
            <PersonCard key={person.name} person={person} />
          ))}
        </div>
      </section>

      <section>
        <h2 className="mb-8 text-2xl font-semibold">Alumni</h2>
        <div className="flex flex-wrap gap-8">
          {alumni.map((person) => (
            <PersonCard key={person.name} person={person} />
          ))}
        </div>
      </section>
    </div>
  )
}
