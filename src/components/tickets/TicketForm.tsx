import React, { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";

// نمونه اسکیمای اعتبارسنجی (در صورت نیاز می‌توانید اسکیمای پروژه را ایمپورت کنید)
const ticketFormSchema = z.object({
  title: z.string().min(5, "عنوان تیکت باید حداقل ۵ کاراکتر باشد.").max(100),
  description: z.string().min(10, "توضیحات تیکت باید حداقل ۱۰ کاراکتر باشد.").max(2000),
  departmentId: z.string().min(1, "دپارتمان را انتخاب کنید."),
  categoryId: z.string().min(1, "دسته‌بندی را انتخاب کنید."),
  priorityId: z.string().min(1, "اولویت را انتخاب کنید."),
});

type TicketFormValues = z.infer<typeof ticketFormSchema>;

interface SelectOption { id: string; name: string; }

interface TicketFormProps {
  onSubmit: (values: TicketFormValues) => void | Promise<void>;
  isSubmitting?: boolean;
  defaultValues?: Partial<TicketFormValues>;
  departments: SelectOption[];
  categories: SelectOption[];
  priorities: SelectOption[];
}

export default function TicketForm({ onSubmit, isSubmitting, defaultValues, departments, categories, priorities }: TicketFormProps) {
  const form = useForm<TicketFormValues>({
    resolver: zodResolver(ticketFormSchema),
    defaultValues: {
      title: "",
      description: "",
      departmentId: "",
      categoryId: "",
      priorityId: "",
      ...defaultValues,
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>عنوان تیکت</FormLabel>
              <FormControl>
                <Input placeholder="مثال: مشکل در اتصال به شبکه" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>توضیحات</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="جزئیات مشکل یا درخواست خود را شرح دهید..." 
                  rows={6} 
                  style={{ background: '#fff' }}
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <FormField
            control={form.control}
            name="departmentId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>دپارتمان</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="انتخاب دپارتمان" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {departments.map((dept) => (
                      <SelectItem key={dept.id} value={dept.id}>{dept.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="categoryId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>دسته‌بندی</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="انتخاب دسته‌بندی" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {categories.map((cat) => (
                      <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="priorityId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>اولویت</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="انتخاب اولویت" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {priorities.map((prio) => (
                      <SelectItem key={prio.id} value={prio.id}>{prio.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <Button type="submit" disabled={isSubmitting} className="w-full">
          {isSubmitting ? "در حال ثبت..." : "ثبت تیکت"}
        </Button>
      </form>
    </Form>
  );
}
