import { useCallback, useState } from "react";
import { FileError, FileRejection, useDropzone } from "react-dropzone";
import FileUploadPreview from "./FileUploadPreview";
import SingleFileUploadWithProgress from "./SingleFileUploadWithProgress";

export interface UploadableFile {
  file: File;
  errors: FileError[];
}

export interface MultipleFileUploadFieldProps {
  files: UploadableFile[];
  setFiles: React.Dispatch<React.SetStateAction<UploadableFile[]>>;
}

export default function MultipleFileUploadField(
  props: MultipleFileUploadFieldProps,
) {
  // const [files, setFiles] = useState<UploadableFile[]>([]);
  const onDrop = useCallback(
    (acceptedFiles: File[], rejectedFiles: FileRejection[]) => {
      console.log(acceptedFiles);
      const mappedAcc = acceptedFiles.map((file) => ({
        file,
        errors: [],
      }));
      props.setFiles((prevState) => [...prevState, ...mappedAcc]);
    },
    [],
  );
  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  return (
    <>
      <div {...getRootProps()}>
        <input {...getInputProps()} />
        {isDragActive ? (
          <p>Drop the files here ...</p>
        ) : (
          <p>Drag 'n' drop some files here, or click to select files</p>
        )}
        {props.files.map((fileWrapper, index) => (
          <SingleFileUploadWithProgress key={index} file={fileWrapper.file} />
          // <FileUploadPreview />
        ))}
        {JSON.stringify(props.files)}
      </div>
    </>
  );
}
