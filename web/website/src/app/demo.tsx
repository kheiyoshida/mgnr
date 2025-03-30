import Showcase, { FileData } from '@/components/showcase'
import { getSampleCode } from '@/lib/getSampleCode'

export const DemoShowCase = () => {
  const files: FileData[] = [
    {
      fileName: 'index.ts',
      code: getSampleCode('demo/index.ts'),
    },
    {
      fileName: 'song.ts',
      code: getSampleCode('demo/song.ts'),
      active: true,
    },
    {
      fileName: 'mix.ts',
      code: getSampleCode('demo/mix.ts'),
    },
    {
      fileName: 'patterns.ts',
      code: getSampleCode('demo/patterns.ts'),
    },
    {
      fileName: 'instruments.ts',
      code: getSampleCode('demo/instruments.ts'),
    },
  ]
  return <Showcase files={files} />
}
