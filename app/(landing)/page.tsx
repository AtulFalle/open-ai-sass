import { Button } from '@/components/ui/button'
import Link from 'next/link'

export default function LandingPage() {
  return (
    <div>

      <p className='text-6xl '>landing page</p>

      <Link href="/sign-in">
        <Button variant="ghost" >Login</Button>
      </Link>

      <Link href="/sign-up">
        <Button variant="ghost" >Register</Button>
      </Link>

    </div>
  )
}
