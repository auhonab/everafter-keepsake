import Link from "next/link"
import { Heart } from "lucide-react"
import { ThemeToggle } from "@/components/theme-toggle"

export default function WelcomePage() {
  return (
    <div className="min-h-screen relative flex items-center justify-center overflow-hidden bg-background dark:bg-background">
      {/* Theme Toggle */}
      <div className="absolute top-6 right-6 z-20">
        <ThemeToggle />
      </div>
      
      {/* Floating Elements */}
      <div className="absolute top-20 left-20 opacity-50 text-rose-600 dark:text-rose-400">
        <Heart className="w-6 h-6 animate-pulse" />
      </div>
      <div className="absolute top-40 right-32 opacity-45 text-amber-600 dark:text-amber-400">
        <Heart className="w-4 h-4 animate-pulse delay-1000" />
      </div>
      <div className="absolute bottom-32 left-32 opacity-55 text-orange-600 dark:text-orange-400">
        <Heart className="w-5 h-5 animate-pulse delay-2000" />
      </div>
      <div className="absolute bottom-20 right-20 opacity-50 text-pink-600 dark:text-pink-400">
        <Heart className="w-3 h-3 animate-pulse delay-500" />
      </div>
      
      
      {/* Main Content */}
      <div className="relative z-10 text-center px-8 max-w-4xl mx-auto">
        {/* Title with Heart Icon */}
        <div className="flex items-center justify-center gap-4 mb-8">
          <Heart className="w-12 h-12 text-rose-600 dark:text-rose-400 fill-rose-600/30 dark:fill-rose-400/30" />
          <h1 className="text-5xl md:text-7xl font-script font-bold text-amber-900 dark:text-amber-100 leading-tight">
            EverAfter Keepsake
          </h1>
          <Heart className="w-12 h-12 text-rose-600 dark:text-rose-400 fill-rose-600/30 dark:fill-rose-400/30" />
        </div>
        
        {/* Main Description */}
        <p className="text-xl md:text-2xl font script font-normal text-amber-900 dark:text-amber-200">

          This is a private sanctuary for our shared story. A place to preserve our most cherished memories, 
          celebrate milestones, and watch our love story unfold.
        </p>
        
        {/* Secondary Description */}
        <p className="text-lg md:text-xl text-slate-700 dark:text-amber-300 font-body italic leading-relaxed mb-12 max-w-2xl mx-auto font-medium">
          Every photo, every note, every moment—all kept safe, just for us.
        </p>
        
        {/* Call to Action Button */}
        <Link href="/home">
          <button className="group relative px-12 py-4 bg-gradient-to-r from-rose-600 to-amber-600 dark:from-rose-500 dark:to-amber-500 text-amber-50 dark:text-amber-50 font-body font-semibold text-lg rounded-full shadow-xl hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300 overflow-hidden">
            {/* Button Background Animation */}
            <div className="absolute inset-0 bg-gradient-to-r from-amber-600 to-rose-600 dark:from-amber-500 dark:to-rose-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            
            {/* Button Content */}
            <span className="relative flex items-center gap-3">
              Enter Our Sanctuary
              <Heart className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" />
            </span>
          </button>
        </Link>
        
        {/* Decorative Quote */}
        <div className="mt-16 opacity-80">
          <p className="text-slate-700 dark:text-amber-200 font-script text-lg italic font-medium">
            &ldquo;Love is not just looking at each other, it&apos;s looking in the same direction.&rdquo;
          </p>
        </div>
      </div>
      
      {/* Bottom Decorative Elements */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 opacity-50">
        <div className="flex space-x-2">
          <div className="w-2 h-2 bg-rose-600 dark:bg-rose-400 rounded-full animate-pulse"></div>
          <div className="w-2 h-2 bg-amber-600 dark:bg-amber-400 rounded-full animate-pulse delay-200"></div>
          <div className="w-2 h-2 bg-orange-600 dark:bg-orange-400 rounded-full animate-pulse delay-400"></div>
        </div>
      </div>
    </div>
  )
}
