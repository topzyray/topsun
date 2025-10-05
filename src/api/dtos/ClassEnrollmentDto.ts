export type StudentEnrollmentDto = {
  student_id: string;
  class_id: string;
  academic_session_id: string;
  term: string;
  level: string;
  subjects_to_offer_array: string[];
};

export type ManyStudentEnrollmentDto = {
  student_ids: string[];
  class_id: string;
  academic_session_id: string;
  term: string;
  level: string;
};

export type SessionClassDto = {
  class_id: string;
  session_id: string;
};
