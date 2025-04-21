import siteMetadata from '@/data/siteMetadata'
import SocialIcon from './social-icons'

const SocialIcons = () => {
  return (
    <div className="flex flex-row gap-4">
      <SocialIcon kind="github" href={siteMetadata.github} size={5} />
      <SocialIcon kind="bluesky" href={siteMetadata.bluesky} size={5} />
      <SocialIcon kind="x" href={siteMetadata.x} size={5} />
      <SocialIcon kind="youtube" href={siteMetadata.youtube} size={5} />
    </div>
  )
}

export default SocialIcons
