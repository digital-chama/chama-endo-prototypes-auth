"use client";

import Image from "next/image";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/GlobalAuthStateManager";
import { AuthContent } from "@/components/authentication/auth-ui-container";
import { AlertProvider } from "@/contexts/GlobalAlertManager";
import { ChamaLogo } from "@/assets/icons/Icons";

export default function AuthenticationPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && user) {
      router.replace("/");
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="animate-pulse">Loading...</div>
      </div>
    );
  }

  if (user) {
    return null;
  }

  return (
    <AlertProvider>
      <div className="relative min-h-screen w-full flex-col items-center justify-center flex md:grid lg:max-w-none lg:grid-cols-2 lg:px-0 md:grid-cols-1">
        <div className="relative hidden h-full w-full flex-col bg-muted p-10 text-white dark:border-r lg:flex">
          <div className="absolute inset-0 bg-zinc-900" />
          <div className="relative z-20 flex items-center text-lg font-medium">
            <Image src={ChamaLogo} alt="Company Logo" className="-mr-1 h-12 w-12" />
            <span>
              cloud<span className="truncate font-semibold">magic</span>
            </span>
          </div>
          <div className="relative z-20 mt-auto">
            <blockquote className="space-y-2">
              <p className="text-lg">
                &ldquo;Creating secure infrastructure to run my containers would
                sometimes take me days. Now it&apos;s just minutes and a few
                clicks. Amazing!!!&rdquo;
              </p>
              <footer className="text-sm">Sofia Davis</footer>
            </blockquote>
          </div>
        </div>
        <div className="col-span-1  flex items-center justify-center w-full lg:p-8">
          <AuthContent />
        </div>
      </div>
    </AlertProvider>
  );
}
