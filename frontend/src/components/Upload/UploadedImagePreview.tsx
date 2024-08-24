import { UploadableFile } from "./MultipleFileUploadField";

interface UploadedImagePreviewProps {
  image: UploadableFile;
  index: number;
}

export default function UploadedImagePreview(props: UploadedImagePreviewProps) {
  return <img key={props.index} src={props.image as string} />;
}
