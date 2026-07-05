import "@/styles/globals.css";
import dynamic from "next/dynamic";
import Script from "next/script";

const CookieBanner = dynamic(() => import("@/components/CookieBanner"), {
  ssr: false,
  loading: () => null,
});

export default function App({ Component, pageProps }) {
  return (
    <>
      <Component {...pageProps} />
      <CookieBanner />
      <Script id="yandex-metrika" strategy="afterInteractive">
        {`
          (function(m,e,t,r,i,k,a){
              m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};
              m[i].l=1*new Date();
              for (var j = 0; j < document.scripts.length; j++) {if (document.scripts[j].src === r) { return; }}
              k=e.createElement(t),a=e.getElementsByTagName(t)[0],k.async=1,k.src=r,a.parentNode.insertBefore(k,a)
          })(window, document,'script','https://mc.yandex.ru/metrika/tag.js', 'ym');

          ym(46972497, 'init', {clickmap:true, referrer: document.referrer, url: location.href, accurateTrackBounce:true, trackLinks:true});
        `}
      </Script>
    </>
  );
}
