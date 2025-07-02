import Link from "next/link"
import { Heart } from "lucide-react"

export default function WelcomePage() {
  return (
    <div className="min-h-screen relative flex items-center justify-center overflow-hidden bg-background">
      {/* Light mode background */}
      <div className="absolute inset-0 bg-gradient-to-br from-amber-25 via-rose-25 to-orange-25 dark:hidden" />
      
      {/* Dark mode background */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-purple-900/20 to-rose-900/30 hidden dark:block" />
      
      {/* Light mode rose pattern */}
      <div 
        className="absolute inset-0 opacity-40 dark:hidden"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' stroke='%23d4a574' stroke-width='0.5' opacity='0.3'%3E%3Ccircle cx='20' cy='20' r='8' fill='%23f4a5a5' opacity='0.2'/%3E%3Cpath d='M20 12 Q24 16 20 20 Q16 16 20 12' fill='%23f4a5a5' opacity='0.3'/%3E%3Cpath d='M12 20 Q16 16 20 20 Q16 24 12 20' fill='%23f4a5a5' opacity='0.3'/%3E%3Cpath d='M20 28 Q16 24 20 20 Q24 24 20 28' fill='%23f4a5a5' opacity='0.3'/%3E%3Cpath d='M28 20 Q24 24 20 20 Q24 16 28 20' fill='%23f4a5a5' opacity='0.3'/%3E%3Ccircle cx='80' cy='30' r='6' fill='%23f4a5a5' opacity='0.15'/%3E%3Cpath d='M80 24 Q83 27 80 30 Q77 27 80 24' fill='%23f4a5a5' opacity='0.25'/%3E%3Ccircle cx='30' cy='80' r='7' fill='%23f4a5a5' opacity='0.2'/%3E%3Cpath d='M30 73 Q34 77 30 80 Q26 77 30 73' fill='%23f4a5a5' opacity='0.3'/%3E%3Ccircle cx='70' cy='70' r='5' fill='%23f4a5a5' opacity='0.18'/%3E%3C/g%3E%3C/svg%3E")`,
          backgroundSize: '200px 200px'
        }}
      />
      
      {/* Dark mode rose pattern */}
      <div 
        className="absolute inset-0 opacity-20 hidden dark:block"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' stroke='%236B4F4F' stroke-width='0.5' opacity='0.4'%3E%3Ccircle cx='20' cy='20' r='8' fill='%238B6F6F' opacity='0.3'/%3E%3Cpath d='M20 12 Q24 16 20 20 Q16 16 20 12' fill='%238B6F6F' opacity='0.4'/%3E%3Cpath d='M12 20 Q16 16 20 20 Q16 24 12 20' fill='%238B6F6F' opacity='0.4'/%3E%3Cpath d='M20 28 Q16 24 20 20 Q24 24 20 28' fill='%238B6F6F' opacity='0.4'/%3E%3Cpath d='M28 20 Q24 24 20 20 Q24 16 28 20' fill='%238B6F6F' opacity='0.4'/%3E%3Ccircle cx='80' cy='30' r='6' fill='%238B6F6F' opacity='0.2'/%3E%3Cpath d='M80 24 Q83 27 80 30 Q77 27 80 24' fill='%238B6F6F' opacity='0.3'/%3E%3Ccircle cx='30' cy='80' r='7' fill='%238B6F6F' opacity='0.3'/%3E%3Cpath d='M30 73 Q34 77 30 80 Q26 77 30 73' fill='%238B6F6F' opacity='0.4'/%3E%3Ccircle cx='70' cy='70' r='5' fill='%238B6F6F' opacity='0.25'/%3E%3C/g%3E%3C/svg%3E")`,
          backgroundSize: '200px 200px'
        }}
      />
      
      {/* Light mode paper texture */}
      <div 
        className="absolute inset-0 opacity-25 dark:hidden"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23d4a574' fill-opacity='0.15'%3E%3Ccircle cx='2' cy='2' r='0.5'/%3E%3Ccircle cx='32' cy='2' r='0.5'/%3E%3Ccircle cx='17' cy='17' r='0.5'/%3E%3Ccircle cx='47' cy='17' r='0.5'/%3E%3Ccircle cx='12' cy='32' r='0.5'/%3E%3Ccircle cx='42' cy='32' r='0.5'/%3E%3Ccircle cx='27' cy='47' r='0.5'/%3E%3Ccircle cx='57' cy='47' r='0.5'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}
      />
      
      {/* Dark mode paper texture */}
      <div 
        className="absolute inset-0 opacity-15 hidden dark:block"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%234A3535' fill-opacity='0.25'%3E%3Ccircle cx='2' cy='2' r='0.5'/%3E%3Ccircle cx='32' cy='2' r='0.5'/%3E%3Ccircle cx='17' cy='17' r='0.5'/%3E%3Ccircle cx='47' cy='17' r='0.5'/%3E%3Ccircle cx='12' cy='32' r='0.5'/%3E%3Ccircle cx='42' cy='32' r='0.5'/%3E%3Ccircle cx='27' cy='47' r='0.5'/%3E%3Ccircle cx='57' cy='47' r='0.5'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}
      />
      
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
        <p className="text-xl md:text-2xl text-amber-800 dark:text-amber-200 font-body leading-relaxed mb-6 max-w-3xl mx-auto font-medium">
          This is a private sanctuary for our shared story. A place to preserve our most cherished memories, 
          celebrate milestones, and watch our love story unfold.
        </p>
        
        {/* Secondary Description */}
        <p className="text-lg md:text-xl text-amber-700 dark:text-amber-300 font-body italic leading-relaxed mb-12 max-w-2xl mx-auto font-medium">
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
          <p className="text-amber-800 dark:text-amber-200 font-script text-lg italic font-medium">
            "Love is not just looking at each other, it's looking in the same direction."
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
