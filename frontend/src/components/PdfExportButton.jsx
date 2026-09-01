import React, { useState } from 'react';
import { Download, Loader2, CheckCircle } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function PdfExportButton({ resumeRef, fileName = "Resume" }) {
  const [isExporting, setIsExporting] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  const handleDownload = async () => {
    if (!resumeRef || !resumeRef.current) {
      window.print();
      return;
    }

    try {
      setIsExporting(true);
      setDownloadSuccess(false);

      // Dynamically import html2pdf for clean browser bundling
      const html2pdfModule = await import('html2pdf.js');
      const html2pdf = html2pdfModule.default || html2pdfModule;

      const element = resumeRef.current;
      const cleanFileName = `${fileName.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_resume.pdf`;

      const opt = {
        margin: [8, 8, 8, 8],
        filename: cleanFileName,
        image: { type: 'png' },
        html2canvas: {
          scale: 4,
          useCORS: true,
          allowTaint: true,
          letterRendering: true,
          logging: false,
          windowWidth: 794,       // A4 width at 96 dpi — forces correct layout during capture
          backgroundColor: '#ffffff'
        },
        jsPDF: {
          unit: 'mm',
          format: 'a4',
          orientation: 'portrait',
          compress: true
        }
      };

      await html2pdf().set(opt).from(element).save();

      // Trigger celebratory confetti
      try {
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.85 }
        });
      } catch (e) {
        // Confetti is purely decorative
      }

      setDownloadSuccess(true);
      setTimeout(() => setDownloadSuccess(false), 4000);
    } catch (err) {
      console.warn("Direct html2pdf export error, falling back to print dialog:", err);
      window.print();
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <button
      id="btn-download-pdf"
      type="button"
      onClick={handleDownload}
      disabled={isExporting}
      className={`inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm shadow-md transition-all active:scale-98 ${
        downloadSuccess
          ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-600/25'
          : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-600/25'
      } disabled:opacity-50 disabled:cursor-not-allowed`}
    >
      {isExporting ? (
        <>
          <Loader2 className="w-4 h-4 animate-spin" />
          <span>Generating PDF...</span>
        </>
      ) : downloadSuccess ? (
        <>
          <CheckCircle className="w-4 h-4" />
          <span>PDF Downloaded!</span>
        </>
      ) : (
        <>
          <Download className="w-4 h-4" />
          <span>Download PDF</span>
        </>
      )}
    </button>
  );
}
