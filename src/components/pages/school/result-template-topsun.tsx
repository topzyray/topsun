"use client";

import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

interface ResultSheetProps {
  logoSrc?: string;
  subjects?: string[];
  effectiveAreas?: string[];
  psychomotorSkills?: string[];
}

export function ResultSheet({
  logoSrc = "/logo.png",
  subjects = [
    "Mathematics",
    "English",
    "Yoruba",
    "Economics",
    "Geography",
    "Biology",
    "Marketing",
    "Chemistry/Lit-in-English",
    "Phy./C.R.S./Acct",
    "Agric/Food & Nut.",
    "Government",
    "Commerce",
    "I.C.T.",
    "Civic Education",
  ],
  effectiveAreas = [
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
  ],
  psychomotorSkills = [
    "Creativity",
    "Verbal Fluency",
    "Games",
    "Sports",
    "Handling Tools",
    "Drawing & Painting",
    "Musical Skills",
  ],
}: ResultSheetProps) {
  // Show/hide watermark if the image fails to load in the environment
  const [showLogo, setShowLogo] = useState(true);

  const headers = [
    "SUBJECTS",
    "1st Test\n20",
    "2nd Test\n20",
    "Exam\n60",
    "Total\n100",
    "Last Term Cumul",
    "Present Cumul",
    "Class Highest",
    "Class Lowest",
    "Class Ave",
    "Position",
    "Grade",
    "Teacher's Sign",
  ];

  const numBlankCells = headers.length - 1;

  return (
    <div className="relative min-h-screen bg-white p-6 print:p-4">
      {/* Watermark: use a plain <img> with onError fallback to avoid next/image loader issues in sandboxed envs */}
      {showLogo && (
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center opacity-10 select-none print:opacity-5">
          <img
            src={logoSrc}
            alt="Watermark Logo"
            className="max-w-[40%] object-contain"
            onError={() => setShowLogo(false)}
          />
        </div>
      )}

      <Card className="relative z-10 border border-gray-400 p-6">
        <h1 className="mb-2 text-center text-lg font-bold">CONTINUOUS ASSESSMENT REPORT</h1>

        <div className="mb-4 grid grid-cols-2 gap-4 text-sm">
          <div>
            <div className="mb-2 flex items-center gap-2">
              <Label className="min-w-[6rem]">Name:</Label>
              <Input className="flex-1 border-gray-400" />
            </div>
            <div className="mb-2 flex items-center gap-2">
              <Label className="min-w-[6rem]">Class:</Label>
              <Input className="flex-1 border-gray-400" />
            </div>
            <div className="mb-2 flex items-center gap-2">
              <Label className="min-w-[6rem]">Attendance:</Label>
              <Input className="flex-1 border-gray-400" />
            </div>
          </div>

          <div>
            <div className="mb-2 flex items-center gap-2">
              <Label className="min-w-[6rem]">Term:</Label>
              <Input className="flex-1 border-gray-400" />
            </div>
            <div className="mb-2 flex items-center gap-2">
              <Label className="min-w-[6rem]">No in Class:</Label>
              <Input className="flex-1 border-gray-400" />
            </div>
            <div className="mb-2 flex items-center gap-2">
              <Label className="min-w-[6rem]">Days Out Of:</Label>
              <Input className="flex-1 border-gray-400" />
            </div>
          </div>
        </div>

        {/* Subjects Table */}
        <div className="mb-6 overflow-x-auto">
          <table className="w-full table-fixed border-collapse border border-gray-400 text-xs">
            <thead>
              <tr className="bg-gray-100 text-center align-top">
                {headers.map((h, idx) => (
                  <th
                    key={idx}
                    className={`border p-1 ${idx === 0 ? "text-left" : "text-center"}`}
                    // preserve line breaks in header by using white-space pre-line
                    style={{ whiteSpace: "pre-line" }}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {subjects.map((subject, i) => (
                <tr key={i} className="text-center align-top">
                  <td className="border p-1 text-left">{subject}</td>
                  {Array.from({ length: numBlankCells }).map((_, j) => (
                    <td key={j} className="h-6 border p-1" />
                  ))}
                </tr>
              ))}

              {/* Totals row */}
              <tr className="text-center font-semibold">
                <td className="border p-1 text-left">Total</td>
                {Array.from({ length: numBlankCells }).map((_, j) => (
                  <td key={j} className="border p-1" />
                ))}
              </tr>
              <tr className="text-center font-semibold">
                <td className="border p-1 text-left">Percentage</td>
                {Array.from({ length: numBlankCells }).map((_, j) => (
                  <td key={j} className="border p-1" />
                ))}
              </tr>
            </tbody>
          </table>
        </div>

        {/* Effective Areas and Psychomotor Skills */}
        <div className="mb-6 grid grid-cols-2 gap-6">
          <div>
            <h2 className="mb-1 text-sm font-semibold">EFFECTIVE AREAS</h2>
            <table className="w-full border-collapse border border-gray-400 text-xs">
              <tbody>
                {effectiveAreas.map((area, i) => (
                  <tr key={i}>
                    <td className="w-3/4 border p-1">{area}</td>
                    <td className="w-1/4 border p-1" />
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div>
            <h2 className="mb-1 text-sm font-semibold">PSYCHOMOTOR SKILLS</h2>
            <table className="w-full border-collapse border border-gray-400 text-xs">
              <tbody>
                {psychomotorSkills.map((skill, i) => (
                  <tr key={i}>
                    <td className="w-3/4 border p-1">{skill}</td>
                    <td className="w-1/4 border p-1" />
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Comments & Footer */}
        <div className="mt-6 text-xs">
          <div className="mb-3 grid grid-cols-2 gap-4">
            <div>
              <div className="mb-2 flex items-center gap-2">
                <Label className="min-w-[8rem]">Date of Vacation:</Label>
                <Input className="flex-1 border-gray-400" />
              </div>
              <div className="mb-2">
                <Label>Class Teacher's Comment:</Label>
                <Textarea className="mt-1 border-gray-400" rows={3} />
              </div>
            </div>

            <div>
              <div className="mb-2 flex items-center gap-2">
                <Label className="min-w-[8rem]">Date of Resumption:</Label>
                <Input className="flex-1 border-gray-400" />
              </div>
              <div className="mb-2">
                <Label>Head Teacher's Comment:</Label>
                <Textarea className="mt-1 border-gray-400" rows={3} />
              </div>
            </div>
          </div>

          <div className="mb-4">
            <Label>Parent/Guardian's Comment:</Label>
            <Textarea className="mt-1 border-gray-400" rows={3} />
          </div>

          <div className="mt-6 flex items-center justify-between text-sm">
            <div className="space-y-2">
              <div>Signature: ________________________</div>
              <div>School Stamp: ______________________</div>
            </div>

            <div className="text-right">
              <div>Overall Position: __________</div>
              <div>Grade: ______</div>
            </div>
          </div>
        </div>
      </Card>

      {/* If logo fails to load we keep a subtle text watermark so the sheet still looks polished */}
      {!showLogo && (
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center opacity-5 select-none">
          <svg
            width="400"
            height="400"
            viewBox="0 0 400 400"
            className="object-contain"
            xmlns="http://www.w3.org/2000/svg"
          >
            <text
              x="50%"
              y="50%"
              dominantBaseline="middle"
              textAnchor="middle"
              fontSize="36"
              fill="#000000"
            >
              SCHOOL
            </text>
          </svg>
        </div>
      )}
    </div>
  );
}
