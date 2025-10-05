export type CreateClassDto = {
  name: string;
  description: string;
  level: string;
  section: string;
  compulsory_subjects?: string[];
};
