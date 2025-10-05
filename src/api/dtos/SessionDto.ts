export type NewTermDto = {
  start_date: string;
  end_date: string;
  name: string;
};

export type EndTermDto = {
  session_id: string;
  term_id: string;
};

export type DeleteTermDto = {
  session_id: string;
  term_id: string;
};
