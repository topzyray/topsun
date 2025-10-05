export type RecordStudentScoreDto = {
  teacher_id: string;
  student_id: string;
  class_id: string;
  class_enrolment_id: string;
  session_id: string;
  term: string;
  subject_id: string;
  score: number;
  score_name: string;
};

export type RecordAllStudentsScoreDto = {
  result_objs: {
    student_id: string;
    score: number;
  }[];
  teacher_id: string;
  class_id: string;
  class_enrolment_id: string;
  session_id: string;
  term: string;
  subject_id: string;
  score_name: string;
};

export type RecordAllStudentsExamScoreDto = {
  term: string;
  session_id: string;
  teacher_id: string;
  subject_id: string;
  result_objs: {
    student_id: string;
    score: number;
  }[];
  score_name: string;
  class_enrolment_id: string;
  class_id: string;
};

export type StudentTermResultDto = {
  student_id: string;
  academic_session_id: string;
  term: string;
};

export type StudentPositionGradingDto = {
  subject_id: string;
  class_enrolment_id: string;
};

export type GenerateClassPositionDto = {
  class_id: string;
};

export type RecordLastTermCumulativeDto = {
  last_term_cumulative_objs: {
    student_id: string;
    score: number;
  }[];
  teacher_id: string;
  class_id: string;
  class_enrolment_id: string;
  session_id: string;
  term: string;
  subject_id: string;
};
