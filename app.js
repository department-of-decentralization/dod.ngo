"use strict";
document.addEventListener('DOMContentLoaded', () => {
    const contentDiv = document.getElementById('content');
    const homeContent = `
        <p><img src='wolpy.svg' /></p>
    `;
    const aboutContent = `
        <p>
        The Department of Decentralization is a collective of people from various crypto,
        decentralization and peer-to-peer communities in and around Berlin.
        The group assembled in 2018 to organize ETHBerlin and has been active since.
        </p>
        <p>
        We aim to be an agnostic vehicle to drive adoption, educate
        newcomers, and raise awareness of the challenges and benefits of
        decentralization and open-source software.
        </p>
        <p>Upcoming events:</p>
        <ul>
        <li>
            <strong>ETHBerlin (2024):</strong>
            the hackathon returns in May 2024:
            <a href="https://ethberlin.org" target="_blank">
            ethberlin.org
            </a>
        </li>
        </ul>
        </p>
        <p>Our projects to date:</p>
        <ul>
        <li>
            <strong>Protocol Berg (2023):</strong>
            the decentralized protocol and infrastructure conference:
            <a href="https://protocol.berlin" target="_blank">
            protocol.berlin
            </a>
        </li>
        <li>
            <strong>ETHBerlin³ - to the power of 3 (2022):</strong>
            hackathon, conference, and cultural festival, third edition:
            <a href="https://ethberlin.ooo" target="_blank">
            ethberlin.ooo
            </a>
        </li>
        <li>
            <strong>StrikeDAO (2022):</strong> The Ethereum
            domain of Bundeskunsthalle was squatted by artist Hito Steyerl and the
            DoD. The StrikeDAO voted on three models of the future governance of this
            squatted domain quadratically:
            <a href="https://strikedao.com" target="_blank">strikedao.com</a>
        </li>
        <li>
            <strong>
            TwoPointFive (2020) - The Talk Show:
            </strong>
            TwoPointFive was a white-label virtual conference. No shill, no
            sponsors, from the community for the community and truly in it for the
            tech:
            <a href="https://web.archive.org/web/20220426113132/https://twopointfive.online/" target="_blank">twopointfive.online</a>
        </li>
        <li>
            <strong>
            ETHParis 2 (2020) - The Un-Hackathon:
            </strong>
            ETHParis 2 was hosted by the Department of Decentralization and
            Ethereum France as an unconference-style hackathon in the
            engineering school l'ESGI:
            <a href="https://web.archive.org/web/20200318163540/https://www.hackparis.io/" target="_blank">hackparis.com</a>
        </li>
        <li>
            <strong>Ecosystem Job-Openings (2019): </strong>
            connecting talent with web3-companies during the bear market.
        </li>
        <li>
            <strong>ETHBerlin ZWEI (2019): </strong>hackathon,
            conference, and cultural festival, second edition:
            <a href="https://ethberlinzwei.com" target="_blank">
            ethberlinzwei.com
            </a>
        </li>
        <li>
            <strong>
            There is no such thing as Blockchain Art (2019):
            </strong>
            a study to explore the art world and the intersection with our
            systems.
        </li>
        <li>
            <strong>
            Blockstars Education Program (2019):
            </strong>
            A partnership with <a href="https://b9lab.com/" target="_blank">B9lab</a>
            to onboard new hackers to web3.
        </li>
        <li>
            <strong>Goerli Testnet (2019): </strong>Born at
            ETHBerlin and launched at GoerliCon, the Goerli Testnet is now
            the essential public-facing Ethereum testnets after the Merge.
        </li>
        <li>
            <strong>G&ouml;rliCon 0 (2019): </strong>The Ethereum
            testnet and infrastructure conference where the Goerli Testnet was
            launched live on stage: <a href="https://goerli.net/" target="_blank">
            goerli.net
            </a>
        </li>
        <li>
            <strong>ETHBerlin (2018):</strong> Hackathon,
            conference, and the first event that ran almost entirely using
            decentralized applications:
            <a href="https://ethberlin.com" target="_blank">
            ethberlin.com
            </a>
        </li>
        </ul>
        <p className="mt-8">
        Currently, the Department is primarily run from Berlin. The collective
        is composed of around a dozen members who contribute voluntarily.
        </p>
    `;
    const conductContent = `
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
    don't have an open mind, this group is not for you.
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
    to spoon-feed you or do your work for you. Ain't nobody got time for
    that. But we are a community and here to support you. So always reach out if
    you need help with completing a task.
    </p>
    <h3>Unacceptable Behaviour &amp; Harassment</h3>
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
    support you. If you can't find anyone in person, reach out via email:
    <a href="mailto:escalate@dod.ngo">escalate@dod.ngo</a>
    </p>
    `;
    const contactContent = `
    <p>
    We are (in random order): Raul, Kirill, Eylon, Wesley, Caspar, Phil,
    Franzi, Kaan, Rose, Tim, Ksenya, Ligi, Stina, Helena, MP, Martin,
    Alex, Afri, Nich, Carl, Hany, Jacob, and Peter. Supported by
    countless volunteers and creative contributors. &lt;3
    </p>
    <p>
    Letters can be send to
    <a href="mailto:goerli@dod.ngo" target="_blank">goerli@dod.ngo</a>
    or Goerli Dezentral gGmbH, Mariannenstra&szlig;e 9-10, 10999 Berlin,
    Germany. Call us at
    <a href="tel:+493020613410" target="_blank">+49 (0) 30 20613410</a>.
    Responsible for the content here according to &sect; 5 TMG is Afri
    Schoedon. Goerli Dezentral gGmbH is a non-profit organization
    serving tax-privileged purposes, according to the articles of
    association. The organization meets the statutory requirements
    under &sect;&sect; 51, 59, 60, and 61 AO in Germany. Please get in
    touch if you want to donate or require a donation receipt.
    </p>
    `;
    const noContent = "<h1>Not Found</h1>";
    const routes = {
        'home': homeContent,
        'about': aboutContent,
        'conduct': conductContent,
        'contact': contactContent
    };
    function render(route) {
        contentDiv.innerHTML = routes[route] || noContent;
    }
    document.getElementById('home').addEventListener('click', () => render('home'));
    document.getElementById('about').addEventListener('click', () => render('about'));
    document.getElementById('conduct').addEventListener('click', () => render('conduct'));
    document.getElementById('contact').addEventListener('click', () => render('contact'));
    render('home');
});
