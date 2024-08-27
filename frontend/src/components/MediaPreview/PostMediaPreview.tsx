import MultipleMediaElementsPreview from "./MultipleMediaElementsPreview";
import SingleMediaElementPreview from "./SingleMediaElementPreview";
import TwoMediaElementsPreview from "./TwoMediaElementsPreview";

export default function PostMediaPreview({ data }: { data: any }) {
  let mediaPreviewElement;
  if (data.media && data.media.length > 0) {
    if (data.media.length === 1) {
      mediaPreviewElement = <SingleMediaElementPreview file={data.media[0]} />;
    } else if (data.media.length === 2) {
      mediaPreviewElement = <TwoMediaElementsPreview files={data.media} />;
    } else {
      mediaPreviewElement = <MultipleMediaElementsPreview files={data.media} />;
    }
  }

  return mediaPreviewElement;
}
