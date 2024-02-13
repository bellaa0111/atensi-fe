import { ChakraProvider } from '@chakra-ui/react'
import { NextSeo } from 'next-seo'
import '../styles/globals.css'

function MyApp({ Component, pageProps }) {
  return (
    <ChakraProvider>
      <NextSeo
        title="Appraisal Form | BEM Psikologi UI"
      />
      <Component {...pageProps} />
    </ChakraProvider>
  )
}

export default MyApp
