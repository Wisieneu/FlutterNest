import { useRef, useState } from "react";
import FormData from "form-data";

import { FiUpload } from "react-icons/fi";

import TripleDotButton from "@/components/Buttons/TripleDotButton";
import SingleFileUploadField from "@/components/Upload/SingleFileUploadField";
import {
  displayToast,
  generateLoadingToastUpdateBody,
  loadingToastBody,
} from "@/components/Toast";
import GreySettingsSubmitBtn from "@/components/Buttons/GreySettingsSubmitBtn";

import { createImageUrl, useEffectSkipFirst, useTestId } from "@/utils";

import { User } from "@/types";
import { Id, toast } from "react-toastify";
import { updateUserProfilePicture } from "@/API";
import { AxiosError } from "axios";

export default function ProfilePictureChangeForm({ user }: { user: User }) {
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const [uploadedImage, setUploadedImage] = useState<File>();
  const [profilePictureUrl, setProfilePictureUrl] = useState<string>(
    createImageUrl(user.profilePicture),
  );
  const [isFormBeingSubmitted, setIsFormBeingSubmitted] =
    useState<boolean>(false);
  const toastId = useRef<Id | null>(null);

  useEffectSkipFirst(() => {
    if (uploadedImage && uploadedImage.size <= 1024 * 1024 * 2) {
      setProfilePictureUrl(URL.createObjectURL(uploadedImage));
    } else if (profilePictureUrl !== createImageUrl(user.profilePicture)) {
      displayToast(
        "Could not upload the file. Image size must be less than 2MB.",
        "error",
      );
    }
  }, [uploadedImage]);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsFormBeingSubmitted(true);
    toast.dismiss(toastId.current as Id);
    toastId.current = toast.loading(`Processing...`, loadingToastBody);
    const formData = new FormData();
    if (uploadedImage) formData.append("file", uploadedImage);

    try {
      await updateUserProfilePicture(formData);
      toast.update(
        toastId.current,
        generateLoadingToastUpdateBody(
          "Profile picture has been updated.",
          "success",
        ),
      );
    } catch (error) {
      const err = error as AxiosError<any>;
      toast.update(
        toastId.current,
        generateLoadingToastUpdateBody(
          `An error has occurred: ${err.message}`,
          "error",
        ),
      );
    } finally {
      setIsFormBeingSubmitted(false);
    }
  }

  return (
    <form
      data-test-id={useTestId("profile-picture-change-form")}
      onClick={() => setIsExpanded(true)}
      onSubmit={handleSubmit}
    >
      <div className={`${isFormBeingSubmitted ? "blur-container" : ""}`}>
        {isExpanded ? (
          <>
            <div className="flex items-end justify-between py-4">
              <div>
                <img
                  className="h-32 w-32 rounded-full object-cover"
                  src={profilePictureUrl}
                />
                <p className="py-3 text-end text-sm text-gray-500">
                  128x128 px
                </p>
              </div>
              <div>
                <img
                  className="h-12 w-12 rounded-full object-cover"
                  src={profilePictureUrl}
                />
                <p className="py-3 text-end text-sm text-gray-500">48x48 px</p>
              </div>
              <div>
                <img
                  className="h-8 w-8 rounded-full object-cover"
                  src={profilePictureUrl}
                />
                <p className="py-3 text-end text-sm text-gray-500">32x32 px</p>
              </div>
              <div className="mb-auto mt-auto h-full">
                <div
                  className="cursor-pointer rounded-full border border-gray-500 p-3 text-sm hover:bg-gray-800"
                  data-test-id={useTestId("profile-picture-upload-button")}
                >
                  <SingleFileUploadField
                    setFile={setUploadedImage}
                    icon={FiUpload}
                  />
                </div>
              </div>
            </div>
            <GreySettingsSubmitBtn
              isSubmittable={Boolean(uploadedImage)}
              data-test-id={useTestId("profile-picture-form-submit-button")}
            />
          </>
        ) : (
          <TripleDotButton size="16" />
        )}
      </div>
    </form>
  );
}
