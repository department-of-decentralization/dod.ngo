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
        <li>
            <strong>Criticial Decentralization Cluster (2023):</strong>
            the &num;37c3 assembly in collaboration with the Social
            Distortion Protocol, the RIAT Institute, and Swiss Cryptoeconomics:
            <a href="https://decentral.community" target="_blank">
            decentral.community
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
        <p>
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
    const privacyContent = `
    <h3>Privacy policy</h3>
    <p>We are delighted that you have chosen to visit our website or take part at one of our events. We take our data protection responsibilities with the utmost seriousness and we have designed our website so that you may navigate and use our website without having to provide any data.</p>
    <p>This policy sets out what data we collect (if any), how we process it, and how long we retain it. This policy is applying to all of our processing activities where we act as a data controller.</p>
    <h3>How we use data</h3>
    <p>We may collect and process data that you provide to us for the purpose of onboarding you as an attendee. This data may include:</p>
    <ol>
    <li>Your email address; that's all we need.</li>
    </ol>
    <p>This data is collected in order to communicate with you. The legal basis for this processing is that it is necessary to fulfill a contract with you and your consent given in the attendee application.</p>
    <h3>Use of third-party applications</h3>
    <p>We use the following third party applications:</p>
    <ul>
    <li>GitHub: used to host our websites through GitHub pages. GitHub might see your IP address if you read this.
    <a href="https://docs.github.com/en/site-policy/privacy-policies/github-privacy-statement" target="_blank">
    GitHub Privacy Statement</a>.
    </li>
    </ul>
    <h3>Sharing your data</h3>
    <p>We don't pass on your information to anyone.</p>
    <h3>Transferring your data outside of the EU</h3>
    <p>Goerli Dezentral gGmbH is based in Germany. Your data, will be processed and collected in Europe by our organizing committee in Berlin. Also will the information be stored in Germany-based servers. </p>
    <h3>Existence of automated decision-making</h3>
    <p>We do not use automatic decision-making or profiling when processing data.</p>
    <h3>Data security</h3>
    <p>We have put in place appropriate security measures to prevent your personal data from being accidentally lost, used or accessed in any unauthorized way, altered or disclosed. In addition, we limit access to your personal data to our core team only.</p>
    <p>We have put in place procedures to deal with any suspected personal data breach and will notify you and any applicable regulator of a breach where we are legally required to do so.</p>
    <h3>Your rights as a subject</h3>
    <p>You have certain rights under applicable legislation, and in particular under Regulation EU 2016/679 (General Data Protection Regulation or 'GDPR'). We explain these below. You can find out more about the GDPR and your rights by accessing the <a href="https://ec.europa.eu/info/law/law-topic/data-protection_en">European Commission's website</a>.</p>
    <p>You have a right to be informed about the processing of your personal data (and if you did not give it to us, information as to the source) and this policy intends to provide the information. Of course, if you have any further questions you can contact us on the above details.</p>
    <p>You have the right to have any inaccurate personal information about you rectified and to have any incomplete personal information about you completed. You may also request that we restrict the processing of that information.</p>
    <p>The accuracy of your information is not important to us. If you do not want us to use your data in the manner set out in this policy, or need to advise us of any changes to your personal information, or would like any more information about the way in which we collect and use your data, please contact us at the above details.</p>
    <p>You have the general right to request the erasure of your personal information at any time. We will proceed to comply with an erasure request without delay.</p>
    <p>You have a right to restrict processing of your personal information.</p>
    <p>You also have the right to object to processing of your personal information under certain circumstances, such as where the processing is based on your consent and you withdraw that consent. This may impact the services we can provide and we will explain this to you if you decide to exercise this right.</p>
    <p>Where the legal basis for our processing is your consent or the processing is necessary for the performance of a contract to which you are party or in order to take steps at your request prior to entering into a contract, you have a right to receive the personal information you provided to us in a structured, commonly used and machine-readable format, or ask us to send it to another person.</p>
    <p>You have a choice about whether or not you wish to receive information from us. We will not contact you for marketing purposes.</p>
    <p>Please note that any administrative or service-related communications (to offer our services, or notify you of an update to this policy or applicable terms of business, etc.) will solely be directed at our attendees, and such communications generally do not offer an option to unsubscribe as they are necessary to provide the services requested.</p>
    <p>You also have a right to access information we hold about you.</p>
    <p>You have the right to withdraw consent at any time by contacting us on the above details.</p>
    <p>If you wish to raise a complaint on how we have handled your personal data, you can contact us as set out above and we will then investigate the matter.</p>
    <p>If we have not responded to you within a reasonable time or if you feel that your complaint has not been resolved to your satisfaction, you are entitled to make a complaint to the Data Protection Commissioner under the Data Protection Act which is <em>Berliner Beauftragte für Datenschutz und Informationsfreiheit</em>: Friedrichstr. 219, Guest entrance: Puttkamerstr. 16 – 18 (5th floor), Phone: 030 13889-0, Fax: 030 2155050, Email: mailbox@datenschutz-berlin.de</p>
    <p>You also have the right to lodge a complaint with the supervisory authority in the country of your habitual residence, place of work, or the place where you allege an infringement of one or more of our rights has taken place.</p>
    <h3>Storing data</h3>
    <p>We retain your information only for as long as is necessary for the purposes for which we process the information as set out in this policy.</p>
    <h3>Changes to this policy</h3>
    <p>We may make changes to this policy from time to time. We encourage you to review the policy whenever you access or use our website to stay informed about our information practices and the choices available to you. If you do not agree to the revised policy, you should discontinue your use of this website.</p>
    <h3>Our details</h3>
    <p>This website is owned and operated by Goerli Dezentral gGmbH.</p>
    <p>We are registered in Germany under registration number Company Nr. HRB 207663 B, and our registered office is located at: Mariannenstraße 9-10, 10999 Berlin. </p>
    <p>If you have any queries concerning your rights under this policy, please contact us via: <a href="mailto:data@dod.ngo">data@dod.ngo</a></p>
    `;
    const contactContent = `
    <h3>Contact</h3>
    <p>
    We are (in random order): Raul, Kirill, Eylon, Wesley, Caspar, Phil,
    Franzi, Kaan, Rose, Tim, Ksenya, Ligi, Stina, Helena, MP, Martin,
    Alex, Afri, Nich, Carl, Hany, Jacob, and Peter. Supported by
    countless volunteers and creative contributors. &lt;3
    </p>
    <p>
    We are coordinating on Matrix:
    <a href="https://matrix.to/#/%23stammtisch:dod.ngo" target="_blank" rel="noopener noreferrer">
    #stammtisch:dod.ngo</a>
    </p>
    <p>
    Email us at
    <a href="mailto:hello@dod.ngo" target="_blank">hello@dod.ngo</a>
    or give us a call at
    <a href="tel:+493020613410" target="_blank">+49 (0) 30 20613410</a>.
    </p>
    <h3>Donations</h3>
    <p>
    The Department of Decentralization is a non-profit organization
    accepting donations either via cryptographic transactions or
    traditional wire transfers.
    </p>
    <p>
    Donations on Ethereum mainnet: <code>dezent.eth</code>; on other EVM chains: <code>0x59cc3Fc56B8B2988F259EC1E6f3446907130f728</code>
    </p>
    <p>
    Donations on Polkadot: <code>14DfiBmme3pjph6aD86MyGfYRbAUtwCJqjECope8rpvhv6gu</code>; Substrate: <code>5FHNZrWhnGZGPA64FV3Mq7qPZyAqCdeAmEVieXenJjuBjYP1</code>
    </p>
    <p>
    Wire (SEPA) donations:<br />
    Beneficiary: <code>Goerli Dezentral gGmbH</code><br />
    International Bank Account Number: <code>DE16 1005 0000 0190 8447 44</code><br />
    Bank Identifier Code: <code>BELADEBEXXX</code><br />
    Subject: <code>Spende Department of Decentralization</code>
    </p>
    <p>
    To donate on other platforms or to get a donation receipt,
    please message us at
    <a href="mailto:donations@dod.ngo">donations@dod.ngo</a>.
    </p>
    <h3>Impressum</h3>
    <p>
    Angaben gem&auml;&szlig; &sect; 5 TMG:
    Goerli Dezentral gGmbH, Mariannenstra&szlig;e 9-10, 10999 Berlin
    </p>
    <p>
    Handelsregister: HRB 207663 B, Registergericht: Amtsgericht
    Charlottenburg, Berlin, Umstatzsteuer-ID: DE325917754;
    vertreten durch A. Schoedon, Telefon: +49 (0) 30 20613410, E-Mail:
    <a href="mailto:schoedon@dod.ngo">schoedon@dod.ngo</a>
    </p>
    <p>
    Goerli Dezentral gGmbH is a non-profit organization serving
    tax-privileged purposes, according to the articles of association.
    The organization meets the statutory requirements under
    &sect;&sect; 51, 59, 60, and 61 AO.
    </p>
    `;
    const noContent = "<h3>Not Found</h3>";
    const routes = {
        'home': homeContent,
        'about': aboutContent,
        'conduct': conductContent,
        'privacy': privacyContent,
        'contact': contactContent
    };
    function render(route) {
        contentDiv.innerHTML = routes[route] || noContent;
    }
    document.getElementById('home').addEventListener('click', () => render('home'));
    document.getElementById('about').addEventListener('click', () => render('about'));
    document.getElementById('conduct').addEventListener('click', () => render('conduct'));
    document.getElementById('privacy').addEventListener('click', () => render('privacy'));
    document.getElementById('contact').addEventListener('click', () => render('contact'));
    render('home');
});
