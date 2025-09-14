
"use client";

import { useForm, SubmitHandler } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { DEPARTMENTS, URGENCY_LEVELS } from "@/lib/constants";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "../providers/language-provider";
import { useDocuments } from "@/hooks/use-documents";
import { useRouter } from "next/navigation";
import { useAuth } from "../providers/auth-provider";

const formSchema = z.object({
  title: z.string().min(1, "Title is required"),
  summary: z.string().min(10, "Summary is too short"),
  department: z.string().min(1, "Department must be selected"),
  urgency: z.enum(["low", "medium", "high"]),
  deadline: z.date().optional(),
});

type FormValues = z.infer<typeof formSchema>;

type UploadFormProps = {
  fileName: string;
  aiData: Partial<FormValues> & { title: string };
  onReset: () => void;
};

export function UploadForm({ fileName, aiData, onReset }: UploadFormProps) {
  const { toast } = useToast();
  const { t } = useLanguage();
  const router = useRouter();
  const { addDocument } = useDocuments();
  const { currentUser } = useAuth();

  const getValidDate = (date: any) => {
    if (!date) return undefined;
    const d = new Date(date);
    return isNaN(d.getTime()) ? undefined : d;
  }

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: aiData.title || fileName,
      summary: aiData.summary || "",
      department: aiData.department || "",
      urgency: aiData.urgency || "medium",
      deadline: getValidDate(aiData.deadline),
    },
  });

  const onSubmit: SubmitHandler<FormValues> = (data) => {
    if (!currentUser) return;
    
    console.log("Form Submitted", data);

    const newDocument = {
        id: `DOC-${Date.now()}`,
        title: data.title,
        summary: data.summary,
        department: data.department,
        urgency: data.urgency,
        deadline: data.deadline?.toISOString().split('T')[0],
        category: 'Uncategorized',
        status: 'Pending' as const,
        createdAt: new Date().toISOString(),
        assignee: {
            name: currentUser.name,
            avatarUrl: currentUser.avatarUrl
        }
    };

    addDocument(newDocument);

    toast({
      title: t("uploadForm.reviewAndAssign"),
      description: `"${data.title}" has been assigned. The ${data.department} department head has been notified.`,
    });
    router.push('/documents');
  };

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle>{t("uploadForm.reviewAndAssign")}</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("uploadForm.documentTitle")}</FormLabel>
                  <FormControl>
                    <Input placeholder={t("uploadForm.documentTitlePlaceholder")} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="summary"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("uploadForm.summary")}</FormLabel>
                  <FormControl>
                    <Textarea rows={5} placeholder={t("uploadForm.summaryPlaceholder")} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                control={form.control}
                name="department"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>{t("uploadForm.assignDepartment")}</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                        <SelectTrigger>
                            <SelectValue placeholder={t("uploadForm.selectDepartment")} />
                        </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                        {DEPARTMENTS.map((dept) => (
                            <SelectItem key={dept} value={dept}>
                            {dept}
                            </SelectItem>
                        ))}
                        </SelectContent>
                    </Select>
                    <FormMessage />
                    </FormItem>
                )}
                />

                <FormField
                control={form.control}
                name="urgency"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>{t("uploadForm.setUrgency")}</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                        <SelectTrigger>
                            <SelectValue placeholder={t("uploadForm.selectUrgency")} />
                        </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                        {URGENCY_LEVELS.map((level) => (
                            <SelectItem key={level} value={level} className="capitalize">
                            {t(level)}
                            </SelectItem>
                        ))}
                        </SelectContent>
                    </Select>
                    <FormMessage />
                    </FormItem>
                )}
                />
            </div>
            
            <FormField
              control={form.control}
              name="deadline"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>{t("uploadForm.deadline")}</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-full pl-3 text-left font-normal",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value ? (
                            format(field.value, "PPP")
                          ) : (
                            <span>{t("uploadForm.pickDate")}</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={onReset}>{t("uploadForm.cancel")}</Button>
                <Button type="submit">{t("uploadForm.confirmAndNotify")}</Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
