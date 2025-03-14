import { Dev } from '@/app/dev/dev'

export default function DevPage() {
  if (process.env.NODE_ENV !== 'development') return

  return <Dev />
}
