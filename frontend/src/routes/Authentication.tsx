import { useState } from "react";

import RegisterForm from "@/components/Auth/forms/RegisterForm";
import SignInForm from "@/components/Auth/forms/SignInForm";
import Logo from "@/components/SiteLogo";

export default function AuthenticationPage() {
  const [isLogin, setIsLogin] = useState<boolean>(
    location.pathname === "/auth/signin",
  );

  const switchToLogin = () => setIsLogin(true);
  const switchToRegister = () => setIsLogin(false);

  return (
    <>
      <div className="flex min-h-screen flex-col items-center bg-black pt-16 text-white sm:justify-center sm:pt-0">
        <Logo />
        <div className="relative mt-12 w-full max-w-lg sm:mt-10">
          <div className="relative -mb-px h-px w-full bg-gradient-to-r from-transparent via-sky-300 to-transparent"></div>
          <div className="mx-5 rounded-lg border border-white/20 border-b-white/20 border-l-white/20 border-r-white/20 shadow-[20px_0_20px_20px] shadow-slate-500/10 sm:border-t-white/20 sm:shadow-sm lg:rounded-xl lg:shadow-none dark:border-b-white/50 dark:border-t-white/50 dark:shadow-white/20">
            <div className="flex flex-col p-6">
              <h3 className="text-xl font-semibold leading-6 tracking-tighter">
                {isLogin ? "Login" : "Sign up"}
              </h3>
              <p className="mt-1.5 text-sm font-medium text-white/50">
                {isLogin
                  ? "Welcome back, enter your credentials to continue."
                  : "Glad to see you want to join the family! Tell us about yourself."}
              </p>
            </div>
            <div className="p-6 pt-0">
              {isLogin ? (
                <SignInForm toggleFormFn={switchToRegister} />
              ) : (
                <RegisterForm toggleFormFn={switchToLogin} />
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
