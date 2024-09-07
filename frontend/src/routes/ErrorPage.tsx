import { useRouteError } from "react-router-dom";

import { FaBomb, FaBug, FaExclamationTriangle } from "react-icons/fa";
import { IconContext } from "react-icons";

export default function ErrorPage() {
  // log the error to the console insead of clumsily displaying it in the UI
  console.error(useRouteError()); // eslint-disable-line no-console

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-black pt-16 text-white sm:justify-center sm:pt-0">
      <a className="fixed left-3% top-3% text-appPurple" href="/">
        {">> "}Back to main page
      </a>
      <div className="relative mt-12 w-full max-w-lg sm:mt-10">
        <div className="mx-5 rounded-lg border border-white/20 border-b-white/20 border-l-white/20 border-r-white/20 shadow-[20px_0_20px_20px] shadow-slate-500/10 sm:border-t-white/20 sm:shadow-sm lg:rounded-xl lg:shadow-none dark:border-b-white/50 dark:border-t-white/50 dark:shadow-white/20">
          <div className="flex flex-col p-6 text-center">
            <p className="flex flex-row justify-between px-12 pb-8">
              <IconContext.Provider
                value={{ color: "var(--app-purple)", size: "30" }}
              >
                <FaBomb />
                <FaExclamationTriangle />
                <FaBug />
              </IconContext.Provider>
            </p>
            <p className="error-header">Something went wrong</p>
            <p className="error-header">
              Check the browser console for details
            </p>
            <p>
              If you believe this issue should be addressed,{" "}
              <a
                href="https://github.com/Wisieneu/FlutterNest/issues"
                className="repo-link"
                target="_blank"
              >
                submit a ticket
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
