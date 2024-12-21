import PageTitle from '@/components/PageTitle'
import { genPageMetadata } from 'app/seo'

export const metadata = genPageMetadata({ title: 'Code of Conduct' })

export default function Conduct() {
  return (
    <>
      <PageTitle>Code of Conduct</PageTitle>
      <div className="prose max-w-none pb-8 pt-8 dark:prose-invert">
        <p>
          We are a collective, and we want to bring people in the community
          together to exchange ideas, make new friends, and build things as an
          inclusive, welcoming, and safe community.
        </p>
        <p>
          Therefore, any harmful or discriminating behaviour by anyone (volunteers,
          organizers, project leads, contributors, hackers, or absolutely anyone
          involved in our community) will not be tolerated and will result in the
          offending person(s) being excluded from the group.
        </p>
        <p>
          Members should be judged by their actions, not criteria such as degrees,
          age, race, nationality, sex, sexual orientation, gender, gender identity
          or expression, disability, physical appearance, religion (or lack
          thereof), or position. We are a diverse community. So leave your egos at
          the door.
        </p>
        <h3>Be Open</h3>
        <p>
          We welcome one and all. We especially love to adopt newbies in the
          community. We foster decentralized, open communities, society, and
          technology, so we should be open to everyone and everything. We all
          bring different backgrounds and experiences. Great things can happen
          when we show up with an open mind and curiosity to explore. If you
          don&apos;t have an open mind, this group is not for you.
        </p>
        <h3>Be Respectful</h3>
        <p>
          Be exceptionally kind to others. Respect their work, time, and
          perspectives. Do not insult or troll others unless it is for banter
          (covered at a later point). We all spend our time, resources, and energy
          to be part of this group. Respect each other, the projects, and the
          process.
        </p>
        <h3>Be Daring</h3>
        <p>
          Dare to create something that has yet to be done. If you get stuck, ask for
          help - people will help you when you ask. This is a community. We create
          things together.
        </p>
        <h3>What We Create</h3>
        <p>
          Promote Decentralization. Build what matters to you. You can organize
          events, build applications, or foster public discourse. You can create
          art and beauty on a computer. Most importantly, create, hack, and build
          together.
        </p>
        <h3>Contributions in Other Ways</h3>
        <p>Banter and memeing are encouraged as you see fit.</p>
        <h3>Personal Responsibility</h3>
        <p>
          Everyone in this community is responsible for their own tasks. So if you
          have a project, it is your responsibility to manage it. We are not here
          to spoon-feed you or do your work for you. Ain&apos;t nobody got time for
          that. But we are a community and here to support you. So always reach out if
          you need help with completing a task.
        </p>
        <h3>Unacceptable Behaviour and Harassment</h3>
        <p>
          Unacceptable behaviour includes intimidation, harassment, abuse,
          discrimination, derogatory or demeaning words or actions by any
          participant in our community online or in person. If you have
          disagreements with someone, communicate directly with each other and
          work on a solution.
        </p>
        <p>
          Harassment includes harmful or prejudicial verbal or written comments
          related to gender, sexual orientation, race, religion, or disability;
          inappropriate use of nudity, or sexual images (including presentation
          slides); inappropriate depictions of violence (including presentation
          slides); deliberate intimidation, stalking or following; harassing
          photography or recording; sustained disruption of talks or other events;
          inappropriate physical contact, and unwelcomed sexual attention.
        </p>
        <h3>Notify Us</h3>
        <p>
          If you are subject to or witness unacceptable behaviour or have any
          other concerns, you can always notify a project lead, event organizer,
          or member of the core group. Anytime. We will do everything to help and
          support you. If you can&apos;t find anyone in person, reach out via email: <a
          href="mailto:escalate@dod.ngo">escalate@dod.ngo</a>
        </p>
      </div>
    </>
  )
}
