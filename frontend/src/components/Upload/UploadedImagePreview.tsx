import RemoveButton from "@/components/Buttons/CloseButton";
import { UploadableFile } from "./MultipleFileUploadField";

interface UploadedImagePreviewProps {
  imageFile: UploadableFile;
  imageIndex: number;
  uploadedImages: UploadableFile[];
  setUploadedImages: React.Dispatch<React.SetStateAction<UploadableFile[]>>;
}

export default function UploadedImagePreview(props: UploadedImagePreviewProps) {
  return (
    <div className="relative">
      <img
        className={`upload-preview-index-${props.imageIndex} rounded-4xl p-2`}
        src={URL.createObjectURL(props.imageFile.file)}
      />
      <div
        className="absolute right-0 top-0"
        onClick={() =>
          props.setUploadedImages(
            props.uploadedImages.filter((_, i) => i !== props.imageIndex),
          )
        }
      >
        <RemoveButton />
      </div>
    </div>
  );
}
