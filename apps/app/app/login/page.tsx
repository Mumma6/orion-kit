"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useLogin } from "@/hooks/use-auth";
import { Button } from "@workspace/ui/components/button";
import { Input } from "@workspace/ui/components/input";
import { Label } from "@workspace/ui/components/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card";
import { AlertCircle, Loader2, GalleryVerticalEnd, Play } from "lucide-react";
import { Alert, AlertDescription } from "@workspace/ui/components/alert";
import Link from "next/link";
import { useEffect } from "react";
import { ModeToggle } from "@/components/mode-toggle";

const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const loginMutation = useLogin();

  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = (data: LoginFormData) => {
    loginMutation.mutate(data);
  };

  const useDemoAccount = () => {
    form.setValue("email", "demo@orion-kit.dev");
    form.setValue("password", "demo123");
  };

  useEffect(() => {
    if (loginMutation.isError) {
      form.setError("root", {
        message: loginMutation.error?.message || "Login failed",
      });
    }
  }, [loginMutation.isError, loginMutation.error, form]);

  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      <div className="absolute top-4 right-4 z-10">
        <ModeToggle />
      </div>
      <div className="flex flex-col gap-4 p-6 md:p-10">
        <div className="flex justify-center gap-2 md:justify-start">
          <a href="/" className="flex items-center gap-2 font-medium">
            <div className="bg-primary text-primary-foreground flex size-6 items-center justify-center rounded-md">
              <GalleryVerticalEnd className="size-4" />
            </div>
            Orion Kit
          </a>
        </div>
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-sm space-y-4">
            {/* Demo Account Banner */}
            <div className="rounded-lg border bg-gradient-to-r from-blue-50 to-indigo-50 p-4 dark:from-blue-950/20 dark:to-indigo-950/20">
              <div className="flex items-start gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/30">
                  <Play className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                </div>
                <div className="flex-1">
                  <h3 className="text-sm font-medium text-blue-900 dark:text-blue-100">
                    Try the demo account
                  </h3>
                  <p className="mt-1 text-xs text-blue-700 dark:text-blue-300">
                    Experience the full dashboard with sample data
                  </p>
                  <div className="mt-2 flex items-center gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={useDemoAccount}
                      className="h-7 text-xs"
                    >
                      Use Demo Account
                    </Button>
                    <span className="text-xs text-blue-600 dark:text-blue-400">
                      demo@orion-kit.dev
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <Card>
              <CardHeader className="text-center">
                <CardTitle className="text-2xl">Welcome back</CardTitle>
                <CardDescription>
                  Enter your credentials to sign in to your account
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-4"
                >
                  {loginMutation.isError && (
                    <Alert variant="destructive">
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>
                        {form.formState.errors.root?.message || "Login failed"}
                      </AlertDescription>
                    </Alert>
                  )}

                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="Enter your email"
                      {...form.register("email")}
                    />
                    {form.formState.errors.email && (
                      <p className="text-sm text-destructive">
                        {form.formState.errors.email.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <Input
                      id="password"
                      type="password"
                      placeholder="Enter your password"
                      {...form.register("password")}
                    />
                    {form.formState.errors.password && (
                      <p className="text-sm text-destructive">
                        {form.formState.errors.password.message}
                      </p>
                    )}
                  </div>

                  <Button
                    type="submit"
                    className="w-full"
                    disabled={loginMutation.isPending}
                  >
                    {loginMutation.isPending ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Signing in...
                      </>
                    ) : (
                      "Sign In"
                    )}
                  </Button>
                </form>

                <div className="mt-6 text-center text-sm">
                  <span className="text-muted-foreground">
                    Don't have an account?{" "}
                  </span>
                  <Link href="/signup" className="text-primary hover:underline">
                    Sign up
                  </Link>
                </div>

                <div className="mt-4 text-center">
                  <Link
                    href="/"
                    className="text-sm text-muted-foreground hover:underline"
                  >
                    ← Back to home
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      <div className="relative hidden lg:block">
        <div className="absolute inset-0 flex items-center justify-center p-8">
          <img
            src="/assets/undraw_launching_szjw.svg"
            alt="Login"
            className="h-3/4 w-3/4 max-w-md object-contain"
          />
        </div>
      </div>
    </div>
  );
}
