import { ExamSubmissionTriggerTypeEnum } from "@/api/enums/ExamSubmissionTriggerTypeEnum";
import { JwtPayload } from "jwt-decode";
import { ExamStatusTypeEnum } from "@/api/enums/ExamStatusTypeEnum";
import { ReactNode } from "react";

type GlobalContextType = {
  showNavModal: boolean;
  setShowNavModal: React.Dispatch<React.SetStateAction<boolean>>;
  showEvent: boolean;
  setShowEvent: React.Dispatch<React.SetStateAction<boolean>>;
  activeSessionData: {
    activeSession: Session | null;
    activeTerm: Term | null;
    loading: boolean;
    error: Error | null;
  };
  setActiveSessionData: React.Dispatch<
    React.SetStateAction<{
      activeSession: Session | null;
      activeTerm: Term | null;
      loading: boolean;
      error: Error | null;
    }>
  >;
  classLevel: {
    loading: boolean;
    data: ClassLevel | null;
    error: Error | null;
  };
  setClassLevel: React.Dispatch<
    React.SetStateAction<{
      loading: boolean;
      data: ClassLevel | null;
      error: Error | null;
    }>
  >;
  examTimetable: {
    loading: boolean;
    data: ClassExamTimetable | null;
    error: Error | null;
  };
  setExamTimetable: React.Dispatch<
    React.SetStateAction<{
      loading: boolean;
      data: ClassExamTimetable | null;
      error: Error | null;
    }>
  >;
  pageLevelLoader: boolean;
  setPageLevelLoader: React.Dispatch<React.SetStateAction<boolean>>;
  componentLevelLoader: {
    loading: boolean;
    id: string;
  };
  setComponentLevelLoader: React.Dispatch<
    React.SetStateAction<{
      loading: boolean;
      id: string;
    }>
  >;
};

type GlobalContextProviderProps = {
  children: React.ReactNode;
};

type UserRole = "super_admin" | "admin" | "parent" | "student" | "teacher" | "non_teaching";

type DashboardTitleType =
  | "Super Admin"
  | "Admin"
  | "Parent"
  | "Student"
  | "Teacher"
  | "Non Teaching";

interface CustomJwtPayload extends JwtPayload {
  role: UserRole;
}

type SubMenuItem = { title: string; url: string; icon?: string };

type NavItems = {
  title: string;
  url?: string;
  icon: string;
  hasSubmenu?: boolean;
  submenu?: SubMenuItem[];
}[];

type UserStatus = "active" | "inactive" | "sacked" | "resigned" | "graduated" | "expelled";

type ImageData = {
  url: string;
  public_url: string;
};

type SuperAdmin = {
  _id: string;
  first_name: string;
  last_name: string;
  middle_name?: string;
  email: string;
  role: UserRole;
  phone: string;
  is_verified: boolean;
  status: UserStatus;
  createdAt: string;
  updatedAt: string;
  is_updated: boolean;
  school: School;
};

type User = {
  _id: string;
  first_name: string;
  last_name: string;
  middle_name?: string;
  gender: string;
  dob?: string;
  email: string;
  role: UserRole;
  phone: string;
  is_verified: boolean;
  status?: UserStatus;
  createdAt: string;
  updatedAt: string;
  profile_image?: ImageData;
  is_updated?: boolean;
  school?: School;
};

type SuperAdminUser = {
  employment_date: string | null;
} & User;

type SchoolAdminUser = {
  employment_date: string | null;
  school: School;
} & User;

type Teacher = {
  school: School;
  class_managing: Class;
  employment_date?: string | null;
  subjects_capable_of_teaching: [] | Subject[];
  teaching_assignment:
    | []
    | {
        _id: string;
        class_id: Class;
        subject: Subject;
      }[];
} & User;

type Parent = {
  children: Student[];
} & User;

