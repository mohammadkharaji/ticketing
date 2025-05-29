import React, { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import MainLayout from "@/components/layouts/MainLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { TicketBarChart, TicketLineChart, TicketPieChart } from "@/components/ui/chart";
import reportService, { 
  TicketStatusCount, 
  TicketsByDepartment,
  TicketsByPriority,
  TicketsByCategory,
  TicketsByMonth,
  TicketResolutionTime,
  UserPerformance
} from "@/services/reportService";

export default function ReportsPage() {
  const { userProfile, isDepartmentManager } = useAuth();
  const [departmentFilter, setDepartmentFilter] = useState<string>("");
  const [dateRange, setDateRange] = useState<{
    startDate: string;
    endDate: string;
  }>({
    startDate: new Date(new Date().setMonth(new Date().getMonth() - 1)).toISOString(),
    endDate: new Date().toISOString(),
  });

  const [statusData, setStatusData] = useState<TicketStatusCount[]>([]);
  const [departmentData, setDepartmentData] = useState<TicketsByDepartment[]>([]);
  const [priorityData, setPriorityData] = useState<TicketsByPriority[]>([]);
  const [monthlyData, setMonthlyData] = useState<TicketsByMonth[]>([]);
  const [resolutionTime, setResolutionTime] = useState<TicketResolutionTime>({
    avgResolutionTime: 0,
    minResolutionTime: 0,
    maxResolutionTime: 0,
  });
  const [performanceData, setPerformanceData] = useState<UserPerformance[]>([]);

  useEffect(() => {
    if (!userProfile) return;

    const fetchData = async () => {
      try {
        const filters = {
          startDate: dateRange.startDate,
          endDate: dateRange.endDate,
          departmentId: (isDepartmentManager ? userProfile.departmentId : departmentFilter) || undefined,
        };

        const [
          statusCounts,
          departmentCounts,
          priorityCounts,
          monthlyStats,
          resolution,
          performance,
        ] = await Promise.all([
          reportService.getTicketsByStatus(filters),
          reportService.getTicketsByDepartment(filters),
          reportService.getTicketsByPriority(filters),
          reportService.getTicketsByMonth({ year: new Date().getFullYear() }),
          reportService.getTicketResolutionTime(filters),
          reportService.getUserPerformance(filters),
        ]);

        setStatusData(statusCounts);
        setDepartmentData(departmentCounts);
        setPriorityData(priorityCounts);
        setMonthlyData(monthlyStats);
        setResolutionTime(resolution);
        setPerformanceData(performance);
      } catch (error) {
        console.error("Error fetching report data:", error);
      }
    };

    fetchData();
  }, [userProfile, departmentFilter, dateRange, isDepartmentManager]);

  const statusChartData = {
    labels: statusData.map(item => item.status),
    datasets: [{
      label: 'تعداد تیکت‌ها',
      data: statusData.map(item => item.count),
      backgroundColor: [
        'rgba(75, 192, 192, 0.6)',
        'rgba(54, 162, 235, 0.6)',
        'rgba(255, 206, 86, 0.6)',
        'rgba(153, 102, 255, 0.6)',
      ],
    }],
  };

  const departmentChartData = {
    labels: departmentData.map(item => item.department),
    datasets: [{
      label: 'تعداد تیکت‌ها',
      data: departmentData.map(item => item.count),
      backgroundColor: 'rgba(54, 162, 235, 0.6)',
    }],
  };

  const priorityChartData = {
    labels: priorityData.map(item => item.priority),
    datasets: [{
      label: 'تعداد تیکت‌ها',
      data: priorityData.map(item => item.count),
      backgroundColor: [
        'rgba(255, 99, 132, 0.6)',
        'rgba(255, 206, 86, 0.6)',
        'rgba(75, 192, 192, 0.6)',
      ],
    }],
  };

  const monthlyChartData = {
    labels: monthlyData.map(item => item.month),
    datasets: [{
      label: 'تعداد تیکت‌ها',
      data: monthlyData.map(item => item.count),
      borderColor: 'rgb(75, 192, 192)',
      tension: 0.1,
      fill: false,
    }],
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">گزارش‌ها</h1>
          {!isDepartmentManager && (
            <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="انتخاب دپارتمان" />
              </SelectTrigger>              <SelectContent>
                <SelectItem value="all">همه دپارتمان‌ها</SelectItem>
                {/* TODO: Add department list */}
              </SelectContent>
            </Select>
          )}
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>وضعیت تیکت‌ها</CardTitle>
            </CardHeader>
            <CardContent>
              <TicketPieChart data={statusChartData} height={300} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>تیکت‌ها بر اساس دپارتمان</CardTitle>
            </CardHeader>
            <CardContent>
              <TicketBarChart data={departmentChartData} height={300} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>تیکت‌ها بر اساس اولویت</CardTitle>
            </CardHeader>
            <CardContent>
              <TicketPieChart data={priorityChartData} height={300} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>روند تیکت‌ها در ماه‌های اخیر</CardTitle>
            </CardHeader>
            <CardContent>
              <TicketLineChart data={monthlyChartData} height={300} />
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>زمان رسیدگی به تیکت‌ها</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold">
                  {Math.round(resolutionTime.avgResolutionTime)} ساعت
                </div>
                <div className="text-sm text-muted-foreground">میانگین زمان رسیدگی</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">
                  {Math.round(resolutionTime.minResolutionTime)} ساعت
                </div>
                <div className="text-sm text-muted-foreground">کمترین زمان رسیدگی</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">
                  {Math.round(resolutionTime.maxResolutionTime)} ساعت
                </div>
                <div className="text-sm text-muted-foreground">بیشترین زمان رسیدگی</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>عملکرد کارشناسان</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr>
                    <th className="text-right py-2">نام کارشناس</th>
                    <th className="text-center py-2">تیکت‌های اختصاص داده شده</th>
                    <th className="text-center py-2">تیکت‌های بسته شده</th>
                    <th className="text-center py-2">میانگین زمان رسیدگی (ساعت)</th>
                  </tr>
                </thead>
                <tbody>
                  {performanceData.map((user) => (
                    <tr key={user.userId}>
                      <td className="py-2">{user.firstName} {user.lastName}</td>
                      <td className="text-center">{user.ticketsAssigned}</td>
                      <td className="text-center">{user.ticketsResolved}</td>
                      <td className="text-center">{Math.round(user.avgResolutionTime)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
}
