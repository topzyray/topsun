export type CreateSchoolAccountDto = {
  account_details_array: {
    account_name: string;
    bank_name: string;
    account_number: string;
  }[];
};