type StudentPaymentDocument = {
  class: string;
  createdAt: string;
  fees_breakdown: {
    school_bus: {
      bus_fee: number;
      is_using: boolean;
      route: string;
      trip_type: string;
    };
    school_fees: string;
  };
  is_payment_complete: boolean;
  is_submit_response: boolean;
  payment_summary: PaymentResponse[];
  remaining_amount: number;
  session: string;
  student: string;
  term: string;
  total_amount: number;
  updatedAt: string;
  _id: string;
  waiting_for_confirmation: PaymentResponse[];
};

type StudentAccountDetails = {
  _id: string;
  our_ref_to_bank: string;
  student_id: string;
  account_balance: number;
  createdAt: string;
  updatedAt: string;
  account_name: string;
  account_number: string;
  customer_reference: string;
};

type Student = {
  school: School;
  admission_session: string;
  admission_year: string;
  admission_number: string;
  current_class: any;
  current_class_level: string;
  cumulative_score: number;
  overall_position: number;
  admission_session: string;
  outstanding_balance: number;
  active_class_enrolment;
  home_address: string;
  new_session_subscription: null | boolean;
  latest_payment_document: StudentPaymentDocument;
  studentAccountDetails: StudentAccountDetails;

  parent_id: Parent[];
  subject_result: any;
} & User;

type ModalComponentProps = {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
  className?: string;
};

type DataOptionOne = { label: string; value: string };

type InputComponentProps = {
  formControl: any;
  formName: string;
  formLabel: ReactNode;
  formInputType: string;
  formPlaceholder?: string;
  isPassword?: boolean;
  formMaxYear?: string;
  formMinYear?: string;
  readOnly?: boolean;
  disabled?: boolean;
  inputClassName?: string;
};

type ImageComponentProps = {
  formControl: any;
  formName: string;
  formLabel: ReactNode;
  className?: string;
  disabled: boolean;
  multiple?: boolean;
};

type SelectComponentProps = {
  formControl: any;
  formName: string;
  formLabel: ReactNode;
  formPlaceholder?: string;
  formOptionLabel: string;
  formOptionData: DataOptionOne[];
  disabled: boolean;
  value?: string;
  inputClassName?: string;
};

type ComboboxComponentProps = {
  formControl: any;
  formName: string;
  formLabel: ReactNode;
  formOptionLabel: string;
  formOptionData: any[];
  formPlaceholder: string;
  formDescription?: string;
  disabled: boolean;
  displayValue: (data: any) => string;
  valueField: string;
};

type TextAreaComponentProps = {
  formControl: any;
  // formControl: any;
  formName: string;
  formLabel: ReactNode;
  formPlaceholder: string;
  formDescription: string;
  rows: number;
  disabled: boolean;
  inputClassName: string;
};

type Term = {
  end_date: string;
  is_active: boolean;
  name: string;
  start_date: string;
  _id: string;
};

type Session = {
  academic_session: string;
  createdAt: string;
  is_active: boolean;
  is_promotion_done: boolean;
  terms: Term[];
  updatedAt: string;
  __v: number;
  _id: string;
};

type Subject = {
  _id: string;
  name: string;
  description: string;
  stream: string;
  sections: {
    _id: string;
    tier: string;
    is_compulsory: boolean;
  }[];
  teacher_ids: string[];
  class_ids: string[];
  createdAt: string;
  updatedAt: string;
};

type Class = {
  _id: string;
  name: string;
  description: string;
  section: string;
  level: string;
  arms: [];
  class_teacher: Teacher;
  teacher_subject_assignments: {
    _id: string;
    subject: Subject;
    teacher: Teacher;
  }[];
  compulsory_subjects: Subject[];
  createdAt: string;
  updatedAt: string;
};

type EnrolmentStatus = "enrolled" | "completed" | "to_repeat";

type TermEnum = "first_term" | "second_term" | "third_term";

type Enrollment = {
  _id: string;
  students: {
    student: Student;
    subjects_offered: Subject[];
    term: string;
    _id: string;
  }[];
  class: Class;
  level: string;
  academic_session_id: Session;
  term: TermEnum;
  all_subjects_offered_in_the_class: Subject[];
  status: EnrolmentStatus;
  is_active: boolean;
  performance: [];
  test_scores: [];
  exam_scores: [];
  attendance: [];
  average_scores: [];
  grades: [];
  createdAt: string;
  updatedAt: string;
  __v: 0;
};

