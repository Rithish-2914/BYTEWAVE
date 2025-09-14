"use client";

import { useState } from "react";
import { FileUp, Loader2 } from "lucide-react";
import { UploadForm } from "@/components/upload/upload-form";
import { useLanguage } from "@/components/providers/language-provider";
import { summarizeUploadedDocument } from "@/ai/flows/summarize-uploaded-document";
import { assignDepartmentAndUrgency } from "@/ai/flows/assign-department-and-urgency";

const readFileAsDataURI = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      resolve(reader.result as string);
    };
    reader.onerror = (error) => {
      reject(error);
    };
    reader.readAsDataURL(file);
  });
};

const readFileAsText = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => {
            resolve(reader.result as string);
        };
        reader.onerror = (error) => {
            reject(error);
        };
        reader.readAsText(file);
    });
}


export default function UploadPage() {
  const [file, setFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [aiData, setAiData] = useState<any>(null);
  const { t } = useLanguage();

  const handleFileChange = async (selectedFile: File | null) => {
    if (!selectedFile) return;

    setFile(selectedFile);
    setIsProcessing(true);
    setAiData(null);

    try {
      // Run AI flows in parallel
      const [documentDataUri, documentContent] = await Promise.all([
          readFileAsDataURI(selectedFile),
          readFileAsText(selectedFile)
      ]);

      const [summaryResult, assignmentResult] = await Promise.all([
        summarizeUploadedDocument({ documentDataUri }),
        assignDepartmentAndUrgency({ documentContent }),
      ]);

      setAiData({
          title: selectedFile.name.replace(/\.[^/.]+$/, ""),
          ...summaryResult,
          ...assignmentResult
      });
    } catch(e) {
        console.error(e);
    } finally {
        setIsProcessing(false);
    }
  };

  const onDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const onDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      handleFileChange(files[0]);
    }
  };

  const onFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFileChange(files[0]);
    }
  };

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="font-headline text-3xl font-bold tracking-tight">
          {t("uploadPage.title")}
        </h1>
        <p className="text-muted-foreground">
          {t("uploadPage.description")}
        </p>
      </div>

      <div className="flex flex-col items-center justify-center w-full gap-4">
        {!file && (
          <div
            onDragOver={onDragOver}
            onDrop={onDrop}
            className="flex flex-col items-center justify-center w-full max-w-2xl h-64 border-2 border-dashed rounded-lg cursor-pointer bg-card hover:bg-muted"
          >
            <label htmlFor="dropzone-file" className="flex flex-col items-center justify-center w-full h-full">
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <FileUp className="w-10 h-10 mb-3 text-muted-foreground" />
                <p className="mb-2 text-sm text-muted-foreground">
                  <span className="font-semibold">{t("uploadPage.clickToUpload")}</span> {t("uploadPage.dragAndDrop")}
                </p>
                <p className="text-xs text-muted-foreground">{t("uploadPage.fileTypes")}</p>
              </div>
              <input id="dropzone-file" type="file" className="hidden" onChange={onFileInputChange} />
            </label>
          </div>
        )}

        {isProcessing && (
            <div className="flex flex-col items-center justify-center gap-4 text-center">
                <Loader2 className="h-12 w-12 animate-spin text-primary" />
                <h2 className="font-headline text-xl">{t("uploadPage.processing")} <span className="font-mono text-primary">{file?.name}</span>...</h2>
                <p className="text-muted-foreground">{t("uploadPage.processingDescription")}</p>
            </div>
        )}

        {file && !isProcessing && aiData && (
            <UploadForm fileName={file.name} aiData={aiData} />
        )}

      </div>
    </div>
  );
}
