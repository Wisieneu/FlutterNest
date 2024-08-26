import { createImageUrl } from "../utils";
import { Media } from "../types";
import CloseButton from "./Buttons/CloseButton";
import React from "react";

export interface FilePreviewPageModalProps {
  file: Media;
  isFullscreen: boolean;
  setIsFullscreen: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function FilePreviewPageModal(props: FilePreviewPageModalProps) {
  console.log(props);
  return (
    <div
      className="image-preview-modal fixed left-0 top-0 z-10 flex h-screen w-screen items-center justify-center bg-zinc-900 bg-opacity-95"
      onClick={() => props.setIsFullscreen(false)}
    >
      <img
        className="z-20 max-h-[90%] max-w-[90%]"
        src={createImageUrl(props.file.fileName)}
      />
      <div
        className="fixed right-3 top-3"
        onClick={() => props.setIsFullscreen(false)}
      >
        <CloseButton />
      </div>
    </div>
  );
}
