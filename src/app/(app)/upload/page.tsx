"use client";

import { useState } from "react";
import { FileUp, Loader2 } from "lucide-react";
import { UploadForm } from "@/components/upload/upload-form";
import { useLanguage } from "@/components/providers/language-provider";

// Mock AI functions
const summarizeUploadedDocument = async (file: File) => {
  await new Promise(res => setTimeout(res, 1000));
  return { summary: `This is a mock AI summary for ${file.name}. It highlights key information and suggests action items based on the document's content.` };
};

const assignDepartmentAndUrgency = async (content: string) => {
  await new Promise(res => setTimeout(res, 1000));
  const departments = ["Engineering & Projects", "Finance & Accounts", "Human Resources (HR) & Administration"];
  const urgencies = ["low", "medium", "high"];
  const deadline = new Date();
  deadline.setDate(deadline.getDate() + 7);
  return {
    department: departments[Math.floor(Math.random() * departments.length)],
    urgency: urgencies[Math.floor(Math.random() * urgencies.length)] as "low" | "medium" | "high",
    deadline: deadline.toISOString(),
  };
};

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

    // Simulate reading file content
    const fileContent = "mock file content";

    // Run AI flows in parallel
    const [summaryResult, assignmentResult] = await Promise.all([
      summarizeUploadedDocument(selectedFile),
      assignDepartmentAndUrgency(fileContent),
    ]);

    setAiData({
        title: selectedFile.name.replace(/\.[^/.]+$/, ""),
        ...summaryResult,
        ...assignmentResult
    });
    setIsProcessing(false);
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
