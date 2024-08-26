import { Media } from "@/types";
import ImageComponent from "../ImageComponent";

export interface MultipleMediaElementsPreviewProps {
  files: Media[];
}

export default function MultipleMediaElementsPreview(
  props: MultipleMediaElementsPreviewProps,
) {
  return (
    <div className="uploaded-images-container overflow-hidden rounded-2xl">
      <div className="grid grid-cols-3 gap-2">
        {props.files.map((image, index) => (
          <ImageComponent
            media={image}
            mediaIndex={index}
            key={index}
            heightPx={144}
          />
        ))}
      </div>
    </div>
  );
}
