import { AuthForm } from "@/components/forms/auth-form";

export default function SignUpPage() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="w-full max-w-md space-y-6 px-4">
        <div className="text-center">
          <h1 className="text-3xl font-bold">Create an account</h1>
          <p className="mt-2 text-muted-foreground">
            Enter your details to get started
          </p>
        </div>
        <AuthForm mode="signup" />
      </div>
    </div>
  );
}
