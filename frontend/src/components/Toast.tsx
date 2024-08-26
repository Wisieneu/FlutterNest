import { Slide, toast, ToastOptions, ToastPosition } from "react-toastify";

export function displayToast(
  message: string,
  type?: "success" | "error",
  displayDuration: number = 3000,
  overrideConfig: ToastOptions<unknown> = {},
) {
  const toastSettings = {
    position: "top-right" as ToastPosition,
    autoClose: displayDuration,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    theme: "dark",
    transition: Slide,
    ...overrideConfig,
  };

  if (type === "success") {
    return toast.success(message, toastSettings);
  } else if (type === "error") {
    return toast.error(message, toastSettings);
  } else {
    return toast(message, toastSettings);
  }
}