type SchoolFee = {
  _id: string;
  school: string;
  level: string;
  academic_session_id: string;
  term: string;
  school_fee: {
    fee_name: string;
    amount: number;
    receiving_account: string;
  };
  createdAt: string;
  updatedAt: string;
};

type MandatoryFee = {
  _id: string;
  fee_name: string;
  amount: 14000;
  receiving_account: string;
  school: string;
  level: string;
  academic_session_id: string;
  term: string;
  createdAt: string;
  updatedAt: string;
};

type OptionalFee = {
  _id: string;
  fee_name: string;
  amount: number;
  applicable_classes: string[];
  receiving_account: string;
  school: string;
  level: string;
  academic_session_id: string;
  term: string;
  createdAt: string;
  updatedAt: string;
};

type BusFee = {
  _id: string;
  school_bus: {
    close_group: {
      both_trips: number;
      single_trip: number;
    };
    far_group: {
      both_trips: number;
      single_trip: number;
    };
  };
  createdAt: string;
  updatedAt: string;
};

type BusStop = { _id: string; street: string };

type PaymentDocument = {
  _id: string;
  class: string;
  fees_breakdown: {
    school_fees: number;
    school_bus: {
      bus_fee: number;
      is_using: boolean;
    };
  };
  is_payment_complete: boolean;
  is_submit_response: boolean;
  payment_summary: [];
  remaining_amount: number;
  session: string;
  student: string;
  term: string;
  total_amount: number;
  waiting_for_confirmation: [];
  createdAt: string;
  updatedAt: string;
};

type PaymentPendingApproval = {
  amount_paid: number;
  date_paid: string;
  payment_method: string;
  transaction_id: string;
  bank_name: string;
  status: string;
  _id: string;
};

type TransactionResponse = {
  _id?: string;
  status: "confirmed" | "pending" | "failed";
  transaction_id: string;
  amount_paid: number;
  payment_method: "card" | "bank" | "cash";
  date_paid: string;
  summary?: string;
  failure_reason?: string;
  school_name?: string;
  school_contact?: string;
  historyPage?: boolean;
};

type SubjectResult = {
  _id: string;
  remark: string;
  cumulative_average: number;
  last_term_cumulative: number;
  scores: [
    {
      key?: string;
      score: number;
      score_name: string;
      _id: string;
    },
  ];
  subject: Subject;
  subject_position: string;
  subject_teacher: string;
  total_score: number;
  grade: string;
};

type PaymentPriority = {
  fee_name: string;
  priority_number: number;
  _id: string;
};

type SchoolAccount = {
  _id: string;
  account_name: string;
  bank_name: string;
  account_number: string;
};

type ResultSettingComponent = {
  flattenedComponents: {
    name: string;
    percentage: number;
    column?: number;
    key?: string;
    exam_name?: string;
  }[];
  resultSettingExist: {
    components: { name: string; percentage: number; column: number }[];
    exam_components: {
      component: {
        key: string;
        name: string;
        percentage: number;
      }[];
      exam_name: string;
    };
    grading_and_remark: { value: number; grade: string; remark: string }[];
    level: string;
    school: string;
    _id: string;
  };
};

type TermResult = {
  _id: string;
  term: string;
  academicDetails: {
    _id: string;
    academic_session: string;
  };
  classDetails: {
    level: string;
    name: string;
  };
  schoolDetails: School;
  class_position: string;
  cumulative_score: number;
  term: string;
  subject_results: SubjectResult[];
};

type Result = {
  academic_session_id: {
    academic_session: string;
  };
  academic_session: string;
  class: {
    level: string;
    name: string;
  };
  student: {
    first_name: string;
    last_name: string;
    _id: string;
  };
  school: School;
  term_results: TermResult[];
  final_cumulative_score: number;
  final_status: unknown;
  position: unknown;
  createdAt: string;
  updatedAt: sring;
};

type ClassLevel = {
  _id: string;
  school: string;
  class_level_array: string[];
};

