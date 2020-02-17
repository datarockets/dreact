import { useEffect, useState } from 'react'
import Link from 'next/link'

function HomePage() {
  const [val, setVal] = useState(1)

  const increase = () => setVal(val + 1)

  useEffect(() => {
    setInterval(increase, 1000)
  }, [val])

  return (
    <div>
      <p>Welcome to Next.js! {val}</p>
      <Link href="Test" as="/asd">
        Hello
      </Link>
    </div>
  )
}

export default HomePage
