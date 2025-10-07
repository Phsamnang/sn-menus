import { UtensilsCrossed } from "lucide-react"

export function MenuHeader() {
  return (
    <header className="sticky top-0 z-10 bg-card border-b border-border">
      <div className="container mx-auto px-4 py-4 max-w-2xl">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
            <UtensilsCrossed className="w-5 h-5 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-balance">The Gourmet Kitchen</h1>
            <p className="text-sm text-muted-foreground">Table 12</p>
          </div>
        </div>
      </div>
    </header>
  )
}
