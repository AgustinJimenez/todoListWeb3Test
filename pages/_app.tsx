import type { AppProps } from "next/app";
import "../styles/App.scss";

function MyApp({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />;
}

export default MyApp;
