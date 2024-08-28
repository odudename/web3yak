import React from 'react'
import { default as NextHead } from 'next/head'
import { SITE_DESCRIPTION, SITE_NAME } from '../../configuration/Config'
interface Props {
  title?: string
  description?: string
}

export function Head(props: Props) {
  return (
    <NextHead>
      <title>{props.title ?? SITE_NAME}</title>
      <meta name="description" content={props.description ?? SITE_DESCRIPTION} />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <meta name="author" content="ODude.com v1.0" />
    </NextHead>
    )
}
