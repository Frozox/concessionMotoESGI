import type { NextPage } from 'next'
import Head from 'next/head'
import { Login } from '../components/Login'

const Home: NextPage = () => {
  return (
    <div className='flex h-full'>
      <Head>
        <title>Moto concession | ESGI</title>
        <meta name="description" content="Concession Moto ESGI" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className='w-full mx-7 mt-5'>
        <h1 className=''>Bienvenue</h1>
      </div>
    </div>
  )
}

export default Home
