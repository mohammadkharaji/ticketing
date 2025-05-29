// Supabase imports removed. Data fetching for reports will need to be reimplemented with the new backend.

export interface TicketStatusCount {
  status: string;
  count: number;
}

export interface TicketsByDepartment {
  department: string;
  count: number;
}

export interface TicketsByPriority {
  priority: string;
  count: number;
}

export interface TicketsByCategory {
  category: string;
  count: number;
}

export interface TicketsByMonth {
  month: string;
  count: number;
}

export interface TicketResolutionTime {
  avgResolutionTime: number; // در ساعت
  minResolutionTime: number;
  maxResolutionTime: number;
}

export interface UserPerformance {
  userId: string;
  firstName: string;
  lastName: string;
  ticketsAssigned: number;
  ticketsResolved: number;
  avgResolutionTime: number;
}

const reportService = {
  async getTicketsByStatus(
    filters: {
      startDate?: string;
      endDate?: string;
      departmentId?: string;
    } = {}
  ): Promise<TicketStatusCount[]> {
    let query = `
      SELECT 
        ts.name as status,
        COUNT(t.id) as count
      FROM 
        tickets t
      JOIN 
        ticket_statuses ts ON t.status_id = ts.id
      WHERE 1=1
    `;

    const queryParams: any[] = [];
    let paramIndex = 1;

    if (filters.startDate) {
      query += ` AND t.created_at >= $${paramIndex}`;
      queryParams.push(filters.startDate);
      paramIndex++;
    }

    if (filters.endDate) {
      query += ` AND t.created_at <= $${paramIndex}`;
      queryParams.push(filters.endDate);
      paramIndex++;
    }

    if (filters.departmentId) {
      query += ` AND t.department_id = $${paramIndex}`;
      queryParams.push(filters.departmentId);
      paramIndex++;
    }

    query += ` GROUP BY ts.name ORDER BY count DESC`;

    // Logic to fetch tickets by status from the new backend needs to be implemented here.
    console.warn("getTicketsByStatus needs reimplementation without Supabase.", filters);
    // Placeholder response:
    return [];
  },

  async getTicketsByDepartment(
    filters: {
      startDate?: string;
      endDate?: string;
      statusId?: string;
    } = {}
  ): Promise<TicketsByDepartment[]> {
    let query = `
      SELECT 
        d.name as department,
        COUNT(t.id) as count
      FROM 
        tickets t
      JOIN 
        departments d ON t.department_id = d.id
      WHERE 1=1
    `;

    const queryParams: any[] = [];
    let paramIndex = 1;

    if (filters.startDate) {
      query += ` AND t.created_at >= $${paramIndex}`;
      queryParams.push(filters.startDate);
      paramIndex++;
    }

    if (filters.endDate) {
      query += ` AND t.created_at <= $${paramIndex}`;
      queryParams.push(filters.endDate);
      paramIndex++;
    }

    if (filters.statusId) {
      query += ` AND t.status_id = $${paramIndex}`;
      queryParams.push(filters.statusId);
      paramIndex++;
    }

    query += ` GROUP BY d.name ORDER BY count DESC`;

    // Logic to fetch tickets by department from the new backend needs to be implemented here.
    console.warn("getTicketsByDepartment needs reimplementation without Supabase.", filters);
    // Placeholder response:
    return [];
  },

  async getTicketsByPriority(
    filters: {
      startDate?: string;
      endDate?: string;
      departmentId?: string;
    } = {}
  ): Promise<TicketsByPriority[]> {
    let query = `
      SELECT 
        tp.name as priority,
        COUNT(t.id) as count
      FROM 
        tickets t
      JOIN 
        ticket_priorities tp ON t.priority_id = tp.id
      WHERE 1=1
    `;

    const queryParams: any[] = [];
    let paramIndex = 1;

    if (filters.startDate) {
      query += ` AND t.created_at >= $${paramIndex}`;
      queryParams.push(filters.startDate);
      paramIndex++;
    }

    if (filters.endDate) {
      query += ` AND t.created_at <= $${paramIndex}`;
      queryParams.push(filters.endDate);
      paramIndex++;
    }

    if (filters.departmentId) {
      query += ` AND t.department_id = $${paramIndex}`;
      queryParams.push(filters.departmentId);
      paramIndex++;
    }

    query += ` GROUP BY tp.name ORDER BY count DESC`;

    // Logic to fetch tickets by priority from the new backend needs to be implemented here.
    console.warn("getTicketsByPriority needs reimplementation without Supabase.", filters);
    // Placeholder response:
    return [];
  },

  async getTicketsByCategory(
    filters: {
      startDate?: string;
      endDate?: string;
      departmentId?: string;
    } = {}
  ): Promise<TicketsByCategory[]> {
    let query = `
      SELECT 
        tc.name as category,
        COUNT(t.id) as count
      FROM 
        tickets t
      JOIN 
        ticket_categories tc ON t.category_id = tc.id
      WHERE 1=1
    `;

    const queryParams: any[] = [];
    let paramIndex = 1;

    if (filters.startDate) {
      query += ` AND t.created_at >= $${paramIndex}`;
      queryParams.push(filters.startDate);
      paramIndex++;
    }

    if (filters.endDate) {
      query += ` AND t.created_at <= $${paramIndex}`;
      queryParams.push(filters.endDate);
      paramIndex++;
    }

    if (filters.departmentId) {
      query += ` AND t.department_id = $${paramIndex}`;
      queryParams.push(filters.departmentId);
      paramIndex++;
    }

    query += ` GROUP BY tc.name ORDER BY count DESC`;

    // Logic to fetch tickets by category from the new backend needs to be implemented here.
    console.warn("getTicketsByCategory needs reimplementation without Supabase.", filters);
    // Placeholder response:
    return [];
  },

  async getTicketsByMonth(
    filters: {
      year?: number;
      departmentId?: string;
    } = {}
  ): Promise<TicketsByMonth[]> {
    const year = filters.year || new Date().getFullYear();
    
    let query = `
      SELECT 
        TO_CHAR(t.created_at, 'YYYY-MM') as month,
        COUNT(t.id) as count
      FROM 
        tickets t
      WHERE 
        EXTRACT(YEAR FROM t.created_at) = $1
    `;

    const queryParams: any[] = [year];
    let paramIndex = 2;

    if (filters.departmentId) {
      query += ` AND t.department_id = $${paramIndex}`;
      queryParams.push(filters.departmentId);
      paramIndex++;
    }

    query += ` GROUP BY month ORDER BY month`;

    // Logic to fetch tickets by month from the new backend needs to be implemented here.
    console.warn("getTicketsByMonth needs reimplementation without Supabase.", filters);
    // Placeholder response:
    return [];
  },

  async getTicketResolutionTime(
    filters: {
      startDate?: string;
      endDate?: string;
      departmentId?: string;
    } = {}
  ): Promise<TicketResolutionTime> {
    let query = `
      SELECT 
        AVG(EXTRACT(EPOCH FROM (closed_at - created_at)) / 3600) as avg_resolution_time,
        MIN(EXTRACT(EPOCH FROM (closed_at - created_at)) / 3600) as min_resolution_time,
        MAX(EXTRACT(EPOCH FROM (closed_at - created_at)) / 3600) as max_resolution_time
      FROM 
        tickets t
      JOIN 
        ticket_statuses ts ON t.status_id = ts.id
      WHERE 
        t.closed_at IS NOT NULL
        AND ts.is_closed = true
    `;

    const queryParams: any[] = [];
    let paramIndex = 1;

    if (filters.startDate) {
      query += ` AND t.created_at >= $${paramIndex}`;
      queryParams.push(filters.startDate);
      paramIndex++;
    }

    if (filters.endDate) {
      query += ` AND t.created_at <= $${paramIndex}`;
      queryParams.push(filters.endDate);
      paramIndex++;
    }

    if (filters.departmentId) {
      query += ` AND t.department_id = $${paramIndex}`;
      queryParams.push(filters.departmentId);
      paramIndex++;
    }

    // Logic to fetch ticket resolution time from the new backend needs to be implemented here.
    console.warn("getTicketResolutionTime needs reimplementation without Supabase.", filters);
    // Placeholder response:
    return {
      avgResolutionTime: 0,
      minResolutionTime: 0,
      maxResolutionTime: 0,
    };
  },

  async getUserPerformance(
    filters: {
      startDate?: string;
      endDate?: string;
      departmentId?: string;
    } = {}
  ): Promise<UserPerformance[]> {
    let query = `
      SELECT 
        p.id as user_id,
        p.first_name,
        p.last_name,
        COUNT(t.id) as tickets_assigned,
        COUNT(CASE WHEN ts.is_closed = true THEN t.id END) as tickets_resolved,
        AVG(CASE WHEN ts.is_closed = true AND t.closed_at IS NOT NULL 
            THEN EXTRACT(EPOCH FROM (t.closed_at - t.created_at)) / 3600 
            ELSE NULL END) as avg_resolution_time
      FROM 
        profiles p
      LEFT JOIN 
        tickets t ON p.id = t.assignee_id
      LEFT JOIN 
        ticket_statuses ts ON t.status_id = ts.id
      WHERE 
        p.role = 'support'
    `;

    const queryParams: any[] = [];
    let paramIndex = 1;

    if (filters.startDate) {
      query += ` AND (t.created_at >= $${paramIndex} OR t.created_at IS NULL)`;
      queryParams.push(filters.startDate);
      paramIndex++;
    }

    if (filters.endDate) {
      query += ` AND (t.created_at <= $${paramIndex} OR t.created_at IS NULL)`;
      queryParams.push(filters.endDate);
      paramIndex++;
    }

    if (filters.departmentId) {
      query += ` AND (t.department_id = $${paramIndex} OR t.department_id IS NULL)`;
      queryParams.push(filters.departmentId);
      paramIndex++;
    }

    query += ` GROUP BY p.id, p.first_name, p.last_name ORDER BY tickets_resolved DESC`;

    // Logic to fetch user performance data from the new backend needs to be implemented here.
    console.warn("getUserPerformance needs reimplementation without Supabase.", filters);
    // Placeholder response:
    return [];
  }
};

export default reportService;
