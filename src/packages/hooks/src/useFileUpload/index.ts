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
    const extension = file.name.split(".").pop()?.toLowerCase() as string;

    if (!accept.some((accept) => accept.includes(extension))) {
      throw new Error("파일 확장자가 올바르지 않습니다.");
    }
    if (file.size > maxSizeMb * 1024 * 1024) {
      throw new Error("파일 크기가 초과되었습니다.");
    }
  };

  const onAdd = (file: File, files: File[]) => {
    if (multiple) {
      files.forEach((file) => onValidate(file));
      return setResult(files);
    }

    onValidate(file);
    return setResult(file);
  };

  const onDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();

    const [file, files] = [e.dataTransfer.files[0], Array.from(e.dataTransfer.files)];

    onAdd(file, files);
  };

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;

    const [file, files] = [e.target.files[0], Array.from(e.target.files)];

    onAdd(file, files);
  };

  return {
    fileInputRef,
    result,
    onDrop,
    onChange,
  };
};

export default useFileUpload;
