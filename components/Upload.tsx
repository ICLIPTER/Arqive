import { CheckCircle2, ImageIcon, UploadIcon } from "lucide-react";
import React, { useCallback, useState } from "react";
import { useOutletContext } from "react-router";

import {
  PROGRESS_INCREMENT,
  PROGRESS_INTERVAL_MS,
  REDIRECT_DELAY_MS,
} from "../lib/constants";

interface UploadProps {
  onComplete?: (base64Data: string) => void;
}

interface AuthContext {
  isSignedIn: boolean;
}

const Upload = ({ onComplete }: UploadProps) => {
  const [file, setFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const { isSignedIn } = useOutletContext<AuthContext>();

  const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10 MB
  const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"];

  const processFile = useCallback(
    (selectedFile: File) => {
      if (!isSignedIn) return;

      if (!ALLOWED_TYPES.includes(selectedFile.type)) {
        setError("Unsupported file type. Please upload a JPG, PNG or WebP image.");
        return;
      }

      if (selectedFile.size > MAX_FILE_SIZE) {
        setError("File is too large. Maximum size is 10 MB.");
        return;
      }

      setError(null);
      setFile(selectedFile);
      setProgress(0);

      const reader = new FileReader();

      reader.onloadend = () => {
        const base64Data = reader.result as string;

        const interval = setInterval(() => {
          setProgress((prev) => {
            const next = prev + PROGRESS_INCREMENT;

            if (next >= 100) {
              clearInterval(interval);

              setTimeout(() => {
                onComplete?.(base64Data);
              }, REDIRECT_DELAY_MS);

              return 100;
            }

            return next;
          });
        }, PROGRESS_INTERVAL_MS);
      };

      reader.onerror = () =>
        setError("Could not read the file. Please try again.");

      reader.readAsDataURL(selectedFile);
    },
    [isSignedIn, onComplete],
  );

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();

    if (!isSignedIn) return;

    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);

    if (!isSignedIn) return;

    const droppedFile = e.dataTransfer.files?.[0];

    if (droppedFile && droppedFile.type.startsWith("image/")) {
      processFile(droppedFile);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!isSignedIn) return;

    const selectedFile = e.target.files?.[0];

    if (selectedFile) {
      setError(null);
      processFile(selectedFile);
    }
  };

  return (
    <div className="upload">
      {error && (
        <p className="upload-error" role="alert">
          {error}
        </p>
      )}
      {!file ? (
        <div
          className={`dropzone ${isDragging ? "is-dragging" : ""}`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <input
            type="file"
            className="drop-input"
            accept=".jpg,.jpeg,.png,.webp"
            disabled={!isSignedIn}
            onChange={handleChange}
          />

          <div className="drop-content">
            <div className="drop-icon">
              <UploadIcon size={20} />
            </div>

            <p>
              {isSignedIn
                ? "Click to upload or drag and drop"
                : "Sign in or sign up with Puter to upload"}
            </p>

            <p className="help">Maximum file size 50MB</p>
          </div>
        </div>
      ) : (
        <div className="upload-status">
          <div className="status-content">
            <div className="status-icon">
              {progress === 100 ? (
                <CheckCircle2 className="check" />
              ) : (
                <ImageIcon className="image" />
              )}
            </div>

            <h3>{file.name}</h3>

            <div className="progress">
              <div className="bar" style={{ width: `${progress}%` }} />

              <p className="status-text">
                {progress < 100 ? "Analyzing Floor Plan..." : "Redirecting..."}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Upload;
