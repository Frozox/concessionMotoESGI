import type { NextPage } from 'next'
import Head from 'next/head'

const Home: NextPage = () => {
  return (
    <div className='flex h-full'>
      <Head>
        <title>Suzuki concession & aide | ESGI</title>
        <meta name="description" content="Suzuki concession & aide | ESGI" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className='w-full mx-7 mt-5'>
        <h1 className=''>Bienvenue sur notre forum d'aide chez Suzuki</h1>
      </div>
    </div>
  )
}

export default Home
