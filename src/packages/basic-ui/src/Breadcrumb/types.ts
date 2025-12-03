export type BreadcrumbItem = {
  label: React.ReactNode | string;
  icon?: React.ReactNode;
  active?: boolean;
  onClick?: () => void;
};

export type LocalNavBreadcrumbProps = {
  items: BreadcrumbItem[];
  labelStyle?: string;
  isSeparator?: boolean;
  separatorColor?: string;
  separatorActiveColor?: string;
  separatorClassName?: string;
};

export type ProgressBreadcrumbProps = {
  items: BreadcrumbItem[];
  labelStyle?: string;
  isSeparator?: boolean;
  separatorColor?: string;
  separatorActiveColor?: string;
};
