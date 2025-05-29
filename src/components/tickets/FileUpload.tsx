import { useState, useRef } from "react";
import { Upload, X, FileText, File as FileIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { toast } from "../../hooks/use-toast";
import fileService, { FileUploadResult } from "@/services/fileservice";

interface FileUploaderProps {
  ticketId: string;
  userId: string;
  onUploadComplete: (file: FileUploadResult) => void;
  disabled?: boolean;
}

export function FileUploader({ ticketId, userId, onUploadComplete, disabled = false }: FileUploaderProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const file = files[0];
    
    // Check file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      toast({
        title: "خطا در آپلود فایل",
        description: "حداکثر حجم مجاز فایل 10 مگابایت است",
        variant: "destructive",
      });
      return;
    }

    setIsUploading(true);
    setUploadProgress(10);

    try {
      // Simulate progress
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          const newProgress = prev + Math.floor(Math.random() * 10);
          return newProgress >= 90 ? 90 : newProgress;
        });
      }, 300);

      const result = await fileService.uploadFile(file, ticketId, userId);
      
      clearInterval(progressInterval);
      setUploadProgress(100);
      
      onUploadComplete(result);
      
      toast({
        title: "فایل با موفقیت آپلود شد",
        description: "",
        variant: "default",
      });
    } catch (error) {
      console.error("Error uploading file:", error);
      toast({
        title: "خطا در آپلود فایل",
        description: "لطفاً دوباره تلاش کنید",
        variant: "destructive",
      });
    } finally {
      // Reset after a short delay to show 100% progress
      setTimeout(() => {
        setIsUploading(false);
        setUploadProgress(0);
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
      }, 500);
    }
  };

  const handleButtonClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <div className="w-full">
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
        accept=".pdf,.doc,.docx,.xls,.xlsx,.jpg,.jpeg,.png,.zip,.rar"
        disabled={disabled || isUploading}
      />
      
      {isUploading ? (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm">در حال آپلود فایل...</span>
            <span className="text-sm">{uploadProgress}%</span>
          </div>
          <Progress value={uploadProgress} className="h-2" />
        </div>
      ) : (
        <Button
          type="button"
          variant="outline"
          onClick={handleButtonClick}
          disabled={disabled}
          className="w-full flex items-center justify-center gap-2"
        >
          <span className="flex items-center gap-2">
            <Upload className="h-4 w-4" />
            افزودن فایل پیوست
          </span>
        </Button>
      )}
    </div>
  );
}
