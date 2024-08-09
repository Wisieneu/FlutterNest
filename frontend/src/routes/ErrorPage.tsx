import { useRouteError } from "react-router-dom";

import { FaBomb, FaBug, FaExclamationTriangle } from "react-icons/fa";
import { IconContext } from "react-icons";

export default function ErrorPage() {
  // log the error to the console insead of clumsily displaying it in the UI
  console.error(useRouteError()); // eslint-disable-line no-console

  return (
    <div className="flex h-screen items-center justify-center text-center">
      <a className="fixed left-3% top-3% text-appPurple" href="/">
        {">> "}Back to main page
      </a>
      <div className="rounded-4xl border-2 border-solid border-appPurple p-12 text-lg">
        <p className="flex flex-row justify-between px-12 pb-8">
          <IconContext.Provider
            value={{ color: "var(--app-purple)", size: "42" }}
          >
            <FaBomb />
            <FaExclamationTriangle />
            <FaBug />
          </IconContext.Provider>
        </p>
        <p className="error-header">Something went wrong</p>
        <p className="error-header">Check the browser console for details</p>
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
  );
}
