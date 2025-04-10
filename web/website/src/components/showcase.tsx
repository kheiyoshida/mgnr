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
        showLineNumbers: true,
        editorHeight: 600, // default - 300
        editorWidthPercentage: 70, // default - 50
        showNavigator: true,
      }}
      customSetup={{
        entry: '/index.ts',
        dependencies: {
          "@mgnr/tone": "^0.1.0",
          tone: '^14.7.77',
        },
      }}
    />
  )
}
