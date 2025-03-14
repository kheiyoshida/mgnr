'use client'

import { Sandpack } from '@codesandbox/sandpack-react'

export type FileData = { code: string, fileName: string, active?: boolean }

export default function Showcase({ files }: { files: FileData[] }) {
  const filesDef = Object.fromEntries(files.map(file => {
    return [file.fileName, { code: file.code, active: file.active || false }]
  }))
  return (
    <Sandpack
      theme='dark'
      template="vanilla-ts"
      files={filesDef}
      options={{
        showTabs: true,
        showLineNumbers: false,
        editorHeight: 420, // default - 300
        editorWidthPercentage: 60, // default - 50
      }}
      customSetup={{
        entry: '/index.ts',
        dependencies: {
          "@mgnr/tone": "^0.0.8",
          tone: '^14.7.77',
        },
      }}
    />
  )
}
