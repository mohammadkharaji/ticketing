#!/bin/bash
# اسکریپت استقرار

echo "در حال build و اجرای برنامه..."
npm run build && pm2 start ecosystem.config.js
