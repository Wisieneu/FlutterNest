import React, { BaseSyntheticEvent } from 'react';

export default function SignInForm({ toggleFormFn }) {
  function handleSubmit(event: BaseSyntheticEvent) {
    event.preventDefault();
  }

  return (
    <form>
      <div>
        <div>
          <div className="group relative rounded-lg border focus-within:border-sky-200 px-3 pb-1.5 pt-2.5 duration-200 focus-within:ring focus-within:ring-sky-300/30">
            <div className="flex justify-between">
              <label className="text-xs font-medium text-muted-foreground group-focus-within:text-white text-gray-400">
                Username
              </label>
              <div className="absolute right-3 translate-y-2 text-green-200">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="w-6 h-6"
                >
                  <path
                    fillRule="evenodd"
                    d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12Zm13.36-1.814a.75.75 0 1 0-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 0 0-1.06 1.06l2.25 2.25a.75.75 0 0 0 1.14-.094l3.75-5.25Z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
            </div>
            <input
              type="text"
              name="username"
              placeholder="Username"
              autoComplete="off"
              className="block w-full border-0 bg-transparent p-0 text-sm file:my-1 file:rounded-full file:border-0 file:bg-accent file:px-4 file:py-2 file:font-medium placeholder:text-muted-foreground/90 focus:outline-none focus:ring-0 sm:leading-7 text-foreground"
            />
          </div>
        </div>
      </div>
      <div className="mt-4">
        <div>
          <div className="group relative rounded-lg border focus-within:border-sky-200 px-3 pb-1.5 pt-2.5 duration-200 focus-within:ring focus-within:ring-sky-300/30">
            <div className="flex justify-between">
              <label className="text-xs font-medium text-muted-foreground group-focus-within:text-white text-gray-400">
                Password
              </label>
            </div>
            <div className="flex items-center">
              <input
                type="password"
                name="password"
                placeholder="●●●●●●●●"
                className="block w-full border-0 bg-transparent p-0 text-sm file:my-1 placeholder:text-muted-foreground/90 focus:outline-none focus:ring-0 focus:ring-teal-500 sm:leading-7 text-foreground"
              />
            </div>
          </div>
        </div>
      </div>
      <div className="mt-4 flex items-center justify-between">
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            name="remember"
            className="outline-none focus:outline focus:outline-sky-300"
          />
          <span className="text-xs">Remember me</span>
        </label>
        <a
          className="text-sm font-medium text-foreground underline"
          href="/forgot-password"
        >
          Forgot password?
        </a>
      </div>
      <div className="mt-4 flex items-center justify-end gap-x-2">
        <a
          className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:ring hover:ring-white h-10 px-4 py-2 duration-200"
          onClick={toggleFormFn}
        >
          Sign up
        </a>
        <button
          className="font-semibold hover:bg-black hover:text-white hover:ring hover:ring-white transition duration-300 inline-flex items-center justify-center rounded-md text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-white text-black h-10 px-4 py-2"
          type="submit"
          onSubmit={handleSubmit}
        >
          Log in
        </button>
      </div>
    </form>
  );
}
