import Sample from '@/app/demo'
import { getSampleCode } from '@/lib/getSampleCode'

export default function Home() {
  const sampleCode = getSampleCode("instruments.ts")

  return (
    <div className="w-screen h-screen">
      <Sample code={sampleCode} />
    </div>
  )
}
