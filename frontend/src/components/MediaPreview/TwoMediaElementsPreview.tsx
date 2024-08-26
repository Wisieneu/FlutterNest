import { Media } from "@/types";
import ImageComponent from "../ImageComponent";

export interface TwoMediaElementsPreviewProps {
  files: Media[];
}

export default function TwoMediaElementsPreview(
  props: TwoMediaElementsPreviewProps,
) {
  return (
    <div className="uploaded-images-container overflow-hidden rounded-2xl">
      <div className="grid grid-cols-2 gap-1">
        {props.files.map((image, index) => (
          <ImageComponent
            key={index}
            media={image}
            mediaIndex={index}
            heightPx={240}
          />
        ))}
      </div>
    </div>
  );
}
