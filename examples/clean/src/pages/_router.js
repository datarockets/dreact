import dynamic from 'next/dynamic'
import { useRouter } from 'next/router'

const PageIndex = dynamic(() => import('./index'))
const PageMeetName = dynamic(() => import('./meet/[name]'))

function SinglePageApp() {
  const router = useRouter()

  console.log(router)

  return (
    <>
      {router.route === '/' && <PageIndex />}
      {router.route === '/meet/[name]' && <PageMeetName />}
      {router.route !== '/' && router.route !== '/meet/[name]' && <p>errrr</p>}
    </>
  )
}

export default SinglePageApp
