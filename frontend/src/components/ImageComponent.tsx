import { useState } from "react";
import FilePreviewPageModal from "./FilePreviewPageModal";
import { Media } from "../types";
import { createImageUrl } from "../utils";

interface ImageComponentProps {
  media: Media;
  mediaIndex: number;
  heightPx?: number;
}

export default function ImageComponent(props: ImageComponentProps) {
  const [isFullscreen, setIsFullscreen] = useState(false);

  return (
    <div style={{ maxHeight: `${props.heightPx}px` }}>
      <img
        className={`h-full w-full cursor-pointer object-cover media-preview-index-${props.mediaIndex}`}
        src={createImageUrl(props.media.fileName)}
        onClick={() => setIsFullscreen(true)}
      />
      {isFullscreen && (
        <FilePreviewPageModal
          file={props.media}
          isFullscreen={isFullscreen}
          setIsFullscreen={setIsFullscreen}
        />
      )}
    </div>
  );
}
