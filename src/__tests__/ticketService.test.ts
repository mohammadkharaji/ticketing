// تست نمونه برای سرویس تیکت (Jest)
import ticketService from '../services/ticketService';
import fetchMock from 'jest-fetch-mock';

describe('ticketService', () => {
  beforeEach(() => {
    fetchMock.resetMocks();
  });

  it('باید تیکت جدید ایجاد کند', async () => {
    // Arrange
    const ticketData = {
      title: 'نمونه تیکت',
      description: 'توضیحات تست',
      statusId: 'pending',
      priorityId: 'medium',
      categoryId: 'cat-1',
      creatorId: 'user-1',
      departmentId: 'dep-1',
    };
    // Mock fetch response
    fetchMock.mockResponseOnce(JSON.stringify({
      id: 'ticket-1',
      title: ticketData.title,
      description: ticketData.description,
      ticketNumber: 1,
      statusId: ticketData.statusId,
      priorityId: ticketData.priorityId,
      categoryId: ticketData.categoryId,
      departmentId: ticketData.departmentId,
      branchId: null,
      creatorId: ticketData.creatorId,
      assigneeId: null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      closedAt: null
    }));
    // Act
    const result = await ticketService.createTicket(ticketData);
    // Assert
    expect(result).not.toBeNull();
    expect(result!.id).toBeDefined();
    expect(result!.title).toBe(ticketData.title);
  });
});
