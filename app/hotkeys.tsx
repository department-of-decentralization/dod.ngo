import React from 'react'
import headerNavLinks from '@/data/headerNavLinks'
import footerNavLinks from '@/data/footerNavLinks'

// Check for hotkey collisions at build time
function checkHotkeyCollisions() {
  const allLinks = [...headerNavLinks, ...footerNavLinks]
  const usedHotkeys = new Map()

  for (const link of allLinks) {
    // Use explicit hotkey if defined, otherwise use first letter of title
    const hotkey = link.hotkey ? link.hotkey.toLowerCase() : link.title.charAt(0).toLowerCase()

    if (usedHotkeys.has(hotkey)) {
      const existingLink = usedHotkeys.get(hotkey)
      throw new Error(
        `Hotkey collision detected: '${hotkey}' is used by both "${existingLink}" and "${link.title}"`
      )
    }
    usedHotkeys.set(hotkey, link.title)
  }
}

// Perform the check at build time
checkHotkeyCollisions()

export default function ButtonScript() {
  const navLinksStr = JSON.stringify(headerNavLinks)
  const footerLinksStr = JSON.stringify(footerNavLinks)

  return (
    <script
      dangerouslySetInnerHTML={{
        __html: `
            // Make nav links available in the script scope
            const headerNavLinks = ${navLinksStr};
            const footerNavLinks = ${footerLinksStr};
            
            // Attach the key event listener to the document
            document.onkeydown = checkKey;

            function checkKey(e) {
                // Normalize event object for cross-browser compatibility
                e = e || window.event;

                // Ignore keypress if any modifier keys are pressed (Ctrl, Shift, Alt, Meta/Cmd)
                if (e.ctrlKey || e.shiftKey || e.altKey || e.metaKey) {
                    return;
                }

                const pressedKey = e.key.toLowerCase();
                
                // Find matching link in both header and footer links
                const matchingLink = [...headerNavLinks, ...footerNavLinks].find(link => {
                    if (link.hotkey) {
                        return link.hotkey.toLowerCase() === pressedKey;
                    }
                    return link.title.charAt(0).toLowerCase() === pressedKey;
                });

                if (matchingLink) {
                    window.location.href = matchingLink.href;
                }
            }
            `,
      }}
    />
  )
}
