import Script from "next/script";

import {
  getAdSenseClientId,
  getGoogleAnalyticsId,
} from "@/config/site-integrations";

export function SiteIntegrations() {
  const googleAnalyticsId = getGoogleAnalyticsId();
  const adSenseClientId = getAdSenseClientId();

  return (
    <>
      {googleAnalyticsId ? (
        <>
          <Script
            src={`https://www.googletagmanager.com/gtag/js?id=${googleAnalyticsId}`}
            strategy="afterInteractive"
          />
          <Script id="google-analytics" strategy="afterInteractive">
            {`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${googleAnalyticsId}', {
                anonymize_ip: true
              });
            `}
          </Script>
        </>
      ) : null}
      {adSenseClientId ? (
        <Script
          crossOrigin="anonymous"
          src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${adSenseClientId}`}
          strategy="afterInteractive"
        />
      ) : null}
    </>
  );
}
