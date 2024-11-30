import Link from './Link'
import siteMetadata from '@/data/siteMetadata'
import SocialIcon from '@/components/social-icons'
import footerNavLinks from '@/data/footerNavLinks'

export default function Footer() {
  return (
    <footer>
      <div className="flex flex-col items-center bg-butter-400 px-8 py-4 text-center dark:bg-gray-950 md:flex-row-reverse md:text-left">
        {/* <div className="mb-3 flex space-x-4">
          <SocialIcon kind="mail" href={`mailto:${siteMetadata.email}`} size={6} />
          <SocialIcon kind="github" href={siteMetadata.github} size={6} />
          <SocialIcon kind="facebook" href={siteMetadata.facebook} size={6} />
          <SocialIcon kind="youtube" href={siteMetadata.youtube} size={6} />
          <SocialIcon kind="linkedin" href={siteMetadata.linkedin} size={6} />
          <SocialIcon kind="twitter" href={siteMetadata.twitter} size={6} />
          <SocialIcon kind="x" href={siteMetadata.x} size={6} />
          <SocialIcon kind="instagram" href={siteMetadata.instagram} size={6} />
          <SocialIcon kind="threads" href={siteMetadata.threads} size={6} />
        </div> */}
        {/* <div className="mb-2 flex space-x-2 text-sm text-gray-500 dark:text-gray-400">
          <div>{siteMetadata.author}</div>
          <div>{` • `}</div>
          <div>{`© ${new Date().getFullYear()}`}</div>
          <div>{` • `}</div>
          <Link href="/">{siteMetadata.title}</Link>
        </div> */}
        {/* <div className="mb-8 text-sm text-gray-500 dark:text-gray-400">
          <Link href="https://github.com/timlrx/tailwind-nextjs-starter-blog">
            Tailwind Nextjs Theme
          </Link>
        </div> */}
        <div>
          <div className="flex flex-col text-sm text-gray-500 dark:text-gray-400 md:flex-row md:space-x-4">
            {footerNavLinks.map((link, index) => (
              <>
                {index > 0 && <div>{` • `}</div>}
                <Link href={link.href}>
                  {(() => {
                    // This component renders navigation links with hotkeys
                    // Format: "About" with hotkey 'b' becomes "A[b]ut"
                    // If no hotkey specified or not found, defaults to first letter [A]bout

                    const hotkeyChar = link.hotkey
                    const title = link.title
                    let beforeChar = '' // Text before the bracketed char
                    let char = '' // Character to be bracketed
                    let afterChar = '' // Text after the bracketed char

                    // If hotkey exists and is found in title (case insensitive)
                    if (hotkeyChar && title.toLowerCase().includes(hotkeyChar.toLowerCase())) {
                      const index = title.toLowerCase().indexOf(hotkeyChar.toLowerCase())
                      beforeChar = title.slice(0, index) // Get text before hotkey
                      char = title.charAt(index) // Get actual character at hotkey position
                      afterChar = title.slice(index + 1) // Get remaining text
                    } else {
                      // Fallback: use first character
                      char = title.charAt(0)
                      afterChar = title.slice(1)
                    }

                    return (
                      <>
                        {beforeChar}
                        <span className="relative mx-0.5">
                          <span className="text-primary-500 dark:text-primary-400">[</span>
                          <span>{char}</span>
                          <span className="text-primary-500 dark:text-primary-400">]</span>
                        </span>
                        {afterChar}
                      </>
                    )
                  })()}
                </Link>
              </>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}
