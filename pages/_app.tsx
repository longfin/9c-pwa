import '@/styles/globals.css'
import type { AppProps } from 'next/app'
import { RecoilRoot } from 'recoil'
import { ThemeProvider, createTheme } from '@mui/material'
import { blue } from '@mui/material/colors'

export default function App({ Component, pageProps }: AppProps) {
  const muiTheme = createTheme({
    palette: {
      primary: blue,
      mode: "dark",
    },
  });
  return <>
  <ThemeProvider theme={muiTheme}>
    <RecoilRoot>
      <Component {...pageProps} />
    </RecoilRoot>
  </ThemeProvider>
  </>
}
