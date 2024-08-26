import { useState } from "react";
import FilePreviewPageModal from "./FilePreviewPageModal";
import { Media } from "../types";
import { createImageUrl } from "../utils";

interface ImageComponentProps {
  media: Media;
}

export default function ImageComponent(props: ImageComponentProps) {
  const [isFullscreen, setIsFullscreen] = useState(false);
  return (
    <>
      <img
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
    </>
  );
}
