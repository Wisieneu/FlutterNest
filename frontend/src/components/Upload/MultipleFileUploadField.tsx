import { useCallback, useState } from "react";
import { FileError, FileRejection, useDropzone } from "react-dropzone";

export interface UploadableFile {
  file: File;
  errors: FileError[];
}

export default function MultipleFileUploadField() {
  const [files, setFiles] = useState<UploadableFile[]>([]);
  const onDrop = useCallback(
    (acceptedFiles: File[], rejectedFiles: FileRejection[]) => {
      const mappedAcc = acceptedFiles.map((file) => ({
        file,
        errors: [],
      }));
      setFiles((prevState) => [...prevState, ...mappedAcc, ...rejectedFiles]);
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
        {files.map((file, index) => (
          <FileUploadPreview />
        ))}
        {JSON.stringify(files)}
      </div>
    </>
  );
}
