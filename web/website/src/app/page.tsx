import { DemoShowCase } from '@/app/demo'
import React from 'react'
import { PageBody, Section } from '@/components'

export default function Home() {
  return (
    <PageBody>
      <Section title={'Playground'} />
      <DemoShowCase />

      <Section title={'Installation'} />
      <code className="my-2">npm i @mgnr/tone</code>

      <Section title={'Documentation'} />
      <div>coming soon</div>

      <Section title={'Development'} />
      <div>
        made by <a href={'https://www.kheiyoshida.com'}>{`Katsumi "Khei" Yoshida`}</a>
      </div>
      <div>
        source code: <a href={'https://github.com/kheiyoshida/mgnr'}>{`https://github.com/kheiyoshida/mgnr`}</a>
      </div>
    </PageBody>
  )
}
