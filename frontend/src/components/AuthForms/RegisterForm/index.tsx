import { BaseSyntheticEvent, FormEvent, useEffect, useState } from 'react';

import { validateEmail } from '../../../../../shared/common';

interface RegisterFormProps {
  toggleFormFn: () => void;
}

export default function RegisterForm(props: RegisterFormProps) {
  const [formState, setFormState] = useState({
    username: '',
    email: '',
    password: '',
    passwordConfirm: '',
  });

  const [isFormDataValid, setValidStatus] = useState(false);

  /**
   * Each time form input changes, checks if new data passes validation
   */
  useEffect(() => {
    if (
      formState.username.length > 0 &&
      validateEmail(formState.email) &&
      formState.password.length > 5 &&
      formState.passwordConfirm.length > 5
    ) {
      setValidStatus(true);
    } else {
      setValidStatus(false);
    }
  }, [formState]);

  /**
   * Updates state with each keystroke
   * @param event
   */
  function handleFormChange(event: BaseSyntheticEvent) {
    setFormState((prevState) => ({
      ...prevState,
      [event.target.name]: event.target.value,
    }));
  }

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    const lastSignUpTime = Number(localStorage.getItem('lastEmailTime'));
    const hoursSinceLastSignUp = (Date.now() - lastSignUpTime) / (1000 * 60 * 60);

    // sign up rate limiter
    if (lastSignUpTime && hoursSinceLastSignUp < 12) {
      return alert('Service temporary unavailable. Please try again later.');
    }

    if (!isFormDataValid) return alert('One or more fields are filled incorrectly.');

    alert('all good');
    return;
  }

  return (
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
          placeholder="How should everyone call you?"
          autoComplete="off"
          className="block w-full border-0 bg-transparent p-0 text-sm file:my-1 file:rounded-full file:border-0 file:bg-accent file:px-4 file:py-2 file:font-medium placeholder:text-muted-foreground/90 focus:outline-none focus:ring-0 sm:leading-7 text-foreground"
        />
      </div>
      <div className="mt-4">
        <div>
          <div className="group relative rounded-lg border focus-within:border-sky-200 px-3 pb-1.5 pt-2.5 duration-200 focus-within:ring focus-within:ring-sky-300/30">
            <div className="flex justify-between">
              <label className="text-xs font-medium text-muted-foreground group-focus-within:text-white text-gray-400">
                Email
              </label>
            </div>
            <div className="flex items-center">
              <input
                type="email"
                name="email"
                placeholder="example@domain.xyz"
                className="block w-full border-0 bg-transparent p-0 text-sm file:my-1 placeholder:text-muted-foreground/90 focus:outline-none focus:ring-0 focus:ring-teal-500 sm:leading-7 text-foreground"
                onChange={handleFormChange}
              />
            </div>
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
      <div className="mt-4">
        <div>
          <div className="group relative rounded-lg border focus-within:border-sky-200 px-3 pb-1.5 pt-2.5 duration-200 focus-within:ring focus-within:ring-sky-300/30">
            <div className="flex justify-between">
              <label
                htmlFor="passwordConfirm"
                className="text-xs font-medium text-muted-foreground group-focus-within:text-white text-gray-400"
              >
                Repeat password
              </label>
            </div>
            <div className="flex items-center">
              <input
                type="password"
                name="passwordConfirm"
                placeholder="●●●●●●●●"
                className="block w-full border-0 bg-transparent p-0 text-sm file:my-1 placeholder:text-muted-foreground/90 focus:outline-none focus:ring-0 focus:ring-teal-500 sm:leading-7 text-foreground"
              />
            </div>
          </div>
        </div>
      </div>
      <div className="mt-4">
        <div>
          <div className="group relative rounded-lg border focus-within:border-sky-200 px-3 pb-1.5 pt-2.5 duration-200 focus-within:ring focus-within:ring-sky-300/30">
            <div className="flex justify-between">
              <label className="text-xs font-medium text-muted-foreground group-focus-within:text-white text-gray-400">
                Date of birth
              </label>
            </div>
            <div className="flex items-center">
              <input
                type="date"
                name="birthDate"
                placeholder=""
                className="block w-full border-0 bg-transparent p-0 text-sm file:my-1 placeholder:text-muted-foreground/90 focus:outline-none focus:ring-0 focus:ring-teal-500 sm:leading-7 text-foreground"
              />
            </div>
          </div>
          <div className="flex justify-between py-2 px-1">
            <h4 className="text-xs font-medium text-muted-foreground group-focus-within:text-white text-gray-700">
              This will not be shown publicly, unless you allow it. Confirm your own age,
              even if this account is for a business, a pet, or something else.
            </h4>
          </div>
        </div>
      </div>
      <div className="mt-4 flex items-center justify-end gap-x-2 cursor-pointer">
        <a
          className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:ring hover:ring-white h-10 px-4 py-2 duration-200"
          onClick={props.toggleFormFn}
        >
          Log in
        </a>
        <button
          className="font-semibold hover:bg-black hover:text-white hover:ring hover:ring-white transition duration-300 inline-flex items-center justify-center rounded-md text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-white text-black h-10 px-4 py-2"
          onClick={handleSubmit}
        >
          Sign up
        </button>
      </div>
    </div>
  );
}
