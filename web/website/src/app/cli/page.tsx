import { IFrameContainer, PageBody, Section } from '@/components'
import React from 'react'

export default function CliPage() {
  return (
    <PageBody>
      <Section title={'Demonstration'} />

      <IFrameContainer>
        <iframe
          width="100%"
          height="100%"
          src="https://www.youtube.com/embed/5oNRNsfQMAU?si=TzKii9WX0zxE9t-l"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          referrerPolicy="strict-origin-when-cross-origin"
          allowFullScreen
        ></iframe>
      </IFrameContainer>

      <Section title={'Installation'} />
      <code className="my-2">npm i @mgnr/cli</code>
    </PageBody>
  )
}
