'use client'

import Link from "next/link";
import { usePathname } from "next/navigation";

export function Nav() {
  const path = usePathname();
  return(
    <nav>
      <ul>
        <li>
          <Link
            className={`link ${path === '/' ? 'active' : ''}`}
            href="/"
          >
            Home
          </Link>
        </li>
        <li>
          <Link
            className={`link ${path === '/events' ? 'active' : ''}`}
            href="/events"
          >
            Events
          </Link>
        </li>
        <li>
          <Link
            className={`link ${path === '/code' ? 'active' : ''}`}
            href="/code"
          >
            Code of Conduct
          </Link>
        </li>
        <li>
          <Link
            className={`link ${path === '/privacy' ? 'active' : ''}`}
            href="/privacy"
          >
            Privacy Policy
          </Link>
        </li>
        <li>
          <Link
            className={`link ${path === '/impressum' ? 'active' : ''}`}
            href="/impressum"
          >
            Contact
          </Link>
        </li>
      </ul>
    </nav>
  )
}
