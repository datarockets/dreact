import Link from 'next/link'

function HomePage() {
  return (
    <div>
      <h1>Welcome to dreact example!</h1>
      <ul>
        <li>
          <Link href="/meet/Eugene">
            <a>Meet Eugene</a>
          </Link>
        </li>
        <li>
          <Link href="/meet/Vasya">
            <a>Meet Vasya</a>
          </Link>
        </li>
      </ul>
    </div>
  )
}

export default HomePage
