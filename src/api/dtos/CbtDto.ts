export type createCutoffMinutesDto = {
  first_cutoff_minutes: number;
  last_cutoff_minutes: number;
};

export type createTermExamDto = {
  assessment_document_array: {
    assessment_type: string;
    min_obj_questions: number;
    max_obj_questions: number;
    number_of_questions_per_student: number;
    expected_obj_number_of_options: number;
  }[];
};

type QuestionDto = {
  question_text: string;
  options: string[];
  correct_answer: string;
  question_number: number;
  score: number;
};

export type setSubjectCbtObjQuestionsDto = {
  questions_array: QuestionDto[];
  term: string;
  subject_id: string;
  assessment_type: string;
};

type TimeTableDto = {
  subject_id: string;
  start_time: string;
  duration: number;
};

export type createTermClassExamTimetableDto = {
  level: string;
  assessment_type: string;
  timetable_array: TimeTableDto[];
  term: string;
};

export type updateTermClassTimeTableDto = {
  selected_time: string;
};

export type classTeacherAuthorizeStudentsToWriteSubjectDto = {
  students_id_array: string[];
  term: string;
};

type sanitizedQuestions = {
  question_shuffled_number: number;
  question_text: string;
  options: string[];
  selected_answer: string;
  _id: string;
};

export type updateSubjectCbtObjExamForAClassDto = {
  result_doc: {
    selected_answer: string;
    _id: string;
  }[];
};

export type updateSubjectCbtObjExamRemainingTimeForAClassDto = {
  remaining_time: number;
};

export type submitSubjectCbtObjExamForAClassDto = {
  result_doc: {
    obj_total_time_allocated: number;
    obj_time_left: number;
    sanitizedQuestions: sanitizedQuestions[];
  };
  trigger_type: string;
};
