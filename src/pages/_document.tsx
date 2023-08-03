import { Html, Head, Main, NextScript } from "next/document";
import Script from "next/script";

export default function Document() {
  return (
    <Html lang='en'>
      <Head />
      <body>
        <Script type='text/javascript' strategy='beforeInteractive' src='/three/three.min.js' />
        <Script type='text/javascript' strategy='beforeInteractive' src='/three/OrbitControls.js' />
        <Script type='text/javascript' strategy='beforeInteractive' src='/three/WebGL.js' />
        <Script type='text/javascript' strategy='beforeInteractive' src='/three/libs/dat.gui.min.js' />
        <Script type='text/javascript' strategy='beforeInteractive' src='/three/libs/tween.min.js' />
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
