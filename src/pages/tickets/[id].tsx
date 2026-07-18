import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import MainLayout from "@/components/layouts/MainLayout";
import { useAuth } from "@/contexts/AuthContext";
import ticketService, { TicketReply, TicketWithRelations } from "@/services/ticketService";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";
import { ArrowRight, MessageSquare, CheckCircle, RotateCcw } from "lucide-react";

const statusLabel: Record<string, string> = {
  open: "باز",
  in_progress: "در حال بررسی",
  waiting: "در انتظار",
  closed: "بسته",
  resolved: "حل‌شده",
};

export default function TicketDetailPage() {
  const router = useRouter();
  const { id } = router.query;
  const { user, isAdmin, isDepartmentManager } = useAuth();
  const [ticket, setTicket] = useState<TicketWithRelations | null>(null);
  const [replies, setReplies] = useState<TicketReply[]>([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);

  const load = async () => {
    if (!id || typeof id !== "string") return;
    setLoading(true);
    try {
      const t = await ticketService.getTicketById(id);
      if (!t) {
        toast({ title: "تیکت یافت نشد", variant: "destructive" });
        router.push("/tickets");
        return;
      }
      setTicket(t);
      setReplies(t.replies || []);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const sendReply = async () => {
    if (!ticket || !message.trim() || !user) return;
    setSending(true);
    try {
      const reply = await ticketService.addReply({
        ticketId: ticket.id,
        userId: user.id,
        message: message.trim(),
      });
      setReplies((prev) => [...prev, reply]);
      setMessage("");
      toast({ title: "پاسخ ارسال شد" });
      await load();
    } catch {
      toast({ title: "خطا در ارسال پاسخ", variant: "destructive" });
    } finally {
      setSending(false);
    }
  };

  const changeStatus = async (statusId: string) => {
    if (!ticket) return;
    try {
      if (statusId === "closed") await ticketService.closeTicket(ticket.id);
      else if (statusId === "open" && ticket.statusId === "closed")
        await ticketService.reopenTicket(ticket.id);
      else await ticketService.updateTicket(ticket.id, { statusId } as any);
      toast({ title: "وضعیت به‌روز شد" });
      await load();
    } catch {
      toast({ title: "خطا در تغییر وضعیت", variant: "destructive" });
    }
  };

  if (loading) {
    return (
      <MainLayout>
        <div className="flex justify-center py-20">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent" />
        </div>
      </MainLayout>
    );
  }

  if (!ticket) return null;

  return (
    <MainLayout>
      <Head>
        <title>{ticket.title} | تیکت‌یار</title>
      </Head>
      <div className="mx-auto max-w-3xl space-y-6">
        <div className="flex flex-wrap items-start gap-3">
          <Button
            variant="ghost"
            size="icon"
            className="rounded-xl"
            onClick={() => router.push("/tickets")}
          >
            <ArrowRight className="h-5 w-5" />
          </Button>
          <div className="min-w-0 flex-1">
            <p className="font-mono text-xs text-muted-foreground">
              #{ticket.ticketNumber}
            </p>
            <h1 className="text-2xl font-bold leading-tight">{ticket.title}</h1>
            <div className="mt-2 flex flex-wrap gap-2">
              <Badge className="rounded-full" variant="secondary">
                {statusLabel[ticket.statusId] || ticket.statusId}
              </Badge>
              <Badge variant="outline" className="rounded-full">
                {ticket.priority?.name || ticket.priorityId}
              </Badge>
              <Badge variant="outline" className="rounded-full">
                {ticket.department?.name || ticket.departmentId}
              </Badge>
            </div>
          </div>
          {(isAdmin || isDepartmentManager) && (
            <Select value={ticket.statusId} onValueChange={changeStatus}>
              <SelectTrigger className="w-40 rounded-xl">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="open">باز</SelectItem>
                <SelectItem value="in_progress">در حال بررسی</SelectItem>
                <SelectItem value="waiting">در انتظار</SelectItem>
                <SelectItem value="closed">بسته</SelectItem>
              </SelectContent>
            </Select>
          )}
        </div>

        <Card className="rounded-2xl">
          <CardHeader>
            <CardTitle className="text-base">شرح درخواست</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm leading-relaxed">
            <p className="whitespace-pre-wrap">{ticket.description}</p>
            <p className="text-xs text-muted-foreground">
              ایجاد:{" "}
              {ticket.createdAt
                ? new Date(ticket.createdAt).toLocaleString("fa-IR")
                : "—"}{" "}
              ·{" "}
              {ticket.creator
                ? `${ticket.creator.firstName} ${ticket.creator.lastName}`
                : "کاربر"}
            </p>
          </CardContent>
        </Card>

        <div className="flex flex-wrap gap-2">
          {ticket.statusId !== "closed" && (
            <Button
              variant="outline"
              className="gap-2 rounded-xl"
              onClick={() => changeStatus("closed")}
            >
              <CheckCircle className="h-4 w-4" />
              بستن تیکت
            </Button>
          )}
          {ticket.statusId === "closed" && (
            <Button
              variant="outline"
              className="gap-2 rounded-xl"
              onClick={() => changeStatus("open")}
            >
              <RotateCcw className="h-4 w-4" />
              بازگشایی
            </Button>
          )}
        </div>

        <Card className="rounded-2xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <MessageSquare className="h-4 w-4" />
              گفتگو ({replies.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {replies.length === 0 ? (
              <p className="text-sm text-muted-foreground">هنوز پاسخی ثبت نشده است.</p>
            ) : (
              <div className="space-y-3">
                {replies.map((r) => (
                  <div
                    key={r.id}
                    className="rounded-xl border bg-muted/30 p-3 text-sm"
                  >
                    <div className="mb-1 flex justify-between text-xs text-muted-foreground">
                      <span>
                        {r.user
                          ? `${r.user.firstName} ${r.user.lastName}`
                          : "کاربر"}
                      </span>
                      <span>
                        {r.createdAt
                          ? new Date(r.createdAt).toLocaleString("fa-IR")
                          : ""}
                      </span>
                    </div>
                    <p className="whitespace-pre-wrap">{r.message}</p>
                  </div>
                ))}
              </div>
            )}

            {ticket.statusId !== "closed" && (
              <div className="space-y-2 border-t pt-4">
                <Textarea
                  className="min-h-[100px] rounded-xl"
                  placeholder="پاسخ خود را بنویسید..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  disabled={sending}
                />
                <Button
                  className="rounded-xl"
                  onClick={sendReply}
                  disabled={sending || !message.trim()}
                >
                  {sending ? "در حال ارسال..." : "ارسال پاسخ"}
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
}
