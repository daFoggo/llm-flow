import { LoginForm } from "@/features/auth/components/login-form";

const SignInPage = () => {
  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <div className="w-full max-w-sm space-y-6">
        <div className="space-y-2 text-center">
          <h1 className="text-2xl font-bold">Welcome back</h1>
          <p className="text-muted-foreground">
            Enter your email to sign in to your account
          </p>
        </div>
        <LoginForm />
      </div>
    </div>
  );
};

export default SignInPage;
