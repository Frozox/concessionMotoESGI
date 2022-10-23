import type { NextPage } from 'next'
import Head from 'next/head'

const Home: NextPage = () => {
  return (
    <div className='h-screen'>
      <Head>
        <title>Moto concession | ESGI</title>
        <meta name="description" content="Concession Moto ESGI" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
    </div>
  )
}

export default Home
