import type { AppProps } from "next/app";
// import Greeter from "../src/components/Greeter";
import { Web3ContextProvider } from "../src/contexts/Web3Context";
import RainbowkitProvider from "../src/providers/rainbowkit";
import "../styles/App.scss";

const MyApp = ({ Component, pageProps }: AppProps) => (
  <RainbowkitProvider>
    <Web3ContextProvider>
      <Component {...pageProps} />
    </Web3ContextProvider>
  </RainbowkitProvider>
);

// const MyApp = ({ Component, pageProps }: AppProps) => <Greeter />;
export default MyApp;
