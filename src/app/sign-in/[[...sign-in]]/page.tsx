import { SignIn } from '@clerk/nextjs'

export default function SignInPage() {
  return (
    <div className="min-h-screen flex">
      {/* Left Side - Story & Atmosphere */}
      <div className="hidden lg:flex lg:flex-1 relative overflow-hidden bg-gradient-to-br from-amber-50 via-orange-50 to-rose-50">
        {/* Vintage paper texture background */}
        <div 
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23d4a574' fill-opacity='0.1'%3E%3Ccircle cx='2' cy='2' r='1'/%3E%3Ccircle cx='32' cy='2' r='1'/%3E%3Ccircle cx='17' cy='17' r='1'/%3E%3Ccircle cx='47' cy='17' r='1'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />
        
        {/* Floating decorative elements */}
        <div className="absolute top-10 left-10 opacity-20 text-muted-foreground font-script text-sm rotate-12">
          "Dear Diary, today we..."
        </div>
        <div className="absolute top-32 right-16 opacity-15 text-muted-foreground font-script text-xs -rotate-6">
          "Our first dance under starlight..."
        </div>
        <div className="absolute bottom-40 left-8 opacity-20 text-muted-foreground font-script text-sm rotate-3">
          "Love letters & coffee rings..."
        </div>
        
        {/* Watermark words */}
        <div className="absolute top-1/4 left-1/4 opacity-5 text-6xl font-headline text-foreground rotate-45">
          Our Story
        </div>
        <div className="absolute bottom-1/4 right-1/4 opacity-5 text-4xl font-headline text-foreground -rotate-12">
          Dear Diary
        </div>
        
        {/* Floating petals/elements */}
        <div className="absolute top-20 right-20 w-4 h-4 bg-rose-200 rounded-full opacity-30 animate-pulse"></div>
        <div className="absolute top-60 left-20 w-3 h-3 bg-amber-200 rounded-full opacity-40 animate-pulse delay-1000"></div>
        <div className="absolute bottom-32 right-32 w-5 h-5 bg-orange-200 rounded-full opacity-25 animate-pulse delay-2000"></div>
        
        {/* Main content */}
        <div className="flex flex-col justify-center px-16 py-20 z-10">
          <h1 className="text-6xl font-headline font-bold text-foreground mb-6 leading-tight">
            Where Our Story Begins
          </h1>
          <p className="text-xl font-body italic text-muted-foreground mb-8 leading-relaxed">
            "Every moment deserves a place to live."
          </p>
          
          {/* Botanical illustration */}
          <div className="absolute bottom-16 left-16 opacity-20">
            <svg width="120" height="80" viewBox="0 0 120 80" className="text-muted-foreground">
              <path 
                d="M10 70 Q30 50 50 60 Q70 50 90 70 Q70 40 50 50 Q30 40 10 70" 
                stroke="currentColor" 
                strokeWidth="1" 
                fill="none"
                className="opacity-60"
              />
              <circle cx="50" cy="55" r="8" stroke="currentColor" strokeWidth="1" fill="none" className="opacity-40" />
              <path d="M50 47 L50 63 M42 55 L58 55" stroke="currentColor" strokeWidth="1" className="opacity-50" />
            </svg>
          </div>
        </div>
      </div>

      {/* Right Side - Sign In Form */}
      <div className="flex-1 flex items-center justify-center p-8 bg-gradient-to-bl from-amber-25 to-orange-25">
        <div className="w-full max-w-md">
          {/* Header */}
          <div className="text-center mb-8">
            <h2 className="text-3xl font-headline font-bold text-foreground mb-2">
              Welcome Back
            </h2>
            <p className="text-muted-foreground font-body">
              Continue your story
            </p>
          </div>
          
          {/* Clerk Sign In Component */}
          <SignIn 
            appearance={{
              elements: {
                formButtonPrimary: 'bg-amber-700 hover:bg-amber-800 text-amber-50 font-medium shadow-md border-0 rounded-md transition-all duration-200',
                card: 'bg-transparent shadow-none border-0 p-0',
                headerTitle: 'text-foreground font-headline text-xl',
                headerSubtitle: 'text-muted-foreground font-body text-sm',
                socialButtonsBlockButton: 'border border-border hover:bg-muted text-foreground font-medium rounded-md transition-all duration-200',
                formFieldInput: 'border-border focus:border-amber-600 focus:ring-amber-600 rounded-md bg-background font-body',
                footerActionLink: 'text-amber-700 hover:text-amber-800 font-medium',
                identityPreviewText: 'text-foreground font-body',
                formFieldLabel: 'text-foreground font-body font-medium',
                dividerLine: 'bg-border',
                dividerText: 'text-muted-foreground font-body',
                formHeaderTitle: 'hidden',
                formHeaderSubtitle: 'hidden'
              }
            }}
          />
          
          {/* Footer quote */}
          <div className="text-center mt-8 pt-6">
            <p className="text-muted-foreground font-body text-sm italic opacity-70">
              "Even the smallest moment has a story."
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
