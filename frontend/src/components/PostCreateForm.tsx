import { useEffect, useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import FormData from "form-data";

import { createPost } from "@/API";
import { displayToast } from "./Toast";

import SubmitBtn from "@/components/Buttons/SubmitBtn";
import UploadedImagePreview from "@/components/Upload/UploadedImagePreview";
import ProgressBarIndicator from "@/components/ProgressBarIndicator";
import MultipleFileUploadField, {
  UploadableFile,
} from "@/components/Upload/MultipleFileUploadField";

export default function PostCreateForm() {
  const [textContent, setTextContent] = useState("");
  const [isFormBeingSubmitted, setIsFormBeingSubmitted] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [colorClass, setColorClass] = useState("");
  const [uploadedImages, setUploadedImages] = useState<UploadableFile[]>([]);
  const [isFormSubmittable, setIsFormSubmittable] = useState(false);
  const [barProgress, setBarProgress] = useState(0);

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
   * Image upload logic
   * Prevents from uploading more than 6 images
   * TODO: add a max file size
   * TODO: add a file type check
   */
  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (isExpanded === false) setIsExpanded(true);
    if (uploadedImages.length >= 6) {
      displayToast("You can only upload 6 images.", "error");
      return;
    }

    const mappedAcc = acceptedFiles.map((file) => ({
      file,
      errors: [],
    }));
    setUploadedImages((prevState) => [...prevState, ...mappedAcc]);
  }, []);

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
      uploadedImages.forEach((file) => formData.append("media", file.file));
    }

    const response = await createPost(formData);
    console.log(response);
    if (response.status === 201) {
      displayToast("Post created successfully.", "success");
    } else {
      displayToast("An error occurred while creating the post.", "error");
    }
    setIsFormBeingSubmitted(false);
  }

  return (
    <div
      className={`relative w-full p-6 ${isFormBeingSubmitted ? "blur-container" : ""}`}
      {...getRootProps()} // dropzone initialization for the form container (no clicking, just hover)
    >
      <form onSubmit={handleSubmit}>
        <textarea
          name="textContent"
          id="textContent"
          className={`placeholder-shown:border-blue-gray-200 peer h-full min-h-[100px] w-full resize-none bg-transparent px-2 pb-1.5 pt-6 outline-0 focus:mb-10 ${isExpanded ? "mb-10 border-b border-gray-700" : ""}`}
          placeholder="What's on your mind?"
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
                  setUploadedImages={setUploadedImages}
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
    </div>
  );
}
