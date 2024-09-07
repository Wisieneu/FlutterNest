import { useDropzone } from "react-dropzone";
import { useCallback } from "react";
import { IconType } from "react-icons";

export interface SingleFileUploadFieldProps {
  setFile: React.Dispatch<React.SetStateAction<File | undefined>>;
  text?: string;
  icon?: IconType;
}

export default function SingleFileUploadField(
  props: SingleFileUploadFieldProps,
) {
  const onDrop = useCallback((acceptedFile: File[]) => {
    props.setFile(acceptedFile[0]);
  }, []);
  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  return (
    <div {...getRootProps()}>
      <input {...getInputProps()} />
      {props.text}
      {props.icon && <props.icon className="ml-auto h-6 w-6 stroke-current" />}
    </div>
  );
}
