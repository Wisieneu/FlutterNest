import { Media } from "@/types";
import ImageComponent from "../ImageComponent";

export interface SingleMediaElementPreviewProps {
  file: Media;
}

export default function SingleMediaElementPreview(
  props: SingleMediaElementPreviewProps,
) {
  return (
    <div className="overflow-hidden rounded-2xl">
      <ImageComponent media={props.file} />
    </div>
  );
}
