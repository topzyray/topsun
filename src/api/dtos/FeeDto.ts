export type CreateSchoolFeesDto = {
  fee_array: { class_level: string; amount: number }[];
  receiving_acc_id: string;
};

export type CreateMandatoryFeesDto = {
  fee_name: string;
  amount: number;
  receiving_acc_id: string;
};

export type CreateOptionalFeesDto = {
  fee_name: string;
  applicable_classes: string[];
  amount: number;
  receiving_acc_id: string;
};

export type AddMandatoryFeesDuringTermDto = {
  fee_name: string;
  amount: number;
  receiving_acc_id: string;
  term: string;
};

export type AddOptionalFeesDuringTermDto = {
  fee_name: string;
  applicable_classes: string[];
  amount: number;
  receiving_acc_id: string;
  term: string;
};
