'use client'

import { Sandpack } from '@codesandbox/sandpack-react'

export default function Sample({ code }: { code: string }) {
  return (
    <Sandpack
      template="vanilla"
      files={{
        '/index.js': {
          code: `import * as mgnr from '@mgnr/tone'`,
          active: true,
        },
      }}
      options={{
        showTabs: true,
        showLineNumbers: true,
      }}
      customSetup={{
        entry: '/index.js',
        dependencies: {
          "@mgnr/tone": "^0.0.8",
          tone: '^14.7.77',
        },
      }}
    />
  )
}
