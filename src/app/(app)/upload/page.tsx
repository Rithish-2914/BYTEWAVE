
"use client";

import { useState, useRef, useEffect } from "react";
import { FileUp, Loader2, Camera, Image as ImageIcon } from "lucide-react";
import { UploadForm } from "@/components/upload/upload-form";
import { useLanguage } from "@/components/providers/language-provider";
import { summarizeUploadedDocument } from "@/ai/flows/summarize-uploaded-document";
import { assignDepartmentAndUrgency } from "@/ai/flows/assign-department-and-urgency";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

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
  const { toast } = useToast();

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [hasCameraPermission, setHasCameraPermission] = useState<boolean | null>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("file");


  useEffect(() => {
    const getCameraPermission = async () => {
        try {
          const stream = await navigator.mediaDevices.getUserMedia({ video: true });
          setHasCameraPermission(true);
  
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
          }
        } catch (error) {
          console.error('Error accessing camera:', error);
          setHasCameraPermission(false);
          toast({
            variant: 'destructive',
            title: 'Camera Access Denied',
            description: 'Please enable camera permissions in your browser settings to use this app.',
          });
        }
    };

    const stopCamera = () => {
        if(videoRef.current && videoRef.current.srcObject) {
            const stream = videoRef.current.srcObject as MediaStream;
            stream.getTracks().forEach(track => track.stop());
            videoRef.current.srcObject = null;
        }
    }
    
    if (activeTab === 'camera') {
        getCameraPermission();
    } else {
        stopCamera();
    }

    return () => {
        stopCamera();
    }

  }, [activeTab, toast]);

  const handleFileChange = async (selectedFile: File | null) => {
    if (!selectedFile) return;

    setFile(selectedFile);
    setIsProcessing(true);
    setAiData(null);
    setCapturedImage(null);

    try {
      const documentDataUri = await readFileAsDataURI(selectedFile);
      let documentContent = "";

      // Attempt to read text for text-based files
      if (selectedFile.type.startsWith('text/') || selectedFile.type === 'application/pdf') {
         try {
            documentContent = await readFileAsText(selectedFile);
         } catch (e) {
            console.warn("Could not read text from file, proceeding with URI only for summary.");
         }
      }


      const [summaryResult, assignmentResult] = await Promise.all([
        summarizeUploadedDocument({ documentDataUri }),
        documentContent ? assignDepartmentAndUrgency({ documentContent }) : Promise.resolve({}),
      ]);

      setAiData({
          title: selectedFile.name.replace(/\.[^/.]+$/, ""),
          ...summaryResult,
          ...assignmentResult
      });
    } catch(e) {
        console.error(e);
        toast({
            variant: "destructive",
            title: "Processing Failed",
            description: "There was an error processing your document with the AI."
        })
        setFile(null); // Reset on failure
    } finally {
        setIsProcessing(false);
    }
  };

  const handleCapture = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const context = canvas.getContext('2d');
      if (context) {
        context.drawImage(video, 0, 0, video.videoWidth, video.videoHeight);
        const imageDataUri = canvas.toDataURL('image/jpeg');
        setCapturedImage(imageDataUri);

        // Convert data URI to File and process
        fetch(imageDataUri)
          .then(res => res.blob())
          .then(blob => {
            const capturedFile = new File([blob], `capture-${Date.now()}.jpg`, { type: 'image/jpeg' });
            handleFileChange(capturedFile);
          });
      }
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

  const resetState = () => {
    setFile(null);
    setAiData(null);
    setCapturedImage(null);
    setIsProcessing(false);
  }

  if (isProcessing) {
    return (
        <div className="flex flex-col items-center justify-center gap-4 text-center h-full">
            <Loader2 className="h-12 w-12 animate-spin text-primary" />
            <h2 className="font-headline text-xl">{t("uploadPage.processing")} <span className="font-mono text-primary">{file?.name}</span>...</h2>
            <p className="text-muted-foreground">{t("uploadPage.processingDescription")}</p>
        </div>
    );
  }

  if (file && aiData) {
      return <UploadForm fileName={file.name} aiData={aiData} onReset={resetState} />;
  }


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

       <Tabs defaultValue="file" value={activeTab} onValueChange={setActiveTab} className="w-full max-w-2xl mx-auto">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="file">
            <FileUp className="mr-2 h-4 w-4" />
            {t('uploadPage.fileUpload')}
          </TabsTrigger>
          <TabsTrigger value="camera">
            <Camera className="mr-2 h-4 w-4" />
            {t('uploadPage.cameraUpload')}
          </TabsTrigger>
        </TabsList>
        <TabsContent value="file">
            <div
                onDragOver={onDragOver}
                onDrop={onDrop}
                className="mt-4 flex flex-col items-center justify-center w-full h-64 border-2 border-dashed rounded-lg cursor-pointer bg-card hover:bg-muted"
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
        </TabsContent>
        <TabsContent value="camera">
            <div className="mt-4 flex flex-col items-center gap-4">
               {hasCameraPermission === false && (
                    <Alert variant="destructive" className="w-full">
                        <Camera className="h-4 w-4" />
                        <AlertTitle>{t('uploadPage.cameraAccessDenied')}</AlertTitle>
                        <AlertDescription>
                            {t('uploadPage.cameraAccessDescription')}
                        </AlertDescription>
                    </Alert>
               )}
               <div className="w-full aspect-video bg-muted rounded-lg overflow-hidden relative">
                    <video ref={videoRef} className="w-full h-full object-cover" autoPlay muted playsInline />
                    {capturedImage && (
                        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50">
                           <ImageIcon className="h-16 w-16 text-white" />
                        </div>
                    )}
               </div>
               <canvas ref={canvasRef} className="hidden"></canvas>
               <Button onClick={handleCapture} disabled={hasCameraPermission === false || isProcessing}>
                    <Camera className="mr-2 h-4 w-4" />
                    {t('uploadPage.capture')}
               </Button>
            </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

