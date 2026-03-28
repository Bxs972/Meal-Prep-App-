import type { Metadata } from 'next'
import './globals.css'
import { DesktopNav, MobileNav, ProfileButton } from '@/components/NavLinks'
import { LogoutButton } from '@/components/LogoutButton'
import { ProfileModalWrapper } from '@/components/ProfileModalWrapper'
import { ChefHat } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Meal Prep App',
  description: 'Plan your meals, prep smarter',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <ProfileModalWrapper>
          {children}
        </ProfileModalWrapper>
      </body>
    </html>
  )
}
