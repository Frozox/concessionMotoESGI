import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { Navbar } from '../components/Navbar'
import React from 'react';
import Head from 'next/head';
import { AuthProvider } from '../helpers/context/User';


function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <meta name="description" content="Suzuki concession & aide | ESGI" />
        <link rel="icon" href="/suzuki-logo.ico" />
      </Head>
      <AuthProvider>
        <Navbar>
          <Component {...pageProps} />
        </Navbar>
      </AuthProvider>
    </>
  )
}

export default MyApp
