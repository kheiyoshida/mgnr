import Showcase, { FileData } from '@/components/showcase'
import { getSampleCode } from '@/lib/getSampleCode'

export default function Home() {
  const files: FileData[] = [
    {
      fileName: "index.ts",
      code: getSampleCode("demo/index.ts"),
    },
    {
      fileName: "song.ts",
      code: getSampleCode("demo/song.ts"),
      active: true,
    },
    {
      fileName: "mix.ts",
      code: getSampleCode("demo/mix.ts"),
    },
    {
      fileName: "patterns.ts",
      code: getSampleCode("demo/patterns.ts"),
    },
    {
      fileName: "instruments.ts",
      code: getSampleCode("demo/instruments.ts"),
    },
  ]

  return (
    <div className="py-2">
      <code className='my-2'>
        pnpm add @mgnr/tone
      </code>
      <Showcase files={files} />
    </div>
  )
}
