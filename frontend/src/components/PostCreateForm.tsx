import { ChangeEvent, useEffect, useState, useCallback } from "react";
import { Slide, toast } from "react-toastify";
import { useDropzone } from "react-dropzone";

import { FaFileImage } from "react-icons/fa";

import SubmitBtn from "@/components/Buttons/SubmitBtn";

import { createPost } from "@/API";
import { displayToast } from "./Toast";
import MultipleFileUploadField from "./Upload/MultipleFileUploadField";

export default function PostCreateForm() {
  const [textContent, setTextContent] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [colorClass, setColorClass] = useState("");
  const [uploadedImages, setUploadedImages] = useState<
    (string | ArrayBuffer | null)[]
  >([]);

  const isFormSubmittable = textContent.length > 2 && textContent.length < 129;
  const gradientWidth = Math.min(
    Math.floor((textContent.length / 128) * 100),
    100,
  );

  useEffect(() => {
    if (textContent.length > 128) {
      setColorClass("#dc2626");
    } else if (textContent.length > 90) {
      setColorClass("#ca8a04");
    } else {
      setColorClass("#16a34a");
    }
  }, [textContent]);

  function handleImageUpload(event: React.ChangeEvent<HTMLInputElement>) {
    console.log(event.target.files);
    const target = event.target as HTMLInputElement & { files: FileList };
    console.log(target.files);
    const file = new FileReader();
    file.onload = () => {
      setUploadedImages((prevState) => [...prevState, file.result]);
    };
    file.readAsDataURL(target.files[0]);
  }

  async function handleSubmit() {
    // TODO: fix redirect
    setIsLoading(true);
    const formData = new FormData();
    console.log(
      (document.getElementById("file-upload")! as HTMLInputElement).files,
    );
    formData.append("textContent", textContent);
    if (uploadedImages)
      uploadedImages.forEach((image, index) =>
        formData.append(`files`, image as string),
      );
    console.log(formData.getAll("files"));

    const response = await createPost(formData);
    console.log(response);
    if (response.status === 201) {
      displayToast("Post created successfully.", "success");
    } else {
      displayToast("An error occurred while creating the post.", "error");
    }
    setIsLoading(false);
  }

  // TODO: add image upload
  return (
    <div className={`relative w-full p-6 ${isLoading ? "blur-container" : ""}`}>
      <form onSubmit={handleSubmit}>
        <textarea
          name="textContent"
          id="textContent"
          className={`placeholder-shown:border-blue-gray-200 peer h-full min-h-[100px] w-full resize-none bg-transparent pb-1.5 pt-4 outline-0 focus:mb-10 ${isExpanded ? "mb-10 border-b border-gray-700" : ""}`}
          placeholder="What's on your mind?"
          value={textContent}
          onClick={() => {
            if (!isExpanded) setIsExpanded(true);
          }}
          onChange={(event) => setTextContent(event.target.value)}
        />
        <div>
          {/* <input
            onChange={handleImageUpload}
            type="file"
            name="files"
            id="file-upload"
            multiple
          /> */}
          <MultipleFileUploadField />
        </div>
        {/* Display uploaded images */}
        {uploadedImages.map((image, index) => (
          <img key={index} src={image as string} />
        ))}
        <div className="absolute bottom-4 right-4 flex">
          {/* Visual indicator for the character limit */}
          <div
            className={`${textContent.length > 3 ? "" : "hidden"} mr-6 inline-block h-6 w-16 self-center rounded-full border text-center`}
            style={{ borderColor: colorClass }} // for some reason, it does not work with tailwind classes
          >
            <div
              className={`h-full rounded-full bg-${colorClass}-600`}
              style={{
                width: `${textContent.length > 44 ? gradientWidth : 35}%`,
                backgroundColor: colorClass, // for some reason, it does not work with tailwind classes
              }}
            />
            <span className="text-sm">
              {textContent.length > 64 ? 128 - textContent.length : ""}{" "}
            </span>
          </div>
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
