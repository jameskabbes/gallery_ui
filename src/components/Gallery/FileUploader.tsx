import React, { useState, useContext, useEffect, useCallback } from 'react';
import { AuthContext } from '../../contexts/Auth';
import { AxiosProgressEvent } from 'axios';
import {
  AuthContextType,
  ModalsContextType,
  ValidatedInputState,
} from '../../types';
import { defaultValidatedInputState } from '../../utils/useValidatedInput';

import { paths, operations, components } from '../../gallery_api_schema_client';
import { Button2, ButtonSubmit } from '../Utils/Button';
import { Surface } from '../Utils/Surface';
import { CheckOrX } from '../Form/CheckOrX';
import { IoClose } from 'react-icons/io5';
import { ModalsContext } from '../../contexts/Modals';
import { uploadFile } from '../../utils/uploadFile';

interface FileProgressProps {
  file: File;
  authContext: AuthContextType;
  galleryId: components['schemas']['GalleryPublic']['id'];
}

function FileProgress({ file, authContext, galleryId }: FileProgressProps) {
  const [uploadProgress, setUploadProgress] = useState<
    ValidatedInputState<number>
  >({
    ...defaultValidatedInputState<number>(0),
  });

  useEffect(() => {
    async function upload() {
      try {
        const result = await uploadFile<any>(
          '/galleries/{gallery_id}/upload/',
          file,
          (progress) => {
            setUploadProgress((prev) => ({
              ...prev,
              value: progress,
              status: progress === 100 ? 'valid' : 'loading',
            }));
          }
        );
      } catch (error) {
        setUploadProgress((prev) => ({
          ...prev,
          status: 'invalid',
          error: 'Upload failed',
        }));
        console.error('File upload failed:', error);
      }
    }
    upload();
  }, []);

  return (
    <div>
      <div className="flex flex-row justify-between items-center space-x-2">
        <h4 className="overflow-x-hidden">{file.name}</h4>
        <div className="flex-1">
          <CheckOrX status={uploadProgress.status} />
        </div>
        <button>
          <IoClose />
        </button>
      </div>
      <h6>
        <div className="flex flex-row items-center space-x-2">
          <Surface>
            <div
              className="flex w-full h-2 rounded-full overflow-hidden "
              role="progressbar"
              aria-valuenow={uploadProgress.value}
              aria-valuemin={0} // Change this to a number
              aria-valuemax={100} // Change this to a number
            >
              <div
                className="rounded-full bg-green-500 dark:bg-green-500 transition duration-500"
                style={{ width: `${uploadProgress.value}%` }}
              ></div>
            </div>
          </Surface>
        </div>
      </h6>
    </div>
  );
}

const modalFileUploaderKey = 'modal-file-uploader';

interface FileUploaderProps {
  gallery: components['schemas']['GalleryPublic'];
}

export function FileUploader({ gallery }: FileUploaderProps) {
  const authContext = useContext(AuthContext);
  const modalsContext = useContext(ModalsContext);

  const [files, setFiles] = useState<File[]>([]);
  const [dragging, setDragging] = useState(false);

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    modalsContext.deleteModals([modalFileUploaderKey]);
  }

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const selectedFiles = Array.from(event.target.files);
      setFiles((prevFiles) => [...prevFiles, ...selectedFiles]);
    }
  };

  const handleCustomButtonClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    document.getElementById('fileInput')?.click();
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragging(false);

    if (e.dataTransfer.files) {
      const droppedFiles = Array.from(e.dataTransfer.files);
      setFiles((prevFiles) => [...prevFiles, ...droppedFiles]);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col space-y-2">
      <header>Upload Files</header>
      <input
        id="fileInput"
        className="hidden"
        type="file"
        multiple
        onChange={handleFileSelect}
      />
      <Button2
        type="button"
        onClick={handleCustomButtonClick}
        className="custom-file-button"
      >
        Choose Files
      </Button2>
      <Surface>
        <div
          id="drop-zone"
          className={`${
            dragging ? 'border-color-primary' : ''
          } p-8 rounded-xl border-2 border-dashed`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <p className="text-center">Drop files</p>
        </div>
      </Surface>
      <div className="flex flex-col space-y-2">
        {files.map((file, index) => (
          <FileProgress
            key={index}
            file={file}
            authContext={authContext}
            galleryId={gallery.id}
          />
        ))}
      </div>
      <ButtonSubmit>Done</ButtonSubmit>
    </form>
  );
}

export function setFileUploaderModal(
  modalsContext: ModalsContextType,
  gallery: components['schemas']['GalleryPublic']
) {
  modalsContext.pushModals([
    {
      Component: FileUploader,
      componentProps: { gallery },
      key: modalFileUploaderKey,
      contentAdditionalClassName: 'max-w-[400px] w-full',
    },
  ]);
}
