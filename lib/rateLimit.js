/**
 * نظام حماية Rate Limiting بسيط يعمل في ذاكرة Serverless
 * يحد من عدد الطلبات لكل IP لمنع هجمات Brute Force والإفراط في الاستخدام
 * 
 * ملاحظة: في بيئة Vercel Serverless، الذاكرة مؤقتة لكل instance.
 * هذا كافٍ لمنع الهجمات البسيطة. للحماية المتقدمة يُستخدم Redis.
 */

import { NextResponse } from 'next/server';

// مخزن مؤقت لتتبع الطلبات لكل IP
const rateLimitStore = new Map();

// تنظيف السجلات المنتهية كل 5 دقائق
const CLEANUP_INTERVAL = 5 * 60 * 1000;
let lastCleanup = Date.now();

function cleanup(windowMs) {
  const now = Date.now();
  if (now - lastCleanup < CLEANUP_INTERVAL) return;
  lastCleanup = now;
  
  for (const [key, data] of rateLimitStore.entries()) {
    if (now - data.windowStart > windowMs) {
      rateLimitStore.delete(key);
    }
  }
}

/**
 * فحص وتطبيق Rate Limiting
 * @param {Request} request - الطلب الوارد
 * @param {Object} options - خيارات التحكم
 * @param {number} options.maxRequests - أقصى عدد طلبات مسموح
 * @param {number} options.windowMs - نافذة الوقت بالمللي ثانية
 * @param {string} options.keyPrefix - بادئة لتمييز أنواع الطلبات المختلفة
 * @returns {{ allowed: boolean, remaining: number, retryAfterMs: number }}
 */
export function checkRateLimit(request, options = {}) {
  const {
    maxRequests = 10,
    windowMs = 15 * 60 * 1000, // 15 دقيقة افتراضياً
    keyPrefix = 'default',
  } = options;

  // استخراج IP من headers (Vercel يمرر IP الحقيقي عبر x-forwarded-for)
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim()
            || request.headers.get('x-real-ip')
            || 'unknown';

  const key = `${keyPrefix}:${ip}`;
  const now = Date.now();

  // تنظيف دوري
  cleanup(windowMs);

  // جلب أو إنشاء سجل جديد
  let record = rateLimitStore.get(key);
  
  if (!record || (now - record.windowStart > windowMs)) {
    // بداية نافذة جديدة
    record = { count: 0, windowStart: now };
    rateLimitStore.set(key, record);
  }

  record.count++;

  const remaining = Math.max(0, maxRequests - record.count);
  const retryAfterMs = record.windowStart + windowMs - now;

  return {
    allowed: record.count <= maxRequests,
    remaining,
    retryAfterMs: record.count > maxRequests ? retryAfterMs : 0,
  };
}

/**
 * إنشاء Response موحد لحالة تجاوز الحد
 * @param {number} retryAfterMs - وقت الانتظار قبل إعادة المحاولة بالمللي ثانية
 * @returns {Response}
 */
export function rateLimitResponse(retryAfterMs) {
  const retryAfterSec = Math.ceil(retryAfterMs / 1000);
  
  return NextResponse.json(
    { 
      error: `لقد تجاوزت الحد المسموح من الطلبات. يرجى الانتظار ${retryAfterSec} ثانية ثم المحاولة مرة أخرى.`,
      retry_after: retryAfterSec,
    },
    { 
      status: 429,
      headers: {
        'Retry-After': String(retryAfterSec),
        'X-RateLimit-Remaining': '0',
      },
    }
  );
}

