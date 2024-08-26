import CloseButton from "@/components/Buttons/CloseButton";
import { UploadedImagesReducerActionBody } from "@/types";

interface UploadedImagePreviewProps {
  imageFile: File;
  imageIndex: number;
  uploadedImages: File[];
  uploadedImagesDispatch: React.Dispatch<UploadedImagesReducerActionBody>;
}

export default function UploadedImagePreview(props: UploadedImagePreviewProps) {
  return (
    <div className="relative max-h-44">
      <img
        className={`upload-preview-index-${props.imageIndex} h-full w-full rounded-4xl object-cover p-2`}
        src={URL.createObjectURL(props.imageFile)}
      />
      <div
        className="absolute right-0 top-0"
        onClick={() =>
          props.uploadedImagesDispatch({
            type: "pop",
            indexToRemove: props.imageIndex,
          })
        }
      >
        <CloseButton />
      </div>
    </div>
  );
}
