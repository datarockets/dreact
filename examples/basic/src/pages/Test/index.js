import Link from 'next/link'

function HomePage() {
  return (
    <div>
      <p>TEST</p>
      <Link href="Home" as="/">
        Home
      </Link>
    </div>
  )
}

export default HomePage
