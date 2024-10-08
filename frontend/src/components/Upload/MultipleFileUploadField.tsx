import { FaFileImage } from "react-icons/fa";
import {
  DropEvent,
  FileError,
  FileRejection,
  useDropzone,
} from "react-dropzone";

export interface MultipleFileUploadFieldProps {
  files: File[];
  onDrop: <T extends File>(
    acceptedFiles: T[],
    fileRejections: FileRejection[],
    event: DropEvent,
  ) => void;
}

export default function MultipleFileUploadField(
  props: MultipleFileUploadFieldProps,
) {
  const { getRootProps, getInputProps, isFocused, isDragAccept, isDragReject } =
    useDropzone({ accept: { "image/*": [] }, onDrop: props.onDrop });

  return (
    <div
      className="cursor-pointer rounded-full p-3 hover:bg-purple-900 hover:bg-opacity-30"
      {...getRootProps()}
    >
      <FaFileImage className="text-lg text-purple-900" size={20} />
      <input {...getInputProps()} />
    </div>
  );
}
