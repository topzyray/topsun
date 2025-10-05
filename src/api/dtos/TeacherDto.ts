export type TeacherSubjectAssignmentDto = {
  subject: string;
  class_id: string;
  teacher_id: string;
};

export type TeacherToClassDto = {
  teacher_id: string;
  class_id: string;
};

export type ChangeSubjectTeacherDto = {
  subject: string;
  class_id: string;
  new_teacher_id: string;
};

export type ChangeClassTeacherDto = {
  new_class_teacher_id: string;
};

export type OnboardTeacherDto = {
  subject_ids: string[];
};

export type StudentsClassOfferingDto = {
  academic_session_id: string;
  class_id: string;
  subject_id: string;
};

export type StudentsTeacherManagesDto = {
  teacher_id: string;
  class_id: string;
  academic_sesison_id: string;
};
