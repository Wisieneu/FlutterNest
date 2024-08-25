import { Media } from "@/types";

export interface SingleMediaElementPreviewProps {
  file: Media;
}

export default function SingleMediaElementPreview(
  props: SingleMediaElementPreviewProps,
) {
  return (
    <div className="w-full">
      <img
        src={`https://wisie-flutternest.s3.eu-central-1.amazonaws.com/${props.file.fileName}`}
        alt="uploaded image"
      />
    </div>
  );
}
