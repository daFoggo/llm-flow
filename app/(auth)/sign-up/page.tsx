import { RegisterForm } from "@/features/auth";

const SignUpPage = () => {
  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <div className="w-full max-w-sm space-y-6">
        <div className="space-y-2 text-center">
          <h1 className="text-2xl font-bold">Create an account</h1>
          <p className="text-muted-foreground">
            Enter your email below to create your account
          </p>
        </div>
        <RegisterForm />
      </div>
    </div>
  );
};

export default SignUpPage;
