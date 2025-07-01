import Link from "next/link"
import { Heart } from "lucide-react"

export default function Header() {
  return (
    <header className="sticky top-0 z-50 backdrop-blur-md bg-background/80 border-b border-border">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        {/* Logo and Site Title */}
        <Link href="/" className="flex items-center gap-2 text-2xl font-headline font-bold text-foreground hover:text-primary transition-colors">
          <Heart className="h-6 w-6 text-primary" fill="currentColor" />
          EverAfter Keepsake
        </Link>
        
        {/* Navigation */}
        <nav className="hidden md:flex items-center gap-6">
          <Link href="/" className="text-foreground hover:text-primary transition-colors font-medium">
            Home
          </Link>
          <Link href="/timeline" className="text-foreground hover:text-primary transition-colors font-medium">
            Timeline
          </Link>
          <Link href="/albums" className="text-foreground hover:text-primary transition-colors font-medium">
            Photo Albums
          </Link>
          <Link href="/love-notes" className="text-foreground hover:text-primary transition-colors font-medium">
            Love Notes
          </Link>
          <Link href="/memory-map" className="text-foreground hover:text-primary transition-colors font-medium">
            Memory Map
          </Link>
          <Link href="/journal" className="text-foreground hover:text-primary transition-colors font-medium">
            Our Journal
          </Link>
          <Link href="/countdowns" className="text-foreground hover:text-primary transition-colors font-medium">
            Countdowns
          </Link>
        </nav>
      </div>
    </header>
  )
}
