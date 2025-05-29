import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { ListFilter } from "lucide-react";

interface SelectOption { id: string; name: string; }

interface TicketFilterProps {
  searchQuery: string;
  onSearchQueryChange: (value: string) => void;
  selectedStatus: string | null;
  onStatusChange: (value: string | null) => void;
  selectedPriority: string | null;
  onPriorityChange: (value: string | null) => void;
  selectedDepartment: string | null;
  onDepartmentChange: (value: string | null) => void;
  statuses: SelectOption[];
  priorities: SelectOption[];
  departments: SelectOption[];
  onReset: () => void;
}

export default function TicketFilter({
  searchQuery,
  onSearchQueryChange,
  selectedStatus,
  onStatusChange,
  selectedPriority,
  onPriorityChange,
  selectedDepartment,
  onDepartmentChange,
  statuses,
  priorities,
  departments,
  onReset,
}: TicketFilterProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
      <div className="relative lg:col-span-2">
        <Input
          placeholder="جستجو (عنوان، شماره تیکت)..."
          value={searchQuery}
          onChange={(e) => onSearchQueryChange(e.target.value)}
          className="pl-10"
        />
      </div>      <Select value={selectedStatus || "all"} onValueChange={(value) => onStatusChange(value === "all" ? null : value)}>
        <SelectTrigger>
          <SelectValue placeholder="همه وضعیت‌ها" />
        </SelectTrigger><SelectContent>
          <SelectItem value="all">همه وضعیت‌ها</SelectItem>
          {statuses.map((status) => (
            <SelectItem key={status.id} value={status.id}>{status.name}</SelectItem>
          ))}
        </SelectContent>
      </Select>      <Select value={selectedPriority || "all"} onValueChange={(value) => onPriorityChange(value === "all" ? null : value)}>
        <SelectTrigger>
          <SelectValue placeholder="همه اولویت‌ها" />
        </SelectTrigger><SelectContent>
          <SelectItem value="all">همه اولویت‌ها</SelectItem>
          {priorities.map((priority) => (
            <SelectItem key={priority.id} value={priority.id}>{priority.name}</SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Button variant="outline" onClick={onReset} className="gap-1">
        <span className="flex items-center gap-1">
          <ListFilter className="w-4 h-4" />
          حذف فیلترها
        </span>
      </Button>      <Select value={selectedDepartment || "all"} onValueChange={(value) => onDepartmentChange(value === "all" ? null : value)}>
        <SelectTrigger className="w-full md:w-[200px]">
          <SelectValue placeholder="همه دپارتمان‌ها" />
        </SelectTrigger><SelectContent>
          <SelectItem value="all">همه دپارتمان‌ها</SelectItem>
          {departments.map((dept) => (
            <SelectItem key={dept.id} value={dept.id}>{dept.name}</SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
