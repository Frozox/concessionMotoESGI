import type { NextPage } from 'next'
import Head from 'next/head'
import { useQuery } from 'react-query'
import { handleResponseTab } from '../helpers/helper'

const Home: NextPage = () => {
  const { data, status } = useQuery('motos', () => fetch('http://localhost:8080/api/motos').then((res: { json: () => any }) => res.json()))

  return (
    <div className='flex h-full'>
      <Head>
        <title>Moto concession | ESGI</title>
        <meta name="description" content="Concession Moto ESGI" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className='w-full mx-7 mt-5'>
        <h1 className=''>Bienvenue</h1>
        {handleResponseTab(data, status)}
      </div>
    </div>
  )
}

export default Home
