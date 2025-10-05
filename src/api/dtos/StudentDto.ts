export type LinkStudentParentDto = {
  admission_number: string;
  first_name: string;
  last_name: string;
  parent_id: string;
};

export type UpdateStudentSessionSubscriptionDto = {
  student_id: string;
  academic_session_id: string;
  new_session_subscription_status: boolean;
};