type SummaryObject = {
  key: string;
  title: string;
  total_count: number;
  summary: string;
};

type SchoolOwnerAdminOverview = {
  users_summary_array: SummaryObject[];
  academic_summary_array: SummaryObject[];
  class_enrolments: {
    total_count: number;
    title: string;
    summary: string;
    key: string;
    enrolment_data: any[];
  };
};

type Ticket = {
  _id: string;
  first_name: string;
  last_name: string;
  school_name: string;
  email: string;
  message: string;
  createdAt: string;
  updatedAt: string;
};

type ExamDocument = {
  _id: string;
  school: string;
  academic_session_id: string;
  term: string;
  min_obj_questions: number;
  max_obj_questions: number;
  number_of_questions_per_student: number;
  expected_obj_number_of_options: number;
  title: string;
  is_active: boolean;
  createdAt: string;
  updatedAt: string;
};

type ExamQuestionMetadata = {
  _id: string;
  school: string;
  subject_teacher: {
    first_name: string;
    last_name: string;
    _id: string;
  };
  academic_session_id: string;
  exam_id: string;
  subject_id: {
    _id: string;
    name: string;
  };
  student_id: string;
  obj_start_time: string;
  obj_total_time_allocated: number;
  obj_final_cutoff_time: string;
  obj_time_left: number;
  obj_status: ExamStatusTypeEnum;
  theory_status: ExamStatusTypeEnum;
  term: string;
  level: string;
  shuffled_theory_questions: any[];
  createdAt: string;
  updatedAt: string;

  total_questions?: number;
  time_left?: number;
};

type SanitizedQuestion = {
  question_shuffled_number: number;
  question_text: string;
  options: string[];
  selected_answer: string;
  _id: string;
};

type OBJExamQuestion = {
  others: ExamQuestionMetadata;
  sanitizedQuestions: SanitizedQuestion[];
};

type SubmittedOBJExamResponse = {
  _id: string;
  school: string;
  subject_teacher: string;
  academic_session_id: string;
  exam_id: string;
  subject_id: string;
  student_id: string;
  obj_start_time: string;
  obj_total_time_allocated: number;
  obj_final_cutoff_time: string;
  obj_time_left: number;
  obj_status: ExamStatusTypeEnum;
  theory_status: ExamStatusTypeEnum;
  term: string;
  shuffled_theory_questions: any[];
  shuffled_obj_questions: any[];
  obj_submitted_at: string;
  obj_trigger_type: ExamSubmissionTriggerTypeEnum;
  objective_total_score: number;
  percent_score: number;
  createdAt: string;
  updatedAt: string;

  sanitizedQuestions: SanitizedQuestion[];
};

type TermExamDocument = {
  academic_session_id: string;
  createdAt: string;
  expected_obj_number_of_options: number;
  is_active: boolean;
  max_obj_questions: number;
  min_obj_questions: number;
  number_of_questions_per_student: number;
  school: string;
  term: string;
  title: string;
  updatedAt: string;
  _id: string;
};

type ScheduledTimetableSubject = {
  _id: string;
  subject_id: Subject;
  timetable_id: string;
  start_time: string;
  duration: number;
  exam_subject_status: ExamStatusTypeEnum;
  is_subject_question_set: boolean;
  has_subject_grace_period_ended: boolean;
  authorized_students: string[] | [];
  students_that_have_started: string[] | [];
  students_that_have_submitted: string[] | [];
};

type ClassExamTimetable = {
  _id: string;
  assessment_type: string;
  exam_id: string;
  is_active: boolean;
  academic_session_id: string;
  class_id: string;
  term: string;
  scheduled_subjects: ScheduledTimetableSubject[];
  createdAt: string;
  updatedAt: string;
};

type AssessmentDocument = {
  _id: string;
  assessment_type: string;
  academic_session_id: string;
  term: string;
  min_obj_questions: number;
  max_obj_questions: number;
  number_of_questions_per_student: number;
  expected_obj_number_of_options: number;
  title: string;
  is_active: boolean;
  createdAt: string;
  updatedAt: string;
}[];
