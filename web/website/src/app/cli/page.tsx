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

      <Section title={'Example'} />
      <iframe
        width="100%"
        height={'835px'}
        allow="clipboard-write"
        src="https://emgithub.com/iframe.html?target=https%3A%2F%2Fgithub.com%2Fkheiyoshida%2Fmgnr%2Fblob%2Fmain%2Fpkgs%2Fmgnr-cli%2Fsrc%2Fsample.ts&style=default&type=code&showBorder=on&showLineNumbers=on&showFileMeta=on&showFullPath=on&showCopy=on"
      ></iframe>
    </PageBody>
  )
}
