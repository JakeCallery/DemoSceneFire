import React from "react";
import Script from "next/script";

const GoogleAnalyticsScript = () => {
  return (
    <>
      <Script
        async
        src="https://www.googletagmanager.com/gtag/js?id=G-XB90ESN4E0"
      ></Script>
      <Script id="google-analytics">
        {`window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());
    
      gtag('config', 'G-XB90ESN4E0');`}
      </Script>
    </>
  );
};

export default GoogleAnalyticsScript;
