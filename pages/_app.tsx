import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { Navbar } from '../components/Navbar'
import { QueryClient, QueryClientProvider, Hydrate, } from "react-query";
import React from 'react';
import Head from 'next/head';
import { AuthProvider } from '../helpers/context/User';


function MyApp({ Component, pageProps }: AppProps) {
  const [queryClient] = React.useState(() => new QueryClient());
  return (
    <>
      <Head>
        <meta name="description" content="Suzuki concession & aide | ESGI" />
        <link rel="icon" href="/suzuki-logo.ico" />
      </Head>
      <AuthProvider>
        <QueryClientProvider client={queryClient}>
          <Hydrate state={pageProps.dehydratedState}>
            <Navbar>
              <Component {...pageProps} />
            </Navbar>
          </Hydrate>
        </QueryClientProvider>
      </AuthProvider>
    </>
  )
}

export default MyApp
