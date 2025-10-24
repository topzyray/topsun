"use client";

import React, { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

// Note: html2canvas and jspdf are dynamically imported inside the handler to avoid
// SSR/runtime issues that can happen when these libraries are imported at module top-level.
// Make sure to install them in your project: `npm install html2canvas jspdf`.

export function ResultSheet2() {
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

      console.error("PDF generation failed", err);
      // Friendly message for the user
      // Note: in a production app consider using a toast notification instead of alert.
      alert("Could not generate PDF automatically. Please use the Print button as a fallback.");
    } finally {
      setPdfLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen w-full p-6 font-[Times_New_Roman] text-black print:bg-white print:p-4 print:text-black">
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
      <ScrollArea className="mx-auto w-[90%] whitespace-nowrap">
        <div
          ref={printRef}
          className="relative z-10 mx-auto w-full border border-black bg-gray-400 p-6 print:shadow-none"
        >
          {/* Watermark: use plain <img> with onError fallback to avoid next/image loader/runtime issues */}
          {showLogo && (
            <div className="pointer-events-none absolute inset-0 flex items-center justify-center opacity-10 select-none">
              <Image
                src="/logo.png"
                alt="School Logo Watermark"
                width={200}
                height={200}
                className="max-w-[40%] object-contain"
                onError={() => setShowLogo(false)}
              />
            </div>
          )}

          {!showLogo && (
            <div className="pointer-events-none absolute inset-0 flex items-center justify-center opacity-5 select-none">
              <svg
                width="400"
                height="400"
                viewBox="0 0 400 400"
                xmlns="http://www.w3.org/2000/svg"
              >
                <text x="50%" y="50%" dominantBaseline="middle" textAnchor="middle" fontSize="36">
                  SCHOOL
                </text>
              </svg>
            </div>
          )}

          {/* Header Section */}
          <div className="relative z-10 mb-4 w-full text-sm leading-relaxed">
            <div className="mb-2 flex justify-between">
              <div>
                CONTINUOUS ASSESSMENTS
                FOR..............................................................................................................
              </div>
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

          <div className="flex w-full gap-4">
            <div className="w-full">
              {/* Subjects Table */}
              <Table className="relative z-10 w-full border-collapse border border-black text-xs">
                <TableHeader>
                  <TableRow>
                    <TableHead rowSpan={2} className="w-[150px] border border-black p-1 text-black">
                      SUBJECTS
                    </TableHead>
                    <TableHead colSpan={5} className="border border-black p-1 text-black">
                      (a) (b) (c) (d) (e)
                    </TableHead>
                    <TableHead rowSpan={2} className="border border-black p-1 text-black">
                      Class Highest Mark
                    </TableHead>
                    <TableHead rowSpan={2} className="border border-black p-1 text-black">
                      Class Lowest Mark
                    </TableHead>
                    <TableHead rowSpan={2} className="border border-black p-1 text-black">
                      Class Ave. Mark
                    </TableHead>
                    <TableHead rowSpan={2} className="border border-black p-1 text-black">
                      Overall Position
                    </TableHead>
                    <TableHead rowSpan={2} className="border border-black p-1 text-black">
                      Grade
                    </TableHead>
                    <TableHead rowSpan={2} className="border border-black p-1 text-black">
                      Teacher's Signature
                    </TableHead>
                  </TableRow>
                  <TableRow>
                    <TableHead className="border border-black p-1 text-black">
                      1st Test 20
                    </TableHead>
                    <TableHead className="border border-black p-1 text-black">
                      2nd Test 20
                    </TableHead>
                    <TableHead className="border border-black p-1 text-black">
                      Exam Score 60
                    </TableHead>
                    <TableHead className="border border-black p-1 text-black">
                      Total Score 100
                    </TableHead>
                    <TableHead className="border border-black p-1 text-black">
                      Last Term Cumul
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
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
                    <TableRow key={subject}>
                      <TableCell className="border border-black p-1">{subject}</TableCell>
                      {[...Array(5)].map((_, i) => (
                        <TableCell key={i} className="border border-black p-1"></TableCell>
                      ))}
                      {[...Array(6)].map((_, i) => (
                        <TableCell key={i} className="border border-black p-1"></TableCell>
                      ))}
                    </TableRow>
                  ))}

                  <TableRow>
                    <TableCell className="border border-black p-1 font-semibold">Total</TableCell>
                    {[...Array(11)].map((_, i) => (
                      <TableCell key={i} className="border border-black p-1"></TableCell>
                    ))}
                  </TableRow>

                  <TableRow>
                    <TableCell className="border border-black p-1 font-semibold">
                      Percentage
                    </TableCell>
                    {[...Array(11)].map((_, i) => (
                      <TableCell key={i} className="border border-black p-1"></TableCell>
                    ))}
                  </TableRow>
                </TableBody>
              </Table>
              <div className="relative z-10 mt-6 grid grid-cols-2 gap-4 text-xs">
                <div>
                  <div>Date of Vacation................................................</div>
                  <div>Date of Resumption..............................................</div>
                  <div>Class Teacher's Comment.......................................</div>
                  <div className="mt-4">
                    Head Teacher's Comment...................................
                  </div>
                  <div className="mt-4">
                    Parent's/Guardian's Comment............................
                  </div>
                </div>

                <div></div>
              </div>
            </div>
            <div className="w-full max-w-[20%]">
              {/* Effective Areas and Psychomotor */}
              <div className="relative z-10 grid grid-cols-1 gap-2">
                <Table className="text-xs text-black">
                  <TableHeader className="w-full border-none text-center text-sm">
                    <TableHead colSpan={2} className="h-0 p-1 text-center font-bold text-black">
                      EFFECTIVE AREAS
                    </TableHead>
                  </TableHeader>
                  <TableBody className="space-y-0">
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
                    ].map((ea) => (
                      <TableRow key={ea} className="space-y-0 border border-black">
                        <TableCell className="border border-black p-1">{ea}</TableCell>
                        <TableCell className="w-20 border border-black p-1"></TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>

                <Table className="text-xs text-black">
                  <TableHeader className="w-full border-none text-center text-sm">
                    <TableHead colSpan={2} className="h-0 p-1 text-center font-bold text-black">
                      PSYCHOMOTOR SKILLS
                    </TableHead>
                  </TableHeader>
                  <TableBody className="space-y-0">
                    {[
                      "Creativity",
                      "Verbal Fluency",
                      "Games",
                      "Sports",
                      "Handing Tools",
                      "Drawing & Painting",
                      "Musical Skills",
                    ].map((skill) => (
                      <TableRow key={skill} className="space-y-0 border border-black">
                        <TableCell className="border border-black p-1">{skill}</TableCell>
                        <TableCell className="w-20 border border-black p-1"></TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>

                <Table>
                  <TableBody>
                    <TableRow>
                      <TableHead className="h-0 w-1/2 p-1 font-bold text-black">
                        Award Prize Won
                      </TableHead>
                      <TableCell className="h-0 w-1/2 border border-black p-1"></TableCell>
                    </TableRow>
                  </TableBody>
                </Table>

                <div className="flex items-center gap-2">
                  <Table className="text-xs text-black">
                    <TableHeader className="w-full border-none text-center text-sm"></TableHeader>
                    <TableBody>
                      <TableRow className="">
                        {["Bill", "N", "K"].map((h) => (
                          <TableHead
                            key={h}
                            className="h-0 border-b border-black text-center font-bold text-black"
                          >
                            {h}
                          </TableHead>
                        ))}
                      </TableRow>
                      {[
                        "Arrears",
                        "Sch. Fees",
                        "Computer",
                        "Lesson",
                        "Exam",
                        "First Aid",
                        "Govt. Levy",
                        "TOTAL",
                      ].map((skill) => (
                        <TableRow key={skill} className="border border-black">
                          <TableCell className="border border-black p-1">{skill}</TableCell>
                          <TableCell className="w-20 border border-black p-1"></TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                  <Table className="border-none">
                    <TableHeader className="border-none">
                      <TableRow>
                        <TableHead className="h-0 p-1 text-xs text-black">GRADE</TableHead>
                        <TableHead className="h-0 p-1 text-xs text-black">RATING</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody className="border-none">
                      <TableRow>
                        <TableCell className="border-none p-1">5</TableCell>
                        <TableCell className="border-none p-1">Excellent (A)</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="border-none p-1">4</TableCell>
                        <TableCell className="border-none p-1">Good (B)</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="border-none p-1">3</TableCell>
                        <TableCell className="border-none p-1">Average (C)</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="border-none p-1">2</TableCell>
                        <TableCell className="border-none p-1">Fair (D)</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="border-none p-1">1</TableCell>
                        <TableCell className="border-none p-1">Poor (E)</TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 flex justify-center text-center text-xs font-semibold">
            <div>School Stamp:</div>
            <div className="w-[10rem] border-b border-black"></div>
          </div>
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>

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
