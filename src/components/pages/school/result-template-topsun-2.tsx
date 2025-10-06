"use client";

import React, { useRef, useState } from "react";
import { Button } from "@/components/ui/button";

// Note: html2canvas and jspdf are dynamically imported inside the handler to avoid
// SSR/runtime issues that can happen when these libraries are imported at module top-level.
// Make sure to install them in your project: `npm install html2canvas jspdf`.

export default function ResultSheet() {
  const printRef = useRef<HTMLDivElement | null>(null);
  const [pdfLoading, setPdfLoading] = useState(false);
  const [showLogo, setShowLogo] = useState(true);

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadPDF = async () => {
    if (!printRef.current) return;

    setPdfLoading(true);
    try {
      // dynamic import to avoid SSR import issues
      const html2canvasModule = await import("html2canvas");
      const html2canvas = html2canvasModule?.default ?? html2canvasModule;

      const jspdfModule = await import("jspdf");
      // jspdf can be exported under different shapes depending on bundler/version
      const jsPDF = jspdfModule?.jsPDF ?? jspdfModule?.default ?? jspdfModule;

      if (!html2canvas || !jsPDF) throw new Error("Required PDF libraries not available");

      const canvas = await html2canvas(printRef.current as HTMLDivElement, {
        scale: 2,
        useCORS: true,
        logging: false,
      });

      const imgData = canvas.toDataURL("image/png");

      // @ts-ignore - support multiple module export shapes
      const pdf = new (jsPDF as any)({ orientation: "portrait", unit: "pt", format: "a4" });

      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
      pdf.save("result-sheet.pdf");
    } catch (err) {
      // If something goes wrong, fallback to native print and inform the user
      // (We avoid throwing raw errors to the UI; console.error for debugging.)
      // eslint-disable-next-line no-console
      console.error("PDF generation failed", err);
      // Friendly message for the user
      // Note: in a production app consider using a toast notification instead of alert.
      alert("Could not generate PDF automatically. Please use the Print button as a fallback.");
    } finally {
      setPdfLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen bg-white p-6 font-[Times_New_Roman] text-black print:bg-white print:p-4 print:text-black">
      {/* Action buttons (hidden on print) */}
      <div className="mb-4 flex justify-end gap-2 print:hidden">
        <Button onClick={handlePrint} className="bg-blue-600 text-white hover:bg-blue-700">
          Print
        </Button>
        <Button
          onClick={handleDownloadPDF}
          disabled={pdfLoading}
          className="bg-green-600 text-white hover:bg-green-700"
        >
          {pdfLoading ? "Generating PDF..." : "Download PDF"}
        </Button>
      </div>

      {/* Printable area */}
      <div
        ref={printRef}
        className="relative z-10 mx-auto max-w-[900px] border border-black bg-white p-6 print:shadow-none"
      >
        {/* Watermark: use plain <img> with onError fallback to avoid next/image loader/runtime issues */}
        {showLogo && (
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center opacity-10 select-none">
            <img
              src="/logo.png"
              alt="School Logo Watermark"
              className="max-w-[40%] object-contain"
              onError={() => setShowLogo(false)}
            />
          </div>
        )}

        {!showLogo && (
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center opacity-5 select-none">
            <svg width="400" height="400" viewBox="0 0 400 400" xmlns="http://www.w3.org/2000/svg">
              <text x="50%" y="50%" dominantBaseline="middle" textAnchor="middle" fontSize="36">
                SCHOOL
              </text>
            </svg>
          </div>
        )}

        {/* Header Section */}
        <div className="relative z-10 mb-4 text-sm leading-relaxed">
          <div className="mb-2 flex justify-between">
            <div>CONTINUOUS ASSESSMENTS FOR................................................</div>
            <div>TERM................................................</div>
          </div>
          <div className="mb-2 flex justify-between">
            <div>
              NAME....................................................................................
            </div>
            <div>CLASS................................................</div>
          </div>
          <div className="mb-2 flex justify-between">
            <div>ATTENDANCE................................................</div>
            <div>NO IN CLASS................................................</div>
          </div>
          <div className="flex justify-between">
            <div>COGNITIVE ABILITY................................................</div>
            <div>DAYS OUT OF......................DAYS</div>
          </div>
        </div>

        {/* Subjects Table */}
        <table className="relative z-10 w-full border-collapse border border-black text-xs">
          <thead>
            <tr>
              <th rowSpan={2} className="w-[150px] border border-black p-1">
                SUBJECTS
              </th>
              <th colSpan={5} className="border border-black p-1">
                (a) (b) (c) (d) (e)
              </th>
              <th rowSpan={2} className="border border-black p-1">
                Class Highest Mark
              </th>
              <th rowSpan={2} className="border border-black p-1">
                Class Lowest Mark
              </th>
              <th rowSpan={2} className="border border-black p-1">
                Class Ave. Mark
              </th>
              <th rowSpan={2} className="border border-black p-1">
                Overall Position
              </th>
              <th rowSpan={2} className="border border-black p-1">
                Grade
              </th>
              <th rowSpan={2} className="border border-black p-1">
                Teacher's Signature
              </th>
            </tr>
            <tr>
              <th className="border border-black p-1">1st Test 20</th>
              <th className="border border-black p-1">2nd Test 20</th>
              <th className="border border-black p-1">Exam Score 60</th>
              <th className="border border-black p-1">Total Score 100</th>
              <th className="border border-black p-1">Last Term Cumul / Present Cumul</th>
            </tr>
          </thead>
          <tbody>
            {[
              "Mathematics",
              "English",
              "Yoruba",
              "Economics",
              "Geography",
              "Biology",
              "Marketing",
              "Chemistry/Lit.-in-English",
              "Phy./C.R.S./Acct",
              "Agric/Food & Nut.",
              "Government",
              "Commerce",
              "I.C.T.",
              "Civic Education",
            ].map((subject) => (
              <tr key={subject}>
                <td className="border border-black p-1">{subject}</td>
                {[...Array(5)].map((_, i) => (
                  <td key={i} className="border border-black p-1"></td>
                ))}
                {[...Array(6)].map((_, i) => (
                  <td key={i} className="border border-black p-1"></td>
                ))}
              </tr>
            ))}

            <tr>
              <td className="border border-black p-1 font-semibold">Total</td>
              {[...Array(11)].map((_, i) => (
                <td key={i} className="border border-black p-1"></td>
              ))}
            </tr>

            <tr>
              <td className="border border-black p-1 font-semibold">Percentage</td>
              {[...Array(11)].map((_, i) => (
                <td key={i} className="border border-black p-1"></td>
              ))}
            </tr>
          </tbody>
        </table>

        {/* Effective Areas and Psychomotor */}
        <div className="relative z-10 mt-6 grid grid-cols-2 gap-4">
          <div className="border border-black p-2 text-xs">
            <div className="border-b border-black text-center font-semibold">EFFECTIVE AREAS</div>
            {[
              "Punctuality",
              "Neatness",
              "Politeness",
              "Honesty",
              "Relationship with Others",
              "Leadership",
              "Emotional Stability",
              "Health",
              "Attitude to School Work",
              "Attentiveness",
              "Perseverance",
            ].map((area) => (
              <div
                key={area}
                className="flex justify-between border-b border-dotted border-gray-400"
              >
                <span>{area}</span>
                <span className="pr-2">...........</span>
              </div>
            ))}
          </div>

          <div className="border border-black p-2 text-xs">
            <div className="border-b border-black text-center font-semibold">
              PSYCHOMOTOR SKILLS
            </div>
            {[
              "Creativity",
              "Verbal Fluency",
              "Games",
              "Sports",
              "Handing Tools",
              "Drawing & Painting",
              "Musical Skills",
            ].map((skill) => (
              <div
                key={skill}
                className="flex justify-between border-b border-dotted border-gray-400"
              >
                <span>{skill}</span>
                <span className="pr-2">...........</span>
              </div>
            ))}
            <div className="mt-2 text-center font-semibold">
              Award Prize Won ......................................................
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="relative z-10 mt-6 grid grid-cols-2 gap-4 text-xs">
          <div>
            <div>Date of Vacation................................................</div>
            <div>Date of Resumption..............................................</div>
            <div>Class Teacher's Comment.......................................</div>
            <div className="mt-4">Head Teacher's Comment...................................</div>
            <div className="mt-4">Parent's/Guardian's Comment............................</div>
          </div>

          <div>
            <table className="w-full border-collapse border border-black">
              <thead>
                <tr>
                  <th className="border border-black p-1">GRADE</th>
                  <th className="border border-black p-1">RATING</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border border-black p-1">5</td>
                  <td className="border border-black p-1">Excellent (A)</td>
                </tr>
                <tr>
                  <td className="border border-black p-1">4</td>
                  <td className="border border-black p-1">Good (B)</td>
                </tr>
                <tr>
                  <td className="border border-black p-1">3</td>
                  <td className="border border-black p-1">Average (C)</td>
                </tr>
                <tr>
                  <td className="border border-black p-1">2</td>
                  <td className="border border-black p-1">Fair (D)</td>
                </tr>
                <tr>
                  <td className="border border-black p-1">1</td>
                  <td className="border border-black p-1">Poor (E)</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div className="mt-4 text-center text-xs font-semibold">
          School Stamp .........................................................
        </div>
      </div>

      {/* Print styles */}
      <style jsx global>{`
        @media print {
          body {
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }
          .print\\:shadow-none {
            box-shadow: none !important;
          }
          .print\\:p-4 {
            padding: 1rem !important;
          }
          .print\\:hidden {
            display: none !important;
          }
        }
      `}</style>
    </div>
  );
}
