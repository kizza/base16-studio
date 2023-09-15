import { ThemeProvider, createTheme } from '@mui/material';
import { grey } from '@mui/material/colors';
import { Shadows } from "@mui/material/styles/shadows";
import Head from 'next/head';
import Form from '../components/Form';
import styles from '../styles/Home.module.css';

const theme = createTheme({
  shadows: Array(25).fill("0px 1px 2px -1px rgba(0,0,0,0.2)") as Shadows,
  palette: {
    primary: {
      main: grey[800],
      light: "#eee",
    },
    secondary: {
      main: "#fff",
      contrastText: "#333",
    }
  },
});

export const switchStyles = {
  off: {color: grey[300], },
  on: {color: theme.palette.primary.main }
}

export default function Home() {
  return (
    <div className={styles.container}>
      <Head>
        <title>Base16 Studio</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="h-full">
        <ThemeProvider theme={theme}>
          <Form />
        </ThemeProvider>
      </main>
    </div>
  );
}
