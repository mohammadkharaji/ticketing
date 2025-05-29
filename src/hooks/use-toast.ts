import { toast as sonnerToast } from "sonner";

export function toast({ title, description, variant = "default" }: { title?: string; description?: string; variant?: "default" | "destructive" | "success" | "warning" }) {
  sonnerToast(
    title || description,
    {
      description,      className:
        variant === "destructive"
          ? "destructive"
          : variant === "success"
          ? "success"
          : variant === "warning"
          ? "warning"
          : undefined,
    }
  );
}
