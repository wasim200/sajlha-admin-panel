export const metadata = {
  title: 'لوحة تحكم سجلها الفاخرة | Sajlha Admin',
  description: 'إدارة التراخيص والمشتركين والعمليات',
};

export default function RootLayout({ children }) {
  return (
    <html lang="ar" dir="rtl">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Cairo:wght@300;400;600;700;900&display=swap" rel="stylesheet" />
        <style>{`
          body {
            background-color: #fafafc;
            color: #1e293b;
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }
        `}</style>
      </head>
      <body style={{ fontFamily: "'Cairo', sans-serif" }}>{children}</body>
    </html>
  );
}
