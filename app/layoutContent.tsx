'use client'
import { ReactNode, useState } from 'react'
import Menu from '@/components/Menu'
import Footer from '@/components/Footer'
import SectionContainer from '@/components/SectionContainer'
import Scrollable from './Scrollable'
import Image from 'next/image'
import Logo from '@/data/wolpy.png'

interface LayoutContentProps {
  children: ReactNode
  showSidebar: boolean
}

export default function LayoutContent({ children }: LayoutContentProps) {
  const [showSidebar, setShowSidebar] = useState(false)

  return (
    <>
      <Scrollable onScrollComplete={() => setShowSidebar(true)}>
        <Image
          src={Logo}
          alt="Logo"
          width={400}
          height={400}
          className={showSidebar ? 'hidden' : ''}
        />
      </Scrollable>
      <div
        className={`flex min-h-screen flex-col md:flex-row ${
          !showSidebar ? 'invisible opacity-0' : 'fade-in-left visible opacity-100'
        }`}
      >
        <Menu />
        <div className="flex-grow overflow-y-auto md:ml-64">
          <SectionContainer className="flex h-full flex-col">
            <main className="my-12 flex-grow md:mx-12">{children}</main>
            <Footer />
          </SectionContainer>
        </div>
      </div>
    </>
  )
}
