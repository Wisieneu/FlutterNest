import { useEffect, useState, useCallback, useReducer } from "react";
import { useDropzone } from "react-dropzone";
import FormData from "form-data";

import { createComment, createPost } from "@/API";
import { displayToast } from "./Toast";
// import { debounce } from "@/../../shared";

import SubmitBtn from "@/components/Buttons/SubmitBtn";
import UploadedImagePreview from "@/components/Upload/UploadedImagePreview";
import ProgressBarIndicator from "@/components/ProgressBarIndicator";
import MultipleFileUploadField from "@/components/Upload/MultipleFileUploadField";
import { UploadedImagesReducerActionBody, PostType } from "@/types";
import { IoMdCloudUpload } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import { AxiosResponse } from "axios";

export interface PostCreateFormProps {
  postType: PostType;
  parentPostId?: string;
  textareaPlaceholder?: string;
}

export default function PostCreateForm(props: PostCreateFormProps) {
  const navigate = useNavigate();

  function uploadedImagesReducer(
    state: File[],
    action: UploadedImagesReducerActionBody,
  ): File[] {
    switch (action.type) {
      case "append":
        return [...state, ...action.filesToAppend!];
      case "pop":
        return state.filter((_, i) => i !== action.indexToRemove!);
      default:
        return state;
    }
  }
  const [uploadedImages, uploadedImagesDispatch] = useReducer(
    uploadedImagesReducer,
    [],
  );

  // States
  const [textContent, setTextContent] = useState("");
  const [isFormBeingSubmitted, setIsFormBeingSubmitted] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [colorClass, setColorClass] = useState("");
  const [isFormSubmittable, setIsFormSubmittable] = useState(false);
  const [barProgress, setBarProgress] = useState(0);
  const [isDraggingOverForm, setIsDraggingOverForm] = useState(false);

  // On each keystroke
  useEffect(() => {
    // Update the progress bar's color
    if (textContent.length > 128 || textContent.length < 2) {
      setColorClass("#851919");
    } else if (textContent.length > 90) {
      setColorClass("#ca8a04");
    } else {
      setColorClass("#16a34a");
    }

    // Update the submit button's disabled state
    if (textContent.length >= 2 && textContent.length < 128) {
      setIsFormSubmittable(true);
    } else {
      setIsFormSubmittable(false);
    }

    // Update the progress bar's width - how much % of the max length has been typed
    setBarProgress(Math.min(Math.floor((textContent.length / 128) * 100), 100));
  }, [textContent]);

  /**
   * Function to handle the hovering over the form container with a file (to show the dropzone)
   * Debounced state update because onDragExit does not work well
   * This is a workaround, a more elegant and consistent solution to onDragExit
   */
  function handleFileHover() {
    setIsDraggingOverForm(true);
    let timer;
    clearTimeout(timer);
    timer = setTimeout(() => {
      setIsDraggingOverForm(false);
    }, 3000);
  }

  /**
   * Image upload logic
   * Prevents from uploading more than 6 images
   * TODO: add a max file size
   * TODO: add a file type check
   */
  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (isExpanded === false) setIsExpanded(true);
      if (uploadedImages.length >= 6) {
        displayToast("You can only upload up to 6 images.", "error");
        return;
      }

      uploadedImagesDispatch({ type: "append", filesToAppend: acceptedFiles });
    },
    [uploadedImages],
  );

  // A dropzone for hovering with a file over the form container
  const { getRootProps } = useDropzone({
    accept: { "image/*": [] },
    onDrop,
    noClick: true,
  });

  async function handleSubmit() {
    // TODO: fix redirect
    setIsFormBeingSubmitted(true);
    const formData = new FormData();
    formData.append("textContent", textContent);

    if (uploadedImages) {
      uploadedImages.forEach((file) => formData.append("media", file));
    }

    let response: AxiosResponse<any, any>;
    switch (props.postType) {
      case "post":
        response = await createPost(formData);
        break;
      case "comment":
        response = await createComment(props.parentPostId!, formData);
    }

    if (response!.status === 201) {
      displayToast("Post created successfully.", "success");
      navigate(`/post/${response!.data.data.newPost.id}`);
    } else {
      displayToast(
        `An error occurred while creating the ${props.postType}.`,
        "error",
      );
    }
    setIsFormBeingSubmitted(false);
  }

  return (
    <div
      className={`relative w-full p-6 ${isFormBeingSubmitted ? "blur-container" : ""}`}
      {...getRootProps()} // dropzone initialization for the form container (no clicking, just hover)
      onDragEnter={() => handleFileHover()} // dragging over the form container with a file, show the dropzone
    >
      <form onSubmit={handleSubmit}>
        <textarea
          name="textContent"
          id="textContent"
          className={`placeholder-shown:border-blue-gray-200 peer h-full min-h-[100px] w-full resize-none bg-transparent px-2 pb-1.5 pt-6 outline-0 focus:mb-10 ${isExpanded ? "mb-10 border-b border-gray-700" : ""}`}
          placeholder={props.textareaPlaceholder || ""}
          value={textContent}
          onClick={() => {
            if (!isExpanded) setIsExpanded(true);
          }}
          onChange={(event) => setTextContent(event.target.value)}
        />
        {/* Display uploaded images, if there are any */}
        {uploadedImages.length > 0 && (
          <div className="uploaded-images-container">
            <div className="grid grid-cols-3">
              {uploadedImages.map((image, index) => (
                <UploadedImagePreview
                  key={index}
                  imageIndex={index}
                  imageFile={image}
                  uploadedImages={uploadedImages}
                  uploadedImagesDispatch={uploadedImagesDispatch}
                />
              ))}
            </div>
            <div className="uploaded-images-counter p-4 text-xs">{`${uploadedImages.length} out of 6`}</div>
          </div>
        )}
        <div className="flex items-center justify-end">
          {/* Visual indicator for the character limit */}
          <div className="mr-auto text-xs">
            <MultipleFileUploadField files={uploadedImages} onDrop={onDrop} />
          </div>

          <ProgressBarIndicator
            textContent={textContent}
            isVisible={isExpanded}
            colorClass={colorClass}
            progress={barProgress}
          />

          <SubmitBtn
            type="button"
            text="Post"
            onClickHandler={() => handleSubmit()}
            disabled={!isFormSubmittable}
          />
        </div>
      </form>
      {/* Element which shows when the form is being dragged over */}
      <div
        className={`pointer-events-none absolute left-0 top-0 flex h-full w-full items-center justify-center bg-black bg-opacity-80 ${isDraggingOverForm ? "" : "invisible"}`}
      >
        <IoMdCloudUpload color="#af68df" size={100} />
      </div>
    </div>
  );
}
