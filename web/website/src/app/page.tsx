import { DemoShowCase } from '@/app/demo'
import React from 'react'
import { Section } from '@/components'

export default function Home() {
  return (
    <div className="py-8 px-2">
      <div className="my-12">
        <h1 className="text-4xl">mgnr</h1>
        <div className="text-lg leading-12">generative music library for js</div>
      </div>

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
    </div>
  )
}
