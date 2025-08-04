'use client';

import * as React from 'react';
import { useState, type DragEvent } from 'react';
import { UploadCloud, Loader2, File as FileIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

type FileUploaderProps = {
  onFileUpload: (file: File) => void;
  isLoading: boolean;
};

export function FileUploader({ onFileUpload, isLoading }: FileUploaderProps) {
  const [dragActive, setDragActive] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);
  const inputRef = React.useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleDrag = (e: DragEvent<HTMLDivElement | HTMLFormElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleFile = (file: File) => {
    if (file.type !== 'application/pdf') {
      toast({
        variant: 'destructive',
        title: 'Invalid File Type',
        description: 'Please upload a PDF file.',
      });
      return;
    }
    setFileName(file.name);
    onFileUpload(file);
  };
  
  const onButtonClick = () => {
    inputRef.current?.click();
  };

  return (
    <div className="flex flex-col items-center justify-center text-center w-full max-w-2xl mx-auto pt-8">
      <h2 className="text-3xl font-bold tracking-tight mb-2 font-headline">Analyze Your Contract Instantly</h2>
      <p className="text-muted-foreground mb-8 max-w-md">
        Upload your contract PDF to get an AI-powered analysis of key clauses and potential risks in seconds.
      </p>
      <form className="w-full" onSubmit={(e) => e.preventDefault()} onDragEnter={handleDrag}>
        <input
          ref={inputRef}
          type="file"
          id="file-upload"
          className="hidden"
          accept="application/pdf"
          onChange={handleChange}
          disabled={isLoading}
        />
        <label
          htmlFor="file-upload"
          className={`relative flex flex-col items-center justify-center w-full h-64 border-2 border-dashed rounded-lg cursor-pointer bg-card hover:bg-secondary transition-colors ${
            dragActive ? 'border-primary' : 'border-border'
          }`}
        >
          {dragActive && <div className="absolute inset-0 w-full h-full rounded-lg" onDragEnter={handleDrag} onDragLeave={handleDrag} onDragOver={handleDrag} onDrop={handleDrop}></div>}
          
          {isLoading ? (
            <div className="flex flex-col items-center gap-4">
              <Loader2 className="h-16 w-16 animate-spin text-primary" />
              <p className="text-lg font-medium">Analyzing your document...</p>
              {fileName && <p className="text-sm text-muted-foreground flex items-center gap-2"><FileIcon className="h-4 w-4" /> {fileName}</p>}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center pt-5 pb-6">
              <UploadCloud className="w-10 h-10 mb-4 text-muted-foreground" />
              <p className="mb-2 text-sm text-muted-foreground">
                <span className="font-semibold text-primary">Click to upload</span> or drag and drop
              </p>
              <p className="text-xs text-muted-foreground">PDF only (max. 10MB)</p>
            </div>
          )}
        </label>
      </form>
      {!isLoading && (
        <Button onClick={onButtonClick} className="mt-6" size="lg">
          Select File
        </Button>
      )}
    </div>
  );
}
