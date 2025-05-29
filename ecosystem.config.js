module.exports = {
  apps: [{
    name: 'nextjs',
    script: 'next',
    args: 'start',
    autorestart: true,
    env: {
      NODE_ENV: 'production',
      // مقادیر زیر را با اطلاعات واقعی پایگاه داده خود جایگزین کنید
      DB_HOST: 'your_db_host', 
      DB_USER: 'your_db_user',
      DB_PASSWORD: 'your_db_password',
      DB_NAME: 'your_db_name',
      // سایر متغیرهای محیطی مورد نیاز را در اینجا اضافه کنید
    },
    // ری‌استارت برنامه هر روز در نیمه‌شب
    cron_restart: '0 0 * * *',
    // اجرای اسکریپت پشتیبان‌گیری پس از به‌روزرسانی برنامه
    // مطمئن شوید که ts-node به صورت سراسری یا در وابستگی‌های پروژه نصب شده است
    post_update: ['ts-node ./scripts/backup.ts']
  }]
};
