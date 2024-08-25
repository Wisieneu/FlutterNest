import { Media } from "@/types";

export interface TwoMediaElementsPreviewProps {
  files: Media[];
}

export default function TwoMediaElementsPreview(
  props: TwoMediaElementsPreviewProps,
) {
  // TODO: style separately
  return (
    <div className="uploaded-images-container overflow-hidden rounded-2xl border border-gray-700">
      <div className="grid grid-cols-2 gap-2">
        {props.files.map((image, index) => (
          <img
            src={`https://wisie-flutternest.s3.eu-central-1.amazonaws.com/${image.fileName}`}
            alt="uploaded image"
            key={index}
          />
        ))}
      </div>
    </div>
  );
}
