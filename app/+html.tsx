import { ScrollViewStyleReset } from 'expo-router/html';
import { type PropsWithChildren } from 'react';

// This file is web-only and used to configure the root HTML for every
// web page during static rendering.
// The contents of this function only run in Node.js environments and
// do not have access to the DOM or browser APIs.
export default function Root({ children }: PropsWithChildren) {
  return (
    <html lang="en" className="bg-background">
      <head>
        <meta charSet="utf-8" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />
        <meta name="google-adsense-account" content="ca-pub-9130836798889522" />
        <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-9130836798889522"
          crossOrigin="anonymous"
        />

        {/* Global styles for full-width web layout */}
        <style
          dangerouslySetInnerHTML={{
            __html: `
              html, body {
                width: 100%;
                height: 100%;
                margin: 0;
                padding: 0;
                overflow-x: hidden;
              }
              #root {
                width: 100%;
                height: 100%;
                max-width: none !important;
              }
              body > div {
                width: 100% !important;
                max-width: none !important;
              }
            `,
          }}
        />

        {/*
          Disable body scrolling on web. This makes ScrollView components work closer to how they do on native.
          However, body scrolling is often nice to have for mobile web. If you want to enable it, remove this line.
        */}
        <ScrollViewStyleReset />

        {/* Add any additional <head> elements that you want globally available on web... */}

        {/* Google Analytics */}
        <script async src="https://www.googletagmanager.com/gtag/js?id=G-MXR810EQ7G" />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-MXR810EQ7G');
            `,
          }}
        />

        {/* Naver Analytics */}
        <script type="text/javascript" src="//wcs.pstatic.net/wcslog.js"></script>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if(!wcs_add) var wcs_add = {};
              wcs_add["wa"] = "17d0cced19df3c0";
              if(window.wcs) {
                wcs_do();
              }
            `,
          }}
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
