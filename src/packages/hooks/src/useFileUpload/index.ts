import { useRef, useState } from "react";

type Params = {
  multiple?: boolean;
  maxSizeMb?: number;
  accept?: string[];
};

const useFileUpload = ({ multiple = false, maxSizeMb = 50, accept = [".pdf", ".jpg", ".jpeg", ".png"] }: Params) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [result, setResult] = useState<File | File[] | null>(null);

  const onValidate = (file: File) => {
    const extension = `.${file.name.split(".").pop()?.toLowerCase()}`;

    if (!accept.some((accept) => accept.toLowerCase() === extension)) {
      throw new Error("파일 확장자가 올바르지 않습니다.");
    }
    if (file.size > maxSizeMb * 1024 * 1024) {
      throw new Error("파일 크기가 초과되었습니다.");
    }
  };

  const generateResult = (files: File[]) => {
    if (files.length === 0) return;

    files.forEach((file) => onValidate(file));
    setResult(multiple ? files : files[0]);
  };

  const onDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();

    generateResult(Array.from(e.dataTransfer.files));
  };

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;

    generateResult(Array.from(e.target.files));
  };

  return {
    fileInputRef,
    result,
    onDrop,
    onChange,
  };
};

export default useFileUpload;
