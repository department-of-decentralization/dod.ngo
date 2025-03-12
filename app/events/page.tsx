import PageTitle from '@/components/PageTitle'
import { genPageMetadata } from 'app/seo'
import EventsList from './EventsList'

export const metadata = genPageMetadata({ title: 'Events' })

export default function Events() {
  return (
    <>
      <PageTitle>Events</PageTitle>
      <EventsList />
    </>
  )
}
