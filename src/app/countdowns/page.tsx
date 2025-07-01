import Header from "@/components/common/Header"
import { CountdownTimer } from "@/components/ui/countdown-timer"

export default function Countdowns() {
  // Helper function to generate future dates
  const getFutureDate = (days: number): string => {
    const date = new Date()
    date.setDate(date.getDate() + days)
    return date.toISOString()
  }

  // Hardcoded array of countdown objects
  const countdowns = [
    {
      title: "Our Anniversary",
      date: getFutureDate(45)
    },
    {
      title: "Weekend Getaway",
      date: getFutureDate(12)
    },
    {
      title: "Date Night",
      date: getFutureDate(3)
    },
    {
      title: "Monthly Adventure",
      date: getFutureDate(28)
    },
    {
      title: "Concert Together",
      date: getFutureDate(67)
    },
    {
      title: "Vacation Planning",
      date: getFutureDate(89)
    }
  ]

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-12">
        {/* Page Header */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-headline font-bold text-foreground mb-4">
            Looking Forward To...
          </h1>
          <p className="text-lg text-muted-foreground font-body">
            Counting down the moments until our next special day.
          </p>
        </div>

        {/* Countdowns Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {countdowns.map((countdown, index) => (
            <CountdownTimer
              key={index}
              title={countdown.title}
              date={countdown.date}
            />
          ))}
        </div>
      </main>
    </div>
  )
}
