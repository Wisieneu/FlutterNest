import { FormEvent, useState } from "react";

import CloseButton from "../Buttons/CloseButton";
import { displayToast } from "../Toast";
import { useNavigate } from "react-router-dom";

import { deactivateAccount } from "@/API";
import { FaExclamationTriangle } from "react-icons/fa";

export default function AccountDeleteModal() {
  const navigate = useNavigate();
  const [isDeleteModalVisible, setIsDeleteModalVisible] =
    useState<boolean>(false);
  const [passwordInput, setPasswordInput] = useState<string>("");

  async function handleAccountDeletion(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const res = await deactivateAccount(passwordInput);
    if (res.status === 200) {
      navigate("/");
    } else {
      displayToast(
        "An error has occurred while deleting your account.",
        "error",
      );
    }
  }

  return (
    <>
      <div className="mb-10">
        <p className="py-2 text-xl font-semibold">Delete Account</p>
        <p className="inline-flex items-center rounded-full bg-rose-200 px-4 py-1 text-rose-600">
          <FaExclamationTriangle size={16} className="mr-2 h-5 w-5" />
          Danger zone
        </p>
        <p className="mt-2">
          Make sure you have taken backup of your account in case you ever need
          to get access to your data. We will completely wipe your data.
        </p>
        <button
          className="ml-auto text-sm font-semibold text-rose-600 underline decoration-2"
          onClick={() => setIsDeleteModalVisible(true)}
        >
          Continue with deletion
        </button>
      </div>
      {isDeleteModalVisible && (
        <div className="fixed inset-0 z-10 flex h-screen w-screen items-center justify-center bg-zinc-900 bg-opacity-95">
          <div className="relative flex h-96 w-80 flex-col items-center justify-center rounded-xl border border-appPurple bg-appBgColor px-6 py-4 text-center">
            <form onSubmit={handleAccountDeletion}>
              <h1 className="text-2xl font-semibold">Are you sure?</h1>
              <p className="mt-2 text-sm text-gray-500">
                This action cannot be undone. Please type your password to
                confirm.
              </p>
              <input
                type="password"
                id="login-password"
                className="mt-4 w-full flex-shrink appearance-none border-gray-300 bg-white px-4 py-2 text-base text-gray-700 placeholder-gray-400 focus:outline-none"
                onChange={(e) => setPasswordInput(e.target.value)}
                value={passwordInput}
                placeholder="***********"
              />
              <div className="mt-4">
                <button
                  className="inline-flex text-sm font-semibold text-blue-600 underline decoration-2"
                  type="submit"
                >
                  Yes, delete my account
                </button>
              </div>
            </form>
          </div>
          <div
            className="fixed right-3 top-3"
            onClick={() => setIsDeleteModalVisible(false)}
          >
            <CloseButton />
          </div>
        </div>
      )}
    </>
  );
}
