import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import UserMetadataChangeForm from "@/components/Settings/UserMetadataChangeForm";
import ProfilePictureChangeForm from "@/components/Settings/ProfilePictureChangeForm";
import PasswordChangeForm from "@/components/Settings/PasswordChangeForm";
import EmailChangeForm from "@/components/Settings/EmailChangeForm";
import AccountDeleteModal from "@/components/Settings/AccountDeleteModal";

import { fetchUserSettingsData } from "@/API";
import { convertDateRelative, useTestId } from "@/utils";

import { SettingsUser } from "@/types";

export default function Settings() {
  const navigate = useNavigate();
  const [formsDisplayState, setFormsDisplayState] = useState({
    displayName: false,
    profilePicture: false,
    password: false,
    email: false,
  });
  const [user, setUser] = useState<SettingsUser>();

  useEffect(() => {
    async function fetchSettingsData() {
      try {
        const fetchedUser = await fetchUserSettingsData();
        setUser(fetchedUser);
      } catch {
        navigate("/auth/signin");
      }
    }

    fetchSettingsData();
  }, []);

  return (
    user && (
      <div className="w-full p-8">
        {/* User metadata change form */}
        <p className="py-2 text-xl font-semibold">User metadata</p>
        <UserMetadataChangeForm user={user} />
        <div className="mx-auto my-6 border-t border-gray-700" />

        {/* User profile picture change form */}
        <p className="py-2 text-xl font-semibold">Profile picture</p>
        <ProfilePictureChangeForm user={user} />
        <div className="mx-auto my-6 border-t border-gray-700" />
        <div>
          <p className="py-2 text-xl font-semibold">Password</p>
          <div className="flex w-full flex-col text-gray-600 sm:flex-row sm:items-center sm:justify-between">
            {user.lastPasswordChangeDate ? (
              <p>
                Your password was last changed{" "}
                <strong>
                  {convertDateRelative(user.lastPasswordChangeDate)}
                </strong>
                .
              </p>
            ) : (
              "Your password has never been changed before."
            )}
            <button
              className="inline-flex text-sm font-semibold text-blue-600 underline decoration-2"
              data-test-id={useTestId("pw-change-form__open-btn")}
              onClick={() =>
                setFormsDisplayState({
                  ...formsDisplayState,
                  password: !formsDisplayState.password,
                })
              }
            >
              Change
            </button>
          </div>
          {formsDisplayState.password && (
            <div className="email-change-form-container pt-4">
              <PasswordChangeForm />
            </div>
          )}
        </div>
        <div className="mx-auto my-6 border-t border-gray-700" />

        <p className="py-2 text-xl font-semibold">Email Address</p>
        {/* User email change form TODO: after mailer */}
        <div className="flex w-full flex-col sm:flex-row sm:items-center sm:justify-between">
          <p className="text-gray-600">
            Your email address is <strong>{user.email}</strong>
          </p>
          <button
            className="inline-flex text-sm font-semibold text-blue-600 underline decoration-2"
            onClick={() =>
              setFormsDisplayState({
                ...formsDisplayState,
                email: !formsDisplayState.email,
              })
            }
          >
            Change
          </button>
        </div>
        {formsDisplayState.email && (
          <div className="email-change-form-container pt-4">
            <EmailChangeForm />
          </div>
        )}
        <div className="mx-auto my-6 border-t border-gray-700" />
        <div className="my-6 sm:pr-28">
          <AccountDeleteModal />
        </div>
      </div>
    )
  );
}
