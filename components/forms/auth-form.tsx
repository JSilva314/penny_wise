"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  signInSchema,
  signUpSchema,
  type SignInData,
  type SignUpData,
} from "@/lib/validations/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";

type AuthFormProps = {
  mode: "signin" | "signup";
};

export function AuthForm({ mode }: AuthFormProps) {
  const router = useRouter();
  const [error, setError] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);

  const isSignIn = mode === "signin";

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<any>({
    resolver: zodResolver(isSignIn ? signInSchema : signUpSchema),
  });

  const onSubmit = async (data: SignInData | SignUpData) => {
    setIsLoading(true);
    setError("");

    try {
      if (isSignIn) {
        // Sign in with NextAuth
        const result = await signIn("credentials", {
          email: data.email,
          password: data.password,
          redirect: false,
        });

        if (result?.error) {
          setError("Invalid email or password");
        } else {
          router.push("/dashboard");
          router.refresh();
        }
      } else {
        // Sign up - call registration API
        const signUpData = data as SignUpData;
        const response = await fetch("/api/auth/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: signUpData.name,
            email: signUpData.email,
            password: signUpData.password,
          }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          setError(errorData.error || "Failed to create account");
        } else {
          // Auto sign in after successful registration
          const result = await signIn("credentials", {
            email: signUpData.email,
            password: signUpData.password,
            redirect: false,
          });

          if (result?.error) {
            setError(
              "Account created but sign in failed. Please try signing in."
            );
          } else {
            router.push("/dashboard");
            router.refresh();
          }
        }
      }
    } catch (err) {
      setError("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{isSignIn ? "Sign In" : "Create Account"}</CardTitle>
        <CardDescription>
          {isSignIn
            ? "Enter your credentials to access your account"
            : "Fill in the details to create your account"}
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit(onSubmit)}>
        <CardContent className="space-y-4">
          {!isSignIn && (
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                type="text"
                placeholder="John Doe"
                {...register("name" as any)}
                disabled={isLoading}
              />
              {errors.name && (
                <p className="text-sm text-destructive">
                  {String(errors.name.message)}
                </p>
              )}
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="you@example.com"
              {...register("email")}
              disabled={isLoading}
            />
            {errors.email && (
              <p className="text-sm text-destructive">
                {String(errors.email.message)}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              {...register("password")}
              disabled={isLoading}
            />
            {errors.password && (
              <p className="text-sm text-destructive">
                {String(errors.password.message)}
              </p>
            )}
          </div>

          {!isSignIn && (
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="••••••••"
                {...register("confirmPassword" as any)}
                disabled={isLoading}
              />
              {errors.confirmPassword && (
                <p className="text-sm text-destructive">
                  {String(errors.confirmPassword.message)}
                </p>
              )}
            </div>
          )}

          {error && (
            <div className="rounded-md bg-destructive/10 p-3">
              <p className="text-sm text-destructive">{error}</p>
            </div>
          )}
        </CardContent>

        <CardFooter className="flex flex-col gap-4">
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Loading..." : isSignIn ? "Sign In" : "Create Account"}
          </Button>

          <p className="text-center text-sm text-muted-foreground">
            {isSignIn ? "Don't have an account?" : "Already have an account?"}{" "}
            <Link
              href={isSignIn ? "/signup" : "/signin"}
              className="font-medium text-primary hover:underline"
            >
              {isSignIn ? "Sign up" : "Sign in"}
            </Link>
          </p>
        </CardFooter>
      </form>
    </Card>
  );
}
