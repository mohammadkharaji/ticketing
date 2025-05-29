import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useAuth } from "@/contexts/AuthContext";
import MainLayout from "@/components/layouts/MainLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { formatPersianDate, formatPersianRelativeTime } from "@/lib/date-utils";
import ticketService, { TicketWithRelations, TicketReply } from "@/services/ticketService";
import userService, { User } from "@/services/userService";
import fileservice, { FileInfo, FileUploadResult } from "@/services/fileservice";
import { FileUploader } from "@/components/tickets/FileUpload";
import { FileList } from "@/components/tickets/FileList";
import { toast } from "@/hooks/use-toast";

export default function TicketPage() {
  const router = useRouter();
  const { id } = router.query;
  const { user, userProfile, isAdmin, isDepartmentManager } = useAuth();
  const [ticket, setTicket] = useState<TicketWithRelations | null>(null);
  const [replies, setReplies] = useState<TicketReply[]>([]);
  const [replyMessage, setReplyMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [supportAgents, setSupportAgents] = useState<User[]>([]);
  const [isLoadingAgents, setIsLoadingAgents] = useState(false);
  const [files, setFiles] = useState<FileInfo[]>([]);
  const [isLoadingFiles, setIsLoadingFiles] = useState(false);
  const [activeTab, setActiveTab] = useState("details");

  useEffect(() => {
    if (!id) return;

    const fetchTicket = async () => {
      try {
        const ticket = await ticketService.getTicketById(id as string);
        if (!ticket) {
          router.push("/tickets");
          return;
        }
        setTicket(ticket);
        setReplies(ticket.replies || []);
      } catch (error) {
        console.error("Error fetching ticket:", error);
        toast({
          title: "خطا در دریافت اطلاعات تیکت",
          description: "لطفاً دوباره تلاش کنید",
          variant: "destructive",
        });
        router.push("/tickets");
      }
    };

    fetchTicket();
  }, [id, router]);

  useEffect(() => {
    if (!id) return;

    const fetchFiles = async () => {
      setIsLoadingFiles(true);
      try {
        const files = await fileservice.getFilesByTicketId(id as string);
        setFiles(files);
      } catch (error) {
        console.error("Error fetching files:", error);
      } finally {
        setIsLoadingFiles(false);
      }
    };

    fetchFiles();
  }, [id]);

  useEffect(() => {
    if (!isAdmin && !isDepartmentManager) return;

    const fetchSupportAgents = async () => {
      setIsLoadingAgents(true);
      try {
        const agents = await userService.getSupportAgents();
        setSupportAgents(agents);
      } catch (error) {
        console.error("Error fetching support agents:", error);
      } finally {
        setIsLoadingAgents(false);
      }
    };

    fetchSupportAgents();
  }, [isAdmin, isDepartmentManager]);

  const handleReplySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !ticket || !replyMessage.trim()) return;

    setIsSubmitting(true);
    try {
      const reply = await ticketService.addReply({
        ticketId: ticket.id,
        userId: user.id,
        message: replyMessage,
      });

      setReplies(prev => [...prev, reply]);
      setReplyMessage("");
      
      toast({
        title: "پاسخ با موفقیت ارسال شد",
        variant: "default",
      });
    } catch (error) {
      console.error("Error adding reply:", error);
      toast({
        title: "خطا در ارسال پاسخ",
        description: "لطفاً دوباره تلاش کنید",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleStatusChange = async (newStatusId: string) => {
    if (!ticket) return;

    try {
      const updatedTicket = await ticketService.updateTicket(ticket.id, {
        statusId: newStatusId,
      });
      setTicket(updatedTicket);
      
      toast({
        title: "وضعیت تیکت با موفقیت بروزرسانی شد",
        variant: "default",
      });
    } catch (error) {
      console.error("Error updating ticket status:", error);
      toast({
        title: "خطا در بروزرسانی وضعیت تیکت",
        description: "لطفاً دوباره تلاش کنید",
        variant: "destructive",
      });
    }
  };
  const handleAssigneeChange = async (newAssigneeId: string) => {
    if (!ticket) return;
    // If "unassigned" is selected, set assigneeId to null
    const assigneeId = newAssigneeId === "unassigned" ? null : newAssigneeId;
    try {
      const updatedTicket = await ticketService.updateTicket(ticket.id, {
        assigneeId, 
      });
      setTicket(updatedTicket);
      
      toast({
        title: "مسئول رسیدگی به تیکت با موفقیت تغییر کرد",
        variant: "default",
      });
    } catch (error) {
      console.error("Error updating ticket assignee:", error);
      toast({
        title: "خطا در تغییر مسئول رسیدگی",
        description: "لطفاً دوباره تلاش کنید",
        variant: "destructive",
      });
    }
  };

  const handleCloseTicket = async () => {
    if (!ticket) return;

    try {
      await ticketService.closeTicket(ticket.id);
      const updatedTicket = await ticketService.getTicketById(ticket.id);
      setTicket(updatedTicket);
      
      toast({
        title: "تیکت با موفقیت بسته شد",
        variant: "default",
      });
    } catch (error) {
      console.error("Error closing ticket:", error);
      toast({
        title: "خطا در بستن تیکت",
        description: "لطفاً دوباره تلاش کنید",
        variant: "destructive",
      });
    }
  };

  const handleReopenTicket = async () => {
    if (!ticket) return;

    try {
      await ticketService.reopenTicket(ticket.id);
      const updatedTicket = await ticketService.getTicketById(ticket.id);
      setTicket(updatedTicket);
      
      toast({
        title: "تیکت با موفقیت بازگشایی شد",
        variant: "default",
      });
    } catch (error) {
      console.error("Error reopening ticket:", error);
      toast({
        title: "خطا در بازگشایی تیکت",
        description: "لطفاً دوباره تلاش کنید",
        variant: "destructive",
      });
    }
  };

  const handleFileUploadComplete = (file: FileUploadResult) => {
    setFiles(prev => [{
      id: Math.random().toString(),
      name: file.name,
      size: file.size,
      type: file.type,
      path: file.path,
      url: file.url,
      ticketId: ticket?.id || "",
      createdAt: new Date().toISOString(),
      createdBy: user?.id || "",
      createdByName: userProfile ? `${userProfile.firstName} ${userProfile.lastName}` : "",
    }, ...prev]);
  };

  const handleFileDeleted = (fileId: string) => {
    setFiles(prev => prev.filter(file => file.id !== fileId));
  };

  if (!ticket || !userProfile) return null;

  const canManageTicket = isAdmin || isDepartmentManager || ticket.assigneeId === userProfile.id;
  const isClosed = ticket.status?.isClosed;

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold">#{ticket.ticketNumber} - {ticket.title}</h1>
            <p className="text-sm text-muted-foreground mt-1">
              ایجاد شده توسط {ticket.creator?.firstName} {ticket.creator?.lastName} در {formatPersianDate(ticket.createdAt)}
            </p>
          </div>          <div className="flex gap-2">
            {canManageTicket && !isClosed && (
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive">بستن تیکت<span className="sr-only">بستن تیکت</span></Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>بستن تیکت</AlertDialogTitle>
                    <AlertDialogDescription>
                      آیا از بستن این تیکت اطمینان دارید؟ پس از بستن تیکت، امکان ارسال پاسخ وجود نخواهد داشت.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>انصراف</AlertDialogCancel>
                    <AlertDialogAction onClick={handleCloseTicket}>بستن تیکت</AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            )}
            {canManageTicket && isClosed && (
              <Button onClick={handleReopenTicket}>بازگشایی تیکت</Button>
            )}
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          <div className="md:col-span-2 space-y-6">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList>
                <TabsTrigger value="details">جزئیات تیکت</TabsTrigger>
                <TabsTrigger value="attachments">
                  فایل‌های پیوست
                  {files.length > 0 && (
                    <span className="mr-2 bg-primary text-primary-foreground text-xs px-1.5 py-0.5 rounded-full">
                      {files.length}
                    </span>
                  )}
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="details" className="pt-4">
                <Card>
                  <CardHeader>
                    <CardTitle>توضیحات</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="whitespace-pre-wrap">{ticket.description}</p>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="attachments" className="pt-4">
                <Card>
                  <CardHeader>
                    <CardTitle>فایل‌های پیوست</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {!isClosed && (
                      <FileUploader
                        ticketId={ticket.id}
                        userId={user?.id || ""}
                        onUploadComplete={handleFileUploadComplete}
                      />
                    )}
                    
                    {isLoadingFiles ? (
                      <div className="py-4 text-center">
                        <div className="w-8 h-8 border-4 border-primary border-solid rounded-full border-t-transparent animate-spin mx-auto"></div>
                        <p className="mt-2 text-sm text-muted-foreground">در حال بارگذاری فایل‌ها...</p>
                      </div>
                    ) : (
                      <FileList
                        files={files}
                        canDelete={canManageTicket && !isClosed}
                        onFileDeleted={handleFileDeleted}
                      />
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold">پاسخ‌ها</h3>
              
              {replies.length === 0 ? (
                <p className="text-muted-foreground text-center py-8">هنوز پاسخی ارسال نشده است.</p>
              ) : (
                <div className="space-y-4">
                  {replies.map((reply) => (
                    <Card key={reply.id}>
                      <CardHeader className="pb-2">
                        <div className="flex justify-between items-center">
                          <div className="font-semibold">
                            {reply.user?.firstName} {reply.user?.lastName}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {formatPersianRelativeTime(reply.createdAt)}
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p className="whitespace-pre-wrap">{reply.message}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>

            {!isClosed && (
              <form onSubmit={handleReplySubmit} className="space-y-4">
                <Textarea
                  placeholder="پاسخ خود را بنویسید..."
                  value={replyMessage}
                  onChange={(e) => setReplyMessage(e.target.value)}
                  rows={4}
                />
                <div className="flex justify-between items-center">
                  <Button type="submit" disabled={isSubmitting || !replyMessage.trim()}>
                    {isSubmitting ? "در حال ارسال..." : "ارسال پاسخ"}
                  </Button>
                </div>
              </form>
            )}
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>جزئیات تیکت</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="text-sm font-medium">وضعیت</div>
                  {canManageTicket && !isClosed ? (
                    <Select
                      value={ticket.statusId}
                      onValueChange={handleStatusChange}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="انتخاب وضعیت" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="open">باز</SelectItem>
                        <SelectItem value="in_progress">در حال بررسی</SelectItem>
                        <SelectItem value="waiting">در انتظار پاسخ</SelectItem>
                      </SelectContent>
                    </Select>
                  ) : (
                    <div className="text-sm">{ticket.status?.name}</div>
                  )}
                </div>

                <div>
                  <div className="text-sm font-medium">اولویت</div>
                  <div className="text-sm">{ticket.priority?.name}</div>
                </div>

                <div>
                  <div className="text-sm font-medium">دسته‌بندی</div>
                  <div className="text-sm">{ticket.category?.name}</div>
                </div>

                <div>
                  <div className="text-sm font-medium">دپارتمان</div>
                  <div className="text-sm">{ticket.department?.name}</div>
                </div>

                {ticket.branch && (
                  <div>
                    <div className="text-sm font-medium">شعبه</div>
                    <div className="text-sm">{ticket.branch.name}</div>
                  </div>
                )}

                <div>
                  <div className="text-sm font-medium">مسئول رسیدگی</div>
                  {canManageTicket && !isClosed ? (                    <Select
                      value={ticket.assigneeId || "unassigned"}
                      onValueChange={handleAssigneeChange}
                      disabled={isLoadingAgents}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="انتخاب کارشناس" />
                      </SelectTrigger>                      <SelectContent>
                        <SelectItem value="unassigned">تعیین نشده</SelectItem>
                        {supportAgents.map((agent) => (
                          <SelectItem key={agent.id} value={agent.id}>
                            {agent.first_name} {agent.last_name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  ) : (
                    <div className="text-sm">
                      {ticket.assignee ? `${ticket.assignee.firstName} ${ticket.assignee.lastName}` : "تعیین نشده"}
                    </div>
                  )}
                </div>

                <div>
                  <div className="text-sm font-medium">آخرین بروزرسانی</div>
                  <div className="text-sm">{formatPersianRelativeTime(ticket.updatedAt)}</div>
                </div>

                {ticket.closedAt && (
                  <div>
                    <div className="text-sm font-medium">تاریخ بسته شدن</div>
                    <div className="text-sm">{formatPersianDate(ticket.closedAt)}</div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
