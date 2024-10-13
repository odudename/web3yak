import React from 'react'
import { useLoadConfig } from '../hooks/useLoadConfig';
import { DefaultSeo } from 'next-seo'

export default function Seo() {
  const { config, configLoading } = useLoadConfig();
  // Check if the config is loading
if (configLoading) {
  return <div>Loading...</div>;
}

// Handle case where config is null or not fully loaded
if (!config) {
  return <div>Error loading configuration.</div>;
}

  const origin = typeof window !== 'undefined' && window.location.origin ? window.location.origin : config.SITE_URL



  return (
    <DefaultSeo
      title={config.SITE_NAME}
      defaultTitle={config.SITE_NAME}
      titleTemplate={`%s | ${config.SITE_NAME}`}
      description={config.SITE_DESCRIPTION}
      defaultOpenGraphImageWidth={1200}
      defaultOpenGraphImageHeight={630}
      openGraph={{
        type: 'website',
        siteName: config.SITE_NAME,
        url: origin,
        images: [
          {
            url: `${origin}/og.png`,
            alt: `${config.SITE_NAME} Open Graph Image`,
          },
        ],
      }}
      twitter={{
        handle: `@${config.SOCIAL_TWITTER}`,
        site: `@${config.SOCIAL_TWITTER}`,
        cardType: 'summary_large_image',
      }}
    />
  )
}
