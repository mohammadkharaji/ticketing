// تست نمونه برای سرویس احراز هویت (Jest)
import authService from '../services/authService';

describe('authService', () => {
  it('تست ورود با اطلاعات صحیح', async () => {
    const result = await authService.signIn({ email: 'testuser', password: 'testpass' });
    expect(result).not.toBeNull();
  });
});
