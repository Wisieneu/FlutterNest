export default function NotFoundPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-black pt-16 text-white sm:justify-center sm:pt-0">
      <a className="fixed left-3% top-3% text-appPurple" href="/">
        {">> "}Back to main page
      </a>
      <div className="relative mt-12 w-full max-w-lg sm:mt-10">
        <div className="mx-5 rounded-lg border border-white/20 border-b-white/20 border-l-white/20 border-r-white/20 shadow-[20px_0_20px_20px] shadow-slate-500/10 sm:border-t-white/20 sm:shadow-sm lg:rounded-xl lg:shadow-none dark:border-b-white/50 dark:border-t-white/50 dark:shadow-white/20">
          <div className="flex flex-col p-6">
            <h3 className="text-xl font-semibold leading-6 tracking-tighter">
              404 - Page not found
            </h3>
            <p className="mt-1.5 text-sm font-medium text-white/50">
              The page you are looking for does not exist.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
