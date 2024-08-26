import axios from "axios";
import { useRef } from "react";

export default function TestView() {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUpload = async () => {
    if (!fileInputRef.current?.files?.length) return;

    const formData = new FormData();
    formData.append("file", fileInputRef.current.files[0]);

    try {
      const response = await axios.post(
        "http://localhost:6699/api/v1/posts",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        },
      );
    } catch (error) {
      console.error("Upload failed:", error);
    }
  };

  return (
    <div>
      <input type="file" ref={fileInputRef} multiple />
      <input type="file" ref={fileInputRef} multiple />
      <button onClick={handleUpload}>Upload</button>
    </div>
  );
}
