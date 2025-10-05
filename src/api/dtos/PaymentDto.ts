export type CreatePaymentPriorityDto = {
  priority_order: {
    fee_name: string;
    priority_number: number;
  }[];
};

export type AddFeeForStudentDto = {
  student_id: string;
  fee_name: string;
  amount: number;
  receiving_acc_id: string;
};

export type CreatePaymentDocumentForStudentsDto = {
  term: string;
};

export type CreateClassLevelsDto = {
  class_level_array: string[];
};
