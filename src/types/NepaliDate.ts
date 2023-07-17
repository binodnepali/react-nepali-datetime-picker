export type NepaliDate = {
  year: Year;
  month: Month;
  date: Day;
};

export type Year = {
  value: number;
  label: string;
};

export type Month = {
  value: number;
  label: string;
};

export type Day = {
  //id is the date in YYYY/MM/DD format
  id: string;
  value: number;
  label: string;
  currentMonth?: boolean;
};
