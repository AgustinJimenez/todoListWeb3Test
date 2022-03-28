import type { AppProps } from "next/app";
import { Web3ContextProvider } from "../src/contexts/Web3Context";
import "../styles/App.scss";

const MyApp = ({ Component, pageProps }: AppProps) => (
  <Web3ContextProvider>
    <Component {...pageProps} />
  </Web3ContextProvider>
);

export default MyApp;
