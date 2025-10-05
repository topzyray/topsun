export type CreateSchoolDto = {
  school_name: string;
  address: string;
  city: string;
  state: string;
  country: string;
  phone: string;
  email: string;
  website?: string;
};

export type CreateSchoolOwnerDto = {
  first_name: string;
  gender: string;
  last_name: string;
  email: string;
  password: string;
  confirm_password: string;
  middle_name?: string;
  phone: string;
  school_id: string;
};

export type CreateResultSettingsDto = {
  name_percent_array: {
    name: string;
    percentage: number;
    column: number;
  }[];
  grading_array: {
    value: number;
    grade: string;
    remark: string;
  }[];
  exam_components: {
    exam_name: string;
    component: {
      key: string;
      name: string;
      percentage: number;
    }[];
  };
};
