import { ChangeEvent, useEffect, useState, useCallback } from "react";
import { toast } from "react-toastify";
import { useDropzone } from "react-dropzone";

import SubmitBtn from "./Buttons/SubmitBtn";

import { createPost } from "@/API";

export default function PostCreateForm() {
  const [textContent, setTextContent] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [colorClass, setColorClass] = useState("");
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);

  const isFormSubmittable = textContent.length > 2 && textContent.length < 129;
  const gradientWidth = Math.min(
    Math.floor((textContent.length / 128) * 100),
    100,
  );

  useEffect(() => {
    if (textContent.length > 128) {
      setColorClass("red");
    } else if (textContent.length > 90) {
      setColorClass("yellow");
    } else {
      setColorClass("green");
    }
  }, [textContent]);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    console.log(acceptedFiles);
    const file = new FileReader();
    file.onload = () => {
      setUploadedImages((prevState) => [...prevState, file.result as string]);
    };

    file.readAsDataURL(acceptedFiles[0]);
  }, []);
  const { acceptedFiles, getRootProps, getInputProps, isDragActive } =
    useDropzone({ onDrop });

  async function handleSubmit() {
    // TODO: fix redirect
    console.log("files", uploadedImages);

    setIsLoading(true);
    const formData = new FormData();
    formData.append("textContent", textContent);
    if (uploadedImages)
      uploadedImages.forEach((image) => formData.append("media", image));
    const response = await createPost(formData);
    console.log(response);
    if (response.status === 201) {
      toast.success("Post created successfully.");
    } else {
      toast.error("An error occurred while creating the post.");
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
        <div {...getRootProps()}>
          <input {...getInputProps()} />
          {isDragActive ? (
            <p>Drop the files here ...</p>
          ) : (
            <p>Drag 'n' drop some files here, or click to select files</p>
          )}
        </div>
        {/* Display uploaded images */}
        {uploadedImages.map((image, index) => (
          <img key={index} src={image} />
        ))}
        <div className="absolute bottom-4 right-4 flex">
          {/* Visual indicator for the character limit */}
          <div
            className={`${textContent.length > 3 ? "" : "hidden"} mr-6 inline-block h-6 w-16 self-center rounded-full border text-center border-${colorClass}-600`}
          >
            <div
              className={`h-full rounded-full bg-${colorClass}-600`}
              style={{
                width: `${textContent.length > 44 ? gradientWidth : 35}%`,
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
            disabled={isFormSubmittable}
          />
        </div>
      </form>
    </div>
  );
}
