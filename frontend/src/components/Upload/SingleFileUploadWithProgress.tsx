import { useEffect } from "react";

export interface SingleFileUploadWithProgressProps {
  file: File;
}

export default function SingleFileUploadWithProgress({file}: SingleFileUploadWithProgressProps) {
  useEffect(() => {
    
    console.log("file", file  );
  }, []);
  return <></>;
}