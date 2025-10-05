import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { Session, Student, Subject, Teacher, Term } from "../../types";
import { TextHelper } from "@/helpers/TextHelper";

type DataProp = {
  cumulative_score: number;
  class_position: string;
  studentData: Student;
  subject_results: {
    _id: string;
    first_test_score: number;
    second_test_score: number;
    exam_score: number;
    total_score: number;
    grade: string;
    subject_position: string;
    subject: Subject;
    subject_teacher: Teacher;
  }[];
  sessionData: {
    activeSession: Session;
    activeTerm: Term;
  };
  term: string;
};

export const generateReportCard = (data: DataProp) => {
  const doc = new jsPDF();

  // Title
  doc.setFontSize(18);
  doc.text("Student Report Card", 80, 15);

  // Student Details
  doc.setFontSize(10);
  doc.text(
    `Name: ${TextHelper.capitalize(
      data.studentData.first_name,
    )} ${TextHelper.capitalize(data.studentData.last_name)}`,
    13,
    30,
  );
  doc.text(`Student ID: ${data.studentData.admission_number}`, 13, 40);
  doc.text(`Session: ${data.sessionData.activeSession.academic_session}`, 13, 50);
  doc.text(
    `Term: ${TextHelper.capitalize(data.sessionData.activeTerm.name.replace(/_/g, " "))}`,
    13,
    60,
  );
  doc.text(`Level: ${data.studentData.current_class_level}`, 13, 70);
  doc.text(`Class: ${data.studentData.current_class.class_id.name}`, 13, 80);

  // Table Headers
  const headers = [["Subject", "1st Test", "2nd Test", "Exam", "Total", "Grade", "Position"]];

  // Table Rows
  const rows = data.subject_results.map((subject) => [
    TextHelper.capitalize(subject.subject.name),
    subject.first_test_score,
    subject.second_test_score,
    subject.exam_score,
    subject.total_score,
    subject.grade,
    subject.subject_position,
  ]);

  rows.push(["", "", "", "", "", ""]);
  rows.push(["Cumulative Score", "", "", "", "", "", data.cumulative_score]);
  rows.push(["Class Position", "", "", "", "", "", data.class_position ?? "Pending"]);

  // Add overall position below the table
  // doc.setFontSize(13);
  // doc.text(
  //   `Overall Position: ${data.cumulative_score}`,
  //   13,
  //   doc.lastAutoTable.finalY + 10 // Place the position below the table
  // );

  // Insert Table
  autoTable(doc, {
    head: headers,
    body: rows,
    startY: 90, // Adjust to make room for the text above
  });

  // Save the PDF
  doc.save(
    `Report_Card_${
      TextHelper.capitalize(data.studentData.first_name) +
      "-" +
      TextHelper.capitalize(data.studentData.last_name)
    }.pdf`,
  );
};
