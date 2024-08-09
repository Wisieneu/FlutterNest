import { AxiosError } from "axios";
import { BaseSyntheticEvent, FormEvent, useState } from "react";
import { redirect } from "react-router-dom";
import { Slide, toast } from "react-toastify";

import { signUp } from "@/API";

interface RegisterFormProps {
  toggleFormFn: () => void;
}

export default function RegisterForm(props: RegisterFormProps) {
  const [formState, setFormState] = useState({
    username: "",
    email: "",
    password: "",
    passwordConfirm: "",
    birthDate: "",
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

    const lastSignUpTime = Number(localStorage.getItem("lastEmailTime"));
    const hoursSinceLastSignUp =
      (Date.now() - lastSignUpTime) / (1000 * 60 * 60);

    // sign up rate limiter
    if (lastSignUpTime && hoursSinceLastSignUp < 6) {
      return alert("Service temporary unavailable. Please try again later.");
    }

    // Signing up
    const id = toast.loading("Signing up...", {
      position: "top-right",
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      theme: "dark",
      transition: Slide,
    });

    try {
      const response = await signUp(formState);
      toast.update(id, {
        render: "All is good",
        type: "success",
        isLoading: false,
        autoClose: 5000,
      });

      redirect("/");
    } catch (error) {
      // Creating the error toast, depending on the returned error format from the API
      const err = error as AxiosError;
      const errorMessage = err.response!.data as { message: string };
      const errors = errorMessage.message;
      const errorsArray = errors.includes(",")
        ? errors.split(": ")[1].split(", ")
        : Array(errors);

      toast.update(id, {
        render: (
          <div>
            <h1>Registration failed:</h1>
            <ul className="ml-4 list-disc text-sm">
              {errorsArray.map((error, index) => (
                <li key={index}>{error}</li>
              ))}
            </ul>
          </div>
        ),
        type: "error",
        isLoading: false,
        autoClose: 10000,
      });
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="group relative rounded-lg border px-3 pb-1.5 pt-2.5 duration-200 focus-within:border-sky-200 focus-within:ring focus-within:ring-sky-300/30">
        <div className="flex justify-between">
          <label
            htmlFor="username"
            className="text-muted-foreground text-xs font-medium text-gray-400 group-focus-within:text-white"
          >
            Username
          </label>
        </div>
        <input
          type="text"
          id="username"
          name="username"
          placeholder="How should everyone call you?"
          autoComplete="off"
          onChange={handleFormChange}
          className="file:bg-accent placeholder:text-muted-foreground/90 text-foreground block w-full border-0 bg-transparent p-0 text-sm file:my-1 file:rounded-full file:border-0 file:px-4 file:py-2 file:font-medium focus:outline-none focus:ring-0 sm:leading-7"
        />
      </div>

      <div className="group relative mt-4 rounded-lg border px-3 pb-1.5 pt-2.5 duration-200 focus-within:border-sky-200 focus-within:ring focus-within:ring-sky-300/30">
        <div className="flex justify-between">
          <label
            htmlFor="email"
            className="text-muted-foreground text-xs font-medium text-gray-400 group-focus-within:text-white"
          >
            Email
          </label>
        </div>
        <div className="flex items-center">
          <input
            type="email"
            id="email"
            name="email"
            placeholder="example@domain.xyz"
            autoComplete="email"
            onChange={handleFormChange}
            className="placeholder:text-muted-foreground/90 text-foreground block w-full border-0 bg-transparent p-0 text-sm file:my-1 focus:outline-none focus:ring-0 focus:ring-teal-500 sm:leading-7"
          />
        </div>
      </div>

      <div className="group relative mt-4 rounded-lg border px-3 pb-1.5 pt-2.5 duration-200 focus-within:border-sky-200 focus-within:ring focus-within:ring-sky-300/30">
        <div className="flex justify-between">
          <label
            htmlFor="password"
            className="text-muted-foreground text-xs font-medium text-gray-400 group-focus-within:text-white"
          >
            Password
          </label>
        </div>
        <div className="flex items-center">
          <input
            id="password"
            type="password"
            name="password"
            placeholder="●●●●●●●●"
            onChange={handleFormChange}
            className="placeholder:text-muted-foreground/90 text-foreground block w-full border-0 bg-transparent p-0 text-sm file:my-1 focus:outline-none focus:ring-0 focus:ring-teal-500 sm:leading-7"
          />
        </div>
      </div>

      <div className="mt-4">
        <div className="group relative rounded-lg border px-3 pb-1.5 pt-2.5 duration-200 focus-within:border-sky-200 focus-within:ring focus-within:ring-sky-300/30">
          <div className="flex justify-between">
            <label
              htmlFor="passwordConfirm"
              className="text-muted-foreground text-xs font-medium text-gray-400 group-focus-within:text-white"
            >
              Repeat password
            </label>
          </div>
          <div className="flex items-center">
            <input
              type="password"
              id="passwordConfirm"
              name="passwordConfirm"
              placeholder="●●●●●●●●"
              onChange={handleFormChange}
              className="placeholder:text-muted-foreground/90 text-foreground block w-full border-0 bg-transparent p-0 text-sm file:my-1 focus:outline-none focus:ring-0 focus:ring-teal-500 sm:leading-7"
            />
          </div>
        </div>
      </div>
      <div className="mt-4">
        <div className="group relative rounded-lg border px-3 pb-1.5 pt-2.5 duration-200 focus-within:border-sky-200 focus-within:ring focus-within:ring-sky-300/30">
          <div className="flex justify-between">
            <label
              htmlFor="birthDate"
              className="text-muted-foreground text-xs font-medium text-gray-400 group-focus-within:text-white"
            >
              Date of birth
            </label>
          </div>
          <div className="flex items-center">
            <input
              type="date"
              id="birthDate"
              name="birthDate"
              onChange={handleFormChange}
              className="placeholder:text-muted-foreground/90 text-foreground block w-full border-0 bg-transparent p-0 text-sm file:my-1 focus:outline-none focus:ring-0 focus:ring-teal-500 sm:leading-7"
            />
          </div>
        </div>
        <div className="flex justify-between px-1 py-2">
          <h4 className="text-muted-foreground text-xs font-medium text-gray-700 group-focus-within:text-white">
            This will not be shown publicly, unless you allow it. Confirm your
            own age, even if this account is for a business, a pet, or something
            else.
          </h4>
        </div>
      </div>
      <div className="mt-4 flex cursor-pointer items-center justify-end gap-x-2">
        <a
          className="focus-visible:ring-ring hover:bg-accent inline-flex h-10 items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition-all duration-200 hover:ring hover:ring-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
          onClick={props.toggleFormFn}
        >
          Log in
        </a>
        <button
          className="inline-flex h-10 items-center justify-center rounded-md bg-white px-4 py-2 text-sm font-semibold text-black transition duration-300 hover:bg-black hover:text-white hover:ring hover:ring-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
          type="submit"
        >
          Sign up
        </button>
      </div>
    </form>
  );
}
