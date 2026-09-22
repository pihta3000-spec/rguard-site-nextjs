import { Html, Head, Main, NextScript } from "next/document";
import { themeBootstrap } from '@/lib/theme'

export default function Document() {
  return (
    <Html lang="ru" suppressHydrationWarning>
      <Head>
        <meta charSet="utf-8" />
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <meta name="theme-color" content="#0a0a14" />
        <script dangerouslySetInnerHTML={{ __html: themeBootstrap }} />
      </Head>
      <body>
        <noscript>
          <div>
            <img src="https://mc.yandex.ru/watch/46972497" style={{ position: 'absolute', left: '-9999px' }} alt="" />
          </div>
        </noscript>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
