import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Wallet, TrendingUp, PieChart, Shield } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-slate-100 to-slate-200">
      {/* Header */}
      <header className="border-b border-slate-200 bg-white/50 backdrop-blur-sm">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <Wallet className="h-6 w-6 text-slate-700" />
            <span className="text-xl font-bold text-slate-800">PennyWise</span>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/signin">
              <Button
                variant="ghost"
                className="text-slate-700 hover:text-slate-900"
              >
                Sign In
              </Button>
            </Link>
            <Link href="/signup">
              <Button className="bg-slate-700 hover:bg-slate-800">
                Sign Up
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="container mx-auto px-4 py-20">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-8">
          {/* Left Side - Slogan & Content */}
          <div className="flex flex-col justify-center space-y-8">
            <div className="space-y-4">
              <h1 className="text-5xl font-bold leading-tight text-slate-900 lg:text-6xl">
                Smart Money,
                <br />
                <span className="text-slate-600">Smarter Choices</span>
              </h1>
              <p className="text-xl text-slate-600">
                Take control of your finances with intelligent budgeting and
                expense tracking.
              </p>
            </div>

            <div className="flex flex-col gap-4 sm:flex-row">
              <Link href="/signup">
                <Button
                  size="lg"
                  className="w-full bg-slate-700 text-lg hover:bg-slate-800 sm:w-auto"
                >
                  Get Started Free
                </Button>
              </Link>
              <Link href="/signin">
                <Button
                  size="lg"
                  variant="outline"
                  className="w-full border-slate-300 text-lg text-slate-700 hover:bg-slate-100 sm:w-auto"
                >
                  Sign In
                </Button>
              </Link>
            </div>

            {/* Features List */}
            <div className="grid gap-6 pt-8 sm:grid-cols-2">
              <div className="flex items-start gap-3">
                <div className="rounded-lg bg-slate-200 p-2">
                  <TrendingUp className="h-5 w-5 text-slate-700" />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900">
                    Track Expenses
                  </h3>
                  <p className="text-sm text-slate-600">
                    Monitor every transaction effortlessly
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="rounded-lg bg-slate-200 p-2">
                  <PieChart className="h-5 w-5 text-slate-700" />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900">
                    Smart Budgets
                  </h3>
                  <p className="text-sm text-slate-600">
                    Set and achieve your financial goals
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="rounded-lg bg-slate-200 p-2">
                  <Shield className="h-5 w-5 text-slate-700" />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900">
                    Secure & Private
                  </h3>
                  <p className="text-sm text-slate-600">
                    Your data is encrypted and protected
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="rounded-lg bg-slate-200 p-2">
                  <Wallet className="h-5 w-5 text-slate-700" />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900">Easy to Use</h3>
                  <p className="text-sm text-slate-600">
                    Intuitive interface for everyone
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side - Visual Card */}
          <div className="flex items-center justify-center">
            <div className="w-full max-w-md space-y-4 rounded-2xl bg-white p-8 shadow-2xl">
              <div className="space-y-2">
                <h2 className="text-2xl font-bold text-slate-900">
                  Welcome Back
                </h2>
                <p className="text-slate-600">
                  Sign in to manage your finances
                </p>
              </div>
              <div className="space-y-4 pt-4">
                <div className="space-y-2">
                  <div className="h-10 w-full rounded-lg bg-slate-100"></div>
                  <div className="h-10 w-full rounded-lg bg-slate-100"></div>
                </div>
                <Link href="/signin" className="block">
                  <Button className="w-full bg-slate-700 hover:bg-slate-800">
                    Sign In
                  </Button>
                </Link>
                <div className="text-center text-sm text-slate-600">
                  Don&apos;t have an account?{" "}
                  <Link
                    href="/signup"
                    className="font-semibold text-slate-700 hover:text-slate-900"
                  >
                    Sign up
                  </Link>
                </div>
              </div>
              <div className="border-t border-slate-200 pt-6">
                <div className="space-y-3">
                  <div className="flex items-center justify-between rounded-lg bg-green-50 p-3">
                    <span className="text-sm font-medium text-green-900">
                      Income
                    </span>
                    <span className="text-lg font-bold text-green-700">
                      $4,250
                    </span>
                  </div>
                  <div className="flex items-center justify-between rounded-lg bg-red-50 p-3">
                    <span className="text-sm font-medium text-red-900">
                      Expenses
                    </span>
                    <span className="text-lg font-bold text-red-700">
                      $2,840
                    </span>
                  </div>
                  <div className="flex items-center justify-between rounded-lg bg-slate-100 p-3">
                    <span className="text-sm font-medium text-slate-900">
                      Balance
                    </span>
                    <span className="text-lg font-bold text-slate-700">
                      $1,410
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
