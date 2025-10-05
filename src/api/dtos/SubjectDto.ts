export type CreateSubjectDto = {
  name: string;
  description: string;
};

export type AddSubjectToClassDto = {
  subject_ids_array: string[];
};
