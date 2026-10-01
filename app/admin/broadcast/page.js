"use client";
import { useState, useEffect } from "react";
import { useToast } from "../components/Toast";
import SkeletonLoader from "../components/SkeletonLoader";

export default function BroadcastPage() {
  const toast = useToast();

  // Version Release State
  const [verLatest, setVerLatest] = useState("2.5.0");
  const [verMin, setVerMin] = useState("2.4.0");
  const [verTitle, setVerTitle] = useState("تحديث تطبيق سجلها الجيل الذهبي 2.5");
  const [verNotesText, setVerNotesText] = useState("");
  const [verDownloadUrl, setVerDownloadUrl] = useState("https://sajlha.vercel.app");
  const [verIsForce, setVerIsForce] = useState(false);
  const [verLoading, setVerLoading] = useState(false);

  // Broadcast State
  const [broadcastTitle, setBroadcastTitle] = useState("");
  const [broadcastBody, setBroadcastBody] = useState("");
  const [broadcastType, setBroadcastType] = useState("release");
  const [broadcastLoading, setBroadcastLoading] = useState(false);

  // APK Upload
  const [apkUploading, setApkUploading] = useState(false);
  const [apkProgress, setApkProgress] = useState(0);

  const [loading, setLoading] = useState(true);

  const getAuth = () => localStorage.getItem("sajlha_admin_pwd") || "";

  useEffect(() => {
    loadVersionInfo();
  }, []);

  const loadVersionInfo = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/public/version-check");
      if (res.ok) {
        const data = await res.json();
        if (data.success && data.versionInfo) {
          const v = data.versionInfo;
          setVerLatest(v.latestVersion || "2.5.0");
          setVerMin(v.minVersion || "2.4.0");
          setVerTitle(v.title || "");
          if (Array.isArray(v.releaseNotes)) setVerNotesText(v.releaseNotes.join("\n"));
          setVerDownloadUrl(v.downloadUrl || "https://sajlha.vercel.app");
          setVerIsForce(Boolean(v.isForceUpdate));
        }
      }
    } catch {}
    setLoading(false);
  };

  const handlePublishVersion = async (e) => {
    e.preventDefault();
    if (!verLatest || !verMin) return;
    setVerLoading(true);
    try {
      const res = await fetch("/api/public/version-check", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: getAuth() },
        body: JSON.stringify({
          latestVersion: verLatest,
          minVersion: verMin,
          title: verTitle,
          releaseNotes: verNotesText.split("\n").filter(Boolean),
          downloadUrl: verDownloadUrl,
          isForceUpdate: verIsForce,
        }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        toast.success(`🚀 تم نشر الإصدار ${verLatest} بنجاح لكافة التجار!`);
      } else {
        toast.error(data.error || "فشل نشر التحديث.");
      }
    } catch {
      toast.error("حدث خطأ في الاتصال بالشبكة.");
    } finally {
      setVerLoading(false);
    }
  };

  const handleSendBroadcast = async (e) => {
    e.preventDefault();
    if (!broadcastTitle || !broadcastBody) return;
    setBroadcastLoading(true);
    try {
      // 1. حفظ الإشعار في السيرفر ليظهر داخل التطبيق
      const res = await fetch("/api/admin/broadcast", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: getAuth() },
        body: JSON.stringify({ title: broadcastTitle, body: broadcastBody, type: broadcastType }),
      });
      const data = await res.json();
      
      if (res.ok && data.success) {
        // 2. إرسال الإشعار كـ Push Notification للموبايلات عبر Firebase
        let fcmMessage = "";
        try {
          const fcmRes = await fetch("/api/notifications/send", {
            method: "POST",
            headers: { "Content-Type": "application/json", Authorization: getAuth() },
            body: JSON.stringify({ 
              title: broadcastTitle, 
              message: broadcastBody,
              is_update: broadcastType === 'update',
              is_offer: broadcastType === 'offer',
              is_feature: broadcastType === 'feature'
            }),
          });
          const fcmData = await fcmRes.json();
          fcmMessage = fcmData.message || fcmData.error || "";
        } catch (fcmError) {
          console.error("FCM Send Error:", fcmError);
          fcmMessage = "حدث خطأ أثناء الاتصال بخادم فايربيس.";
        }

        toast.success(`✅ تم حفظ الإشعار بنجاح! \n (فايربيس: ${fcmMessage})`);
        setBroadcastTitle("");
        setBroadcastBody("");
      } else {
        toast.error(data.error || "فشل إرسال الإشعار.");
      }
    } catch {
      toast.error("حدث خطأ في الاتصال بالشبكة.");
    } finally {
      setBroadcastLoading(false);
    }
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (!file.name.endsWith(".apk")) {
      toast.error("يرجى اختيار ملف بصيغة .apk فقط");
      return;
    }

    setApkUploading(true);
    setApkProgress(0);
    const totalMb = (file.size / (1024 * 1024)).toFixed(1);
    toast.info(`جاري بدء رفع ${file.name} (${totalMb} MB)...`);

    const formData = new FormData();
    formData.append("reqtype", "fileupload");
    formData.append("fileToUpload", file);

    const xhr = new XMLHttpRequest();
    xhr.upload.onprogress = (event) => {
      if (event.lengthComputable) {
        setApkProgress(Math.round((event.loaded / event.total) * 100));
      }
    };
    xhr.onload = () => {
      if (xhr.status === 200) {
        const resultUrl = xhr.responseText.trim();
        if (resultUrl.startsWith("http")) {
          setVerDownloadUrl(resultUrl);
          toast.success(`✅ تم رفع ملف الـ APK بنجاح!`);
          setApkUploading(false);
          return;
        }
      }
      _uploadToTmpFiles(file, totalMb);
    };
    xhr.onerror = () => _uploadToTmpFiles(file, totalMb);
    xhr.open("POST", "https://catbox.moe/user/api.php", true);
    xhr.send(formData);
  };

  const _uploadToTmpFiles = (file, totalMb) => {
    const formData = new FormData();
    formData.append("file", file);
    const xhr = new XMLHttpRequest();
    xhr.upload.onprogress = (event) => {
      if (event.lengthComputable) {
        setApkProgress(Math.round((event.loaded / event.total) * 100));
      }
    };
    xhr.onload = () => {
      if (xhr.status === 200) {
        try {
          const res = JSON.parse(xhr.responseText);
          if (res.status === "success" && res.data?.url) {
            const directUrl = res.data.url.replace("tmpfiles.org/", "tmpfiles.org/dl/");
            setVerDownloadUrl(directUrl);
            toast.success("✅ تم رفع الملف بنجاح!");
            setApkUploading(false);
            return;
          }
        } catch {}
      }
      toast.error("فشل الرفع. ضع الرابط يدوياً.");
      setApkUploading(false);
    };
    xhr.onerror = () => {
      toast.error("حدث خطأ في الشبكة أثناء الرفع.");
      setApkUploading(false);
    };
    xhr.open("POST", "https://tmpfiles.org/api/v1/upload", true);
    xhr.send(formData);
  };

  if (loading) {
    return (
      <div className="grid-1-1">
        <SkeletonLoader type="card" />
        <SkeletonLoader type="card" />
      </div>
    );
  }

  return (
    <div className="grid-1-1">
      {/* Version Release Card */}
      <div className="dashboard-card">
        <div className="card-header">
          <h3 className="card-title">
            <span className="card-title-accent" />
            🚀 إطلاق إصدار جديد
          </h3>
        </div>
        <form onSubmit={handlePublishVersion}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 16 }}>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">أحدث إصدار:</label>
              <input type="text" className="form-input" value={verLatest} onChange={(e) => setVerLatest(e.target.value)} placeholder="2.6.0" required />
            </div>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">الحد الأدنى:</label>
              <input type="text" className="form-input" value={verMin} onChange={(e) => setVerMin(e.target.value)} placeholder="2.4.0" required />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">عنوان التحديث:</label>
            <input type="text" className="form-input" value={verTitle} onChange={(e) => setVerTitle(e.target.value)} placeholder="تحديث جديد لتطبيق سجلها" required />
          </div>

          {/* APK Upload */}
          <div className="form-group">
            <label className="form-label">📁 رفع ملف التطبيق (.apk):</label>
            <div className="upload-area">
              <input type="file" accept=".apk" onChange={handleFileUpload} disabled={apkUploading} style={{ fontSize: "13px" }} />
              {apkUploading && (
                <div className="upload-progress-bar">
                  <div className="upload-progress-fill" style={{ width: `${apkProgress}%` }} />
                </div>
              )}
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">رابط التحميل:</label>
            <input type="url" className="form-input" value={verDownloadUrl} onChange={(e) => setVerDownloadUrl(e.target.value)} placeholder="https://sajlha.vercel.app" required />
          </div>

          <div className="form-group">
            <label className="form-label">مميزات التحديث (كل ميزة في سطر):</label>
            <textarea className="form-textarea" value={verNotesText} onChange={(e) => setVerNotesText(e.target.value)} rows={3} />
          </div>

          <div className="form-group">
            <label className="form-check">
              <input type="checkbox" checked={verIsForce} onChange={(e) => setVerIsForce(e.target.checked)} />
              <span className="form-check-label" style={{ color: verIsForce ? "var(--color-danger)" : "inherit" }}>
                {verIsForce ? "⚠️ تحديث إجباري (Force Update)" : "تحديث اختياري (Optional)"}
              </span>
            </label>
          </div>

          <button type="submit" className="btn-primary btn-danger" disabled={verLoading} style={{ width: "100%", background: "#9E2A2B", color: "#fff", borderColor: "#9E2A2B" }}>
            {verLoading ? "جاري نشر التحديث..." : "🚀 إطلاق الإصدار الجديد"}
          </button>
        </form>
      </div>

      {/* Broadcast Card */}
      <div className="dashboard-card">
        <div className="card-header">
          <h3 className="card-title">
            <span className="card-title-accent" />
            📡 إرسال إشعار للتجار
          </h3>
        </div>
        <form onSubmit={handleSendBroadcast}>
          <div className="form-group">
            <label className="form-label">عنوان الإشعار:</label>
            <input type="text" className="form-input" value={broadcastTitle} onChange={(e) => setBroadcastTitle(e.target.value)} placeholder="مثال: 🎉 ميزة جديدة أو خصم خاص!" required />
          </div>
          <div className="form-group">
            <label className="form-label">نص الإشعار:</label>
            <textarea className="form-textarea" value={broadcastBody} onChange={(e) => setBroadcastBody(e.target.value)} placeholder="اكتب نص الإشعار بالتفصيل..." required rows={5} />
          </div>
          <div className="form-group">
            <label className="form-label">نوع الإشعار:</label>
            <select className="form-select" value={broadcastType} onChange={(e) => setBroadcastType(e.target.value)}>
              <option value="release">🚀 تحديث إصدار جديد</option>
              <option value="offer">🎁 عرض وتخفيض خاص</option>
              <option value="info">ℹ️ إعلان عام</option>
              <option value="alert">⚠️ تنبيه عاجل</option>
            </select>
          </div>
          <button type="submit" className="btn-primary" disabled={broadcastLoading} style={{ width: "100%" }}>
            {broadcastLoading ? "جاري الإرسال..." : "📡 إرسال الإشعار لكافة التجار"}
          </button>
        </form>
      </div>
    </div>
  );
}
