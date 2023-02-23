export type NavPath = {
  path: string;
  label: string;
  color?: string;
  icon?: string;
  subPath?: NavPath[];
};
