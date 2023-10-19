import React from "react";
import Script from "next/script";

const GoogleAnalyticsScript = () => {
  return (
    <>
      <Script
        async
        src="https://www.googletagmanager.com/gtag/js?id=G-4K98VQ9X3Q"
      ></Script>
      <Script id="google-analytics">
        {`window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());
    
      gtag('config', 'G-4K98VQ9X3Q');`}
      </Script>
    </>
  );
};

export default GoogleAnalyticsScript;
