import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { RecoilRoot } from 'recoil'
import { ThemeProvider, createTheme } from '@mui/material'
import { blue } from '@mui/material/colors'
import { cacheExchange, createClient, dedupExchange, fetchExchange, Provider as UrqlProvider } from 'urql';

export default function App({ Component, pageProps }: AppProps) {
  const muiTheme = createTheme({
    palette: {
      primary: blue,
      mode: "dark",
    },
  });
  const urqlClient = createClient({
    url: "https://9c-main-full-state.planetarium.dev/graphql",
    exchanges: [fetchExchange, dedupExchange, cacheExchange],
  });

  return <>
    <UrqlProvider value={urqlClient}>
      <ThemeProvider theme={muiTheme}>
        <RecoilRoot>
          <Component {...pageProps} />
        </RecoilRoot>
      </ThemeProvider>
    </UrqlProvider>
  </>
}
