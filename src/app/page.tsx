import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import {
  CheckCircle2,
  BarChart3,
  BookOpen,
  Target,
  ArrowRight,
} from "lucide-react";

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <header className="border-b">
        <div className="max-w-6xl mx-auto flex items-center justify-between h-16 px-4">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-sm">
                R
              </span>
            </div>
            <span className="text-xl font-bold">Routinely</span>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/login" className={buttonVariants({ variant: "ghost" })}>
              Sign In
            </Link>
            <Link href="/signup" className={buttonVariants()}>
              Get Started
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="flex-1 flex items-center justify-center px-4 py-20">
        <div className="max-w-3xl text-center space-y-6">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight">
            Build Better Habits,{" "}
            <span className="text-primary">One Day at a Time</span>
          </h1>
          <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto">
            Your all-in-one daily planner for tracking habits, prayers, Quran
            Hifz progress, and tasks. Stay consistent and see your growth.
          </p>
          <div className="flex items-center justify-center gap-3 pt-2">
            <Link href="/signup" className={buttonVariants({ size: "lg" }) + " gap-2"}>
              Start for Free
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="border-t bg-muted/30 px-4 py-20">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-bold text-center mb-12">
            Everything you need to plan your day
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <FeatureCard
              icon={<CheckCircle2 className="h-8 w-8 text-green-600" />}
              title="Habit Tracking"
              description="Track daily, weekly, or custom habits. Mark complete with a tap and build streaks."
            />
            <FeatureCard
              icon={<Target className="h-8 w-8 text-blue-600" />}
              title="Prayer Tracker"
              description="Log your 5 daily prayers with on-time/late status. Track Qaza makeup prayers."
            />
            <FeatureCard
              icon={<BookOpen className="h-8 w-8 text-purple-600" />}
              title="Quran Hifz"
              description="Track Sabq, Sabqi, and Manzil daily. See your memorization history."
            />
            <FeatureCard
              icon={<BarChart3 className="h-8 w-8 text-orange-600" />}
              title="Progress & Stats"
              description="Visualize your consistency with charts, streaks, and completion rates."
            />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-8 px-4">
        <div className="max-w-6xl mx-auto text-center text-sm text-muted-foreground">
          <p>Routinely - Built with care for a better daily routine.</p>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="p-6 rounded-xl border bg-card space-y-3">
      {icon}
      <h3 className="font-semibold text-lg">{title}</h3>
      <p className="text-sm text-muted-foreground">{description}</p>
    </div>
  );
}
