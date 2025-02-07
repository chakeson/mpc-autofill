/**
 * A small wrapper around the `react-dropzone` Dropzone for consistent presentation.
 */

import React, { useCallback } from "react";
import { DropzoneRootProps, useDropzone } from "react-dropzone";
import styled from "styled-components";

import { useAppDispatch } from "@/common/types";
import { setError } from "@/features/toasts/toastsSlice";

const getColor = (props: DropzoneRootProps) => {
  if (props.isDragAccept) {
    return "#00e676";
  }
  if (props.isDragReject) {
    return "#ff1744";
  }
  if (props.isFocused) {
    return "#2196f3";
  }
  return "#eeeeee";
};

const Container = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  border-width: 2px;
  border-radius: 2px;
  border-color: ${(props: DropzoneRootProps) => getColor(props)};
  border-style: dashed;
  color: #bdbdbd;
  outline: none;
  transition: border 0.24s ease-in-out;
  cursor: pointer;
`;

interface StyledDropzoneProps {
  mimeTypes: { [mimeType: string]: Array<string> };
  fileUploadCallback: {
    (fileContent: string | ArrayBuffer | null): void;
  };
  label: string;
}

export function TextFileDropzone({
  mimeTypes,
  fileUploadCallback,
  label,
}: StyledDropzoneProps) {
  const dispatch = useAppDispatch();

  // let the user know when something goes wrong with reading their file
  const onAbort = useCallback(
    () =>
      dispatch(
        setError([
          "dropzone-onabort",
          { name: "File upload error", message: "File reading was stopped." },
        ])
      ),
    []
  );
  const onError = useCallback(
    () =>
      dispatch(
        setError([
          "dropzone-onerror",
          {
            name: "File upload error",
            message: "An error occurred while reading the file.",
          },
        ])
      ),
    []
  );

  const onDrop = useCallback(
    (acceptedFiles: Array<File>) => {
      acceptedFiles.forEach((file: File) => {
        const reader = new FileReader();
        reader.onabort = onAbort;
        reader.onerror = onError;
        reader.onload = () => {
          fileUploadCallback(reader.result);
        };
        reader.readAsText(file);
      });
    },
    [fileUploadCallback, onAbort, onError]
  );

  const { getRootProps, getInputProps, isFocused, isDragAccept, isDragReject } =
    useDropzone({ onDrop, accept: mimeTypes, maxFiles: 1 });

  return (
    <div className="container">
      <Container
        {...getRootProps({ isFocused, isDragAccept, isDragReject })}
        aria-label={label ?? "dropzone"}
      >
        <input {...getInputProps()} />
        Drag and drop a file here, or click to select a file.
      </Container>
    </div>
  );
}
