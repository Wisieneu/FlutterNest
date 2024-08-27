import { BaseSyntheticEvent, FormEvent, useRef, useState } from "react";
import { Id, Slide, toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

import { signIn } from "@/API";
import { AxiosError } from "axios";

interface SignInFormProps {
  toggleFormFn: () => void;
}

export default function SignInForm(props: SignInFormProps) {
  const navigate = useNavigate();
  const toastId = useRef<Id | null>(null);
  const [formState, setFormState] = useState({
    login: "",
    password: "",
  });

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

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    toast.dismiss(toastId.current as Id);
    toastId.current = toast.loading("Signing in...", {
      position: "top-right",
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      theme: "dark",

      transition: Slide,
    });

    // Signing in
    try {
      const response = await signIn(formState);
      toast.update(toastId.current, {
        render: "Logged in. Redirecting...",
        type: "success",
        isLoading: false,
        autoClose: 3000,
      });

      setTimeout(() => {
        toast.dismiss(toastId.current as Id);
        navigate("/");
      }, 2000);
    } catch (error) {
      const err = error as AxiosError<any>;
      toast.update(toastId.current, {
        render: (
          <div>
            <h1 className="mb-3">Authentication failed:</h1>
            <p className="text-sm">{err.response?.data?.message}</p>
          </div>
        ),
        type: "error",
        isLoading: false,
        autoClose: 5000,
      });
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="group relative rounded-lg border px-3 pb-1.5 pt-2.5 duration-200 focus-within:border-sky-200 focus-within:ring focus-within:ring-sky-300/30">
        <div className="flex justify-between">
          <label className="text-muted-foreground text-xs font-medium text-gray-400 group-focus-within:text-white">
            Username / email
          </label>
        </div>
        <input
          type="text"
          name="login"
          placeholder="Markpotato321"
          autoComplete="off"
          className="file:bg-accent placeholder:text-muted-foreground/90 text-foreground block w-full border-0 bg-transparent p-0 text-sm file:my-1 file:rounded-full file:border-0 file:px-4 file:py-2 file:font-medium focus:outline-none focus:ring-0 sm:leading-7"
          onChange={handleFormChange}
        />
      </div>
      <div className="mt-4">
        <div>
          <div className="group relative rounded-lg border px-3 pb-1.5 pt-2.5 duration-200 focus-within:border-sky-200 focus-within:ring focus-within:ring-sky-300/30">
            <div className="flex justify-between">
              <label className="text-muted-foreground text-xs font-medium text-gray-400 group-focus-within:text-white">
                Password
              </label>
            </div>
            <div className="flex items-center">
              <input
                type="password"
                name="password"
                placeholder="●●●●●●●●"
                className="placeholder:text-muted-foreground/90 text-foreground block w-full border-0 bg-transparent p-0 text-sm file:my-1 focus:outline-none focus:ring-0 focus:ring-teal-500 sm:leading-7"
                onChange={handleFormChange}
              />
            </div>
          </div>
        </div>
      </div>
      <div className="mt-4 flex items-center justify-between">
        <a
          className="text-foreground text-sm font-medium underline"
          href="/forgot-password"
        >
          Forgot password?
        </a>
      </div>
      <div className="mt-4 flex cursor-pointer items-center justify-end gap-x-2">
        <a
          className="focus-visible:ring-ring hover:bg-accent inline-flex h-10 items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition-all duration-200 hover:ring hover:ring-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
          onClick={props.toggleFormFn}
        >
          Sign up
        </a>
        <button
          className="inline-flex h-10 items-center justify-center rounded-md bg-white px-4 py-2 text-sm font-semibold text-black transition duration-300 hover:bg-black hover:text-white hover:ring hover:ring-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
          type="submit"
        >
          Log in
        </button>
      </div>
    </form>
  );
}
