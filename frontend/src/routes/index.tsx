import { Button } from '#/components/ui/button'
import { createFileRoute } from '@tanstack/react-router'
import { toast } from 'sonner'

export const Route = createFileRoute('/')({ component: App })

function App() {
  return (
    <main className="h-screen flex items-center justify-center">
      <Button onClick={() => toast.success("Hello")}>Hello</Button>
    </main>
  )
}
