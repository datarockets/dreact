import Link from 'next/link'
import { useRouter } from 'next/router'

function MeetPage() {
  const router = useRouter()

  const { name } = router.query

  return (
    <div>
      <h1>Hello {name}!</h1>
      <p>
        <Link href="/">
          <a>Go Home</a>
        </Link>
      </p>
    </div>
  )
}

// ----------------------------------------

// export async function getStaticProps({ params }) {
//   const props = {
//     ...params,
//   }

//   return { props }
// }

// export async function getStaticPaths() {
//   return {
//     paths: [],
//     fallback: false,
//   }
// }

// ----------------------------------------

// export async function getServerSideProps({ params }) {
//   return {
//     props: { ...params },
//   }
// }

export default MeetPage
