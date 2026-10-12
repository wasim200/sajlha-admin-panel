import './globals.css';

export const metadata = {
  title: 'سجلها - تطبيق المحاسبة وإدارة الديون الذكي للمحلات',
  description: 'سجلها هو تطبيق المحاسبة الأسهل لإدارة ديون العملاء والفواتير بالذكاء الاصطناعي وبدون إنترنت. مزامنة سحابية آمنة على Google Drive وتنبيهات واتساب و SMS.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="ar" dir="rtl">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Cairo:wght@400;500;600;700;800;900&display=swap" rel="stylesheet" />
      </head>
      <body>{children}</body>
    </html>
  );
}
