import { User } from "@/types";
import { useRef, useState } from "react";

import { CiAt, CiLocationOn } from "react-icons/ci";
import { FiLink } from "react-icons/fi";

import { HiOutlineUserGroup } from "react-icons/hi2";

import TripleDotButton from "../Buttons/TripleDotButton";
import { updateUserMetadata } from "@/API";
import {
  displayToast,
  generateLoadingToastUpdateBody,
  loadingToastBody,
} from "../Toast";
import { AxiosError } from "axios";
import { Id, Slide, toast } from "react-toastify";

export interface UserMetadataChangeFormProps {
  user: User;
}

export interface UserMetadataUpdateFormState {
  displayName?: string;
  location?: string;
  website?: string;
  bio?: string;
}

export default function UserMetadataChangeForm(
  props: UserMetadataChangeFormProps,
) {
  const { user } = props;
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const [formData, setFormData] = useState<UserMetadataUpdateFormState>({
    displayName: user.displayName,
    location: user.location ? user.location : "",
    website: user.website ? user.website : "",
    bio: user.bio ? user.bio : "",
  });
  const toastId = useRef<Id | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    toast.dismiss(toastId.current as Id);
    toastId.current = toast.loading("Updating...", loadingToastBody);
    console.log(formData);
    try {
      const response = await updateUserMetadata(formData);
      toast.update(
        toastId.current!,
        generateLoadingToastUpdateBody("User updated successfully.", "success"),
      );
    } catch (error) {
      const err = error as AxiosError<any>;
      toast.update(
        toastId.current!,
        generateLoadingToastUpdateBody(
          `An error has occurred: ${err.message}`,
          "error",
        ),
      );
    }
  }

  function handleInputChange(
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) {
    setFormData((prevState) => ({
      ...prevState,
      [event.target.name]: event.target.value,
    }));
  }

  return (
    <form onClick={() => setIsExpanded(true)} onSubmit={handleSubmit}>
      <div className="my-4 flex items-center text-sm text-gray-400">
        <div className="w-1/2 flex-col">
          <div className="py-2">
            <label>Username</label>
            {isExpanded ? (
              <div className="flex items-center">
                <CiAt size={24} />
                <input
                  id="username-input"
                  value={user.username}
                  className="ml-2 w-full cursor-not-allowed rounded-full border border-gray-500 bg-transparent px-3 py-1 text-sm text-gray-500"
                  disabled
                />
              </div>
            ) : (
              <TripleDotButton size="16" />
            )}
          </div>
          <div className="py-2">
            <label htmlFor="display-name-input">Display name</label>
            {isExpanded ? (
              <div className="flex items-center">
                <HiOutlineUserGroup size={24} />
                <input
                  id="display-name-input"
                  name="displayName"
                  onChange={handleInputChange}
                  value={formData.displayName}
                  className="ml-2 w-full rounded-full border bg-transparent px-3 py-1 text-sm"
                />
              </div>
            ) : (
              <TripleDotButton size="16" />
            )}
          </div>
          <div className="py-2">
            <label htmlFor="location-input">Location</label>
            {isExpanded ? (
              <div className="flex items-center">
                <CiLocationOn size={24} />
                <input
                  id="location-input"
                  name="location"
                  onChange={handleInputChange}
                  value={formData.location}
                  className="ml-2 w-full rounded-full border bg-transparent px-3 py-1 text-sm"
                />
              </div>
            ) : (
              <TripleDotButton size="16" />
            )}
          </div>
          <div className="py-2">
            <label htmlFor="website-input">Website</label>
            {isExpanded ? (
              <div className="flex items-center">
                <FiLink size={24} />
                <input
                  id="website-input"
                  name="website"
                  onChange={handleInputChange}
                  value={formData.website}
                  className="ml-2 w-full rounded-full border bg-transparent px-3 py-1 text-sm"
                />
              </div>
            ) : (
              <TripleDotButton size="16" />
            )}
          </div>
          <div className="py-2">
            <label htmlFor="bio-input">Bio</label>
            {isExpanded ? (
              <div className="flex items-center">
                <FiLink size={24} />
                <textarea
                  id="bio-input"
                  name="bio"
                  onChange={handleInputChange}
                  defaultValue={formData.bio}
                  className="ml-2 w-full overflow-auto rounded-2xl border bg-transparent px-3 py-1 text-sm"
                  maxLength={128}
                />
              </div>
            ) : (
              <TripleDotButton size="16" />
            )}
          </div>
        </div>
      </div>
      {isExpanded && (
        <button
          type="submit"
          className={`rounded-full border-2 border-gray-500 px-4 py-1`}
        >
          Submit
        </button>
      )}
    </form>
  );
}
