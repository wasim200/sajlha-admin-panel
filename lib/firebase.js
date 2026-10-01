import * as admin from 'firebase-admin';

if (!admin.apps?.length) {
  try {
    // حاول قراءة المفتاح من متغيرات البيئة (سيقوم المستخدم بإضافته لاحقاً في Vercel)
    const serviceAccount = process.env.FIREBASE_SERVICE_ACCOUNT 
      ? JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT)
      : null;

    if (serviceAccount) {
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
      });
      console.log('Firebase Admin SDK initialized successfully');
    } else {
      console.warn('Firebase Admin SDK not initialized: Missing FIREBASE_SERVICE_ACCOUNT environment variable.');
    }
  } catch (error) {
    console.error('Firebase Admin SDK initialization error', error.stack);
  }
}

export default admin;
