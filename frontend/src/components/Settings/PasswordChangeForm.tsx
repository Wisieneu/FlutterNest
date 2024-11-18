import { updateUserPassword } from "@/API";
import { useEffect, useRef, useState } from "react";

import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";
import {
  displayToast,
  generateLoadingToastUpdateBody,
  loadingToastBody,
} from "../Toast";
import { Id, Slide, toast } from "react-toastify";
import { AxiosError } from "axios";
import GreySettingsSubmitBtn from "../Buttons/GreySettingsSubmitBtn";
import { useTestId } from "@/utils";

export default function PasswordChangeForm() {
  const [isPasswordVisible, setIsPasswordVisible] = useState<boolean>(false);
  const [formState, setFormState] = useState({
    currentPassword: "",
    newPassword: "",
    newPasswordConfirm: "",
  });
  const [isSubmittable, setIsSubmittable] = useState<boolean>(false);
  const toastId = useRef<Id | null>(null);

  function handleInputChange(event: React.ChangeEvent<HTMLInputElement>) {
    setFormState((prevState) => ({
      ...prevState,
      [event.target.name]: event.target.value,
    }));
  }

  useEffect(() => {
    setIsSubmittable(
      formState.newPassword.length >= 8 &&
        formState.currentPassword.length >= 8 &&
        formState.newPasswordConfirm.length >= 8 &&
        formState.newPassword === formState.newPasswordConfirm,
    );
  }, [formState]);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    toast.dismiss(toastId.current as Id);
    toastId.current = toast.loading("Updating...", loadingToastBody);

    try {
      const response = await updateUserPassword(
        formState.currentPassword,
        formState.newPassword,
      );
      toast.update(
        toastId.current,
        generateLoadingToastUpdateBody("Password has been updated.", "success"),
      );
      setFormState({
        currentPassword: "",
        newPassword: "",
        newPasswordConfirm: "",
      });
    } catch (error) {
      const err = error as AxiosError<any>;
      toast.update(
        toastId.current,
        generateLoadingToastUpdateBody(err.response?.data.message, "error"),
      );
    }
  }

  return (
    <form
      data-test-id={useTestId("password-change-form")}
      onSubmit={handleSubmit}
    >
      <div className="my-4 flex items-center text-sm text-gray-400">
        <div className="w-1/2 flex-col">
          <div className="py-2">
            <label htmlFor="password-reset">Current password</label>
            <input
              type={`${isPasswordVisible ? "text" : "password"}`}
              data-test-id={useTestId("current-password-input")}
              name="currentPassword"
              className="w-full rounded-sm border bg-transparent p-1 text-base"
              value={formState.currentPassword}
              onChange={handleInputChange}
            />
          </div>
          <div className="py-2">
            <label htmlFor="password-reset">New password</label>
            <input
              type={`${isPasswordVisible ? "text" : "password"}`}
              data-test-id={useTestId("password-change-form-input")}
              name="newPassword"
              className="w-full rounded-sm border bg-transparent p-1 text-base"
              value={formState.newPassword}
              onChange={handleInputChange}
            />
          </div>
          <div className="py-2">
            <label htmlFor="password-reset">Confirm password</label>
            <input
              type={`${isPasswordVisible ? "text" : "password"}`}
              data-test-id={useTestId("password-change-form-confirm-input")}
              name="newPasswordConfirm"
              className="w-full rounded-sm border bg-transparent p-1 text-base"
              value={formState.newPasswordConfirm}
              onChange={handleInputChange}
            />
          </div>
        </div>
        {isPasswordVisible ? (
          <FaRegEye
            size={16}
            className="ml-4 mt-4 h-6 w-6 cursor-pointer text-sm font-semibold text-gray-600"
            onClick={() => setIsPasswordVisible(false)}
          />
        ) : (
          <FaRegEyeSlash
            size={18}
            className="ml-4 mt-4 h-6 w-6 cursor-pointer text-sm font-semibold text-gray-600"
            onClick={() => setIsPasswordVisible(true)}
          />
        )}
      </div>
      <GreySettingsSubmitBtn
        data-test-id={useTestId("password-change-form-submit-button")}
        isSubmittable={isSubmittable}
      />
    </form>
  );
}
