"use client";

import { useState } from "react";
import Script from "next/script";

export default function Home() {
  const [validEmails, setValidEmails] = useState<string[][]>([]);
  const [invalidEmails, setInvalidEmails] = useState<string[][]>([]);
  const [view, setView] = useState<"home" | "valid" | "invalid">("home");

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.readAsText(file);

    reader.onload = () => {
      const result = reader.result as string;
      const rows = result.split(/\r?\n/).map((row) => row.split(","));
      const valid: string[][] = [];
      const invalid: string[][] = [];

      rows.forEach((row) => {
        const email = row.join(",").trim();
        if (!email) return;

        const lastChar = email[email.length - 4];
        const secondLastChar = email[email.length - 3];

        if (lastChar === "." || secondLastChar === ".") {
          valid.push(row);
        } else {
          invalid.push(row);
        }
      });

      setValidEmails(valid);
      setInvalidEmails(invalid);
      alert("CSV Parsed ✅");
    };
  };

  const sendEmail = () => {
    const subject = (document.getElementById("subject") as HTMLInputElement)?.value;
    const message = (document.getElementById("message") as HTMLTextAreaElement)?.value;

    (window as any).Email.send({
      Host: "smtp.elasticemail.com",
      Username: "shrutikap022@gmail.com",
      Password: "heyshru@1234",
      To: "shrutikap022@gmail.com",
      From: "shrutikap022@gmail.com",
      Subject: subject,
      Body: message,
    }).then(() =>
      alert(`${validEmails.length} mails sent successfully. `)
    );
  };

  return (
    <>
      <Script src="https://smtpjs.com/v3/smtp.js" strategy="beforeInteractive"></Script>

      {/* Navbar */}
      <header className="sticky top-0 z-50 bg-black/80 backdrop-blur-lg border-b border-white/10 shadow-lg text-white">
        <div className="max-w-6xl mx-auto flex justify-center gap-6 py-3">
          {[
            { key: "home", label: "Home", icon: "🏠" },
            { key: "valid", label: "Valid Emails", icon: "✅" },
            { key: "invalid", label: "Invalid Emails", icon: "❌" },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setView(tab.key as any)}
              className={`flex items-center gap-2 px-5 py-2 rounded-full font-medium tracking-wide transition-all duration-300
          ${view === tab.key
                  ? "bg-gradient-to-r from-purple-500 via-pink-500 to-orange-400 text-white shadow-md scale-105"
                  : "text-white/80 hover:text-white hover:bg-white/10"
                }`}
            >
              <span>{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>
      </header>


      {/* Page Wrapper */}
      <main className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-800 p-6 text-white">
        {view === "home" && (
          <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-10">
            {/* Upload Section */}
            <div className="bg-white/5 border border-white/10 rounded-2xl p-8 shadow-xl backdrop-blur-md hover:shadow-2xl transition-all duration-300">
              <h1 className="text-4xl font-bold mb-6 text-center">📤 Mass-Mail Dispatcher</h1>
              <input
                type="file"
                accept=".csv"
                onChange={handleFileUpload}
                className="block w-full mb-4 px-4 py-3 rounded-lg bg-white/10 border border-white/20 focus:outline-none focus:ring-2 focus:ring-pink-400"
              />
              <button className="w-full bg-gradient-to-r from-purple-500 via-pink-500 to-orange-400 py-3 rounded-full font-semibold hover:opacity-90 transition-all">
                Upload CSV
              </button>
            </div>

            {/* Mail Form */}
            <div className="bg-white/5 border border-white/10 rounded-2xl p-8 shadow-xl backdrop-blur-md hover:shadow-2xl transition-all duration-300">
              <h2 className="text-3xl font-bold mb-6 text-center">📝 Write Your Mail</h2>

              <label className="block mb-2 text-sm font-medium">Subject</label>
              <input
                id="subject"
                placeholder="Enter subject"
                className="w-full mb-4 px-4 py-3 rounded-lg bg-white/10 border border-white/20 focus:outline-none focus:ring-2 focus:ring-pink-400"
              />

              <label className="block mb-2 text-sm font-medium">Message</label>
              <textarea
                id="message"
                rows={4}
                placeholder="Type your message..."
                className="w-full mb-6 px-4 py-3 rounded-lg bg-white/10 border border-white/20 focus:outline-none focus:ring-2 focus:ring-pink-400"
              ></textarea>

              <button
                onClick={sendEmail}
                className="w-full bg-gradient-to-r from-purple-500 via-pink-500 to-orange-400 py-3 rounded-full font-semibold hover:opacity-90 transition-all"
              >
                🚀 Send Mail
              </button>
            </div>
          </div>
        )}

        {/* Valid Emails */}
        {view === "valid" && (
          <div className="max-w-4xl mx-auto bg-white/5 border border-white/10 rounded-2xl p-6 shadow-xl backdrop-blur-md">
            <h2 className="text-2xl font-bold mb-4">✅ Valid Emails ({validEmails.length})</h2>
            <table className="w-full border border-white/20">
              <thead className="bg-white/10">
                <tr>
                  <th className="px-4 py-2 border border-white/20 text-left">Email</th>
                </tr>
              </thead>
              <tbody>
                {validEmails.map((row, i) => (
                  <tr key={i} className="hover:bg-white/10">
                    <td className="px-4 py-2 border border-white/20">{row}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Invalid Emails */}
        {view === "invalid" && (
          <div className="max-w-4xl mx-auto bg-white/5 border border-white/10 rounded-2xl p-6 shadow-xl backdrop-blur-md">
            <h2 className="text-2xl font-bold mb-4">❌ Invalid Emails ({invalidEmails.length})</h2>
            <table className="w-full border border-white/20">
              <thead className="bg-white/10">
                <tr>
                  <th className="px-4 py-2 border border-white/20 text-left">Email</th>
                </tr>
              </thead>
              <tbody>
                {invalidEmails.map((row, i) => (
                  <tr key={i} className="hover:bg-white/10">
                    <td className="px-4 py-2 border border-white/20">{row}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </>
  );
}