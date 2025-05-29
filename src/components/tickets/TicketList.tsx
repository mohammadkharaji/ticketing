import Link from "next/link";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { TicketWithRelations } from "@/services/ticketService";

interface TicketListProps {
  tickets: TicketWithRelations[];
}

function getStatusBadge(statusName?: string) {
  if (!statusName) return <Badge variant="outline">نامشخص</Badge>;
  switch (statusName.toLowerCase()) {
    case "open":
      return <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">باز</Badge>;
    case "in_progress":
    case "in progress":
      return <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">در حال بررسی</Badge>;
    case "resolved":
      return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">حل شده</Badge>;
    case "closed":
      return <Badge variant="outline" className="bg-gray-50 text-gray-700 border-gray-200">بسته شده</Badge>;
    default:
      return <Badge variant="outline">{statusName}</Badge>;
  }
}

function getPriorityBadge(priorityName?: string) {
  if (!priorityName) return <Badge variant="outline">نامشخص</Badge>;
  switch (priorityName.toLowerCase()) {
    case "low":
      return <Badge variant="outline" className="bg-gray-100 text-gray-700 border-gray-300">کم</Badge>;
    case "medium":
      return <Badge variant="outline" className="bg-yellow-100 text-yellow-700 border-yellow-300">متوسط</Badge>;
    case "high":
      return <Badge variant="outline" className="bg-orange-100 text-orange-700 border-orange-300">زیاد</Badge>;
    case "urgent":
      return <Badge variant="destructive" className="bg-red-100 text-red-700 border-red-300">فوری</Badge>;
    default:
      return <Badge variant="outline">{priorityName}</Badge>;
  }
}

export default function TicketList({ tickets }: TicketListProps) {
  // گزینه 6: هشدار راهنما (محدودیت واقعی وجود ندارد)
  const showTicketNumberInfo = tickets.some(t => {
    const num = t.ticketNumber?.toString().slice(-2);
    return num && Number(num) >= 90;
  });

  return (
    <div className="overflow-x-auto">
      {showTicketNumberInfo && (
        <div className="bg-yellow-50 text-yellow-800 p-2 rounded mb-2 text-xs">
          توجه: شماره تیکت روزانه به صورت دو رقمی است اما محدودیتی برای ثبت تیکت وجود ندارد و شماره‌گذاری ادامه می‌یابد.
        </div>
      )}
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>شماره</TableHead>
            <TableHead>شعبه/شهر</TableHead>
            <TableHead>عنوان</TableHead>
            <TableHead>دپارتمان</TableHead>
            <TableHead>ایجاد کننده</TableHead>
            <TableHead>وضعیت</TableHead>
            <TableHead>اولویت</TableHead>
            <TableHead>تاریخ ایجاد</TableHead>
            <TableHead className="text-left">عملیات</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {tickets.map((ticket) => (
            <TableRow key={ticket.id}>
              <TableCell>{ticket.ticketNumber || "N/A"}</TableCell>
              <TableCell>{ticket.branch?.name || "-"}</TableCell>
              <TableCell className="font-medium max-w-xs truncate">
                <Link href={`/tickets/${ticket.id}`} className="hover:underline">
                  {ticket.title}
                </Link>
              </TableCell>
              <TableCell>{ticket.department?.name || "نامشخص"}</TableCell>
              <TableCell>
                {ticket.creator?.firstName} {ticket.creator?.lastName || ""}
              </TableCell>
              <TableCell>{getStatusBadge(ticket.status?.name)}</TableCell>
              <TableCell>{getPriorityBadge(ticket.priority?.name)}</TableCell>
              <TableCell>
                {new Date(ticket.createdAt || "").toLocaleDateString("fa-IR")}
              </TableCell>
              <TableCell className="text-left">
                <Link href={`/tickets/${ticket.id}`} passHref>
                  <Button variant="outline" size="sm">مشاهده</Button>
                </Link>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
