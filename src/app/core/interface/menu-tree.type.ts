export interface MenuTreeType {
  icon?: string;
  menu?: string;
  path?: string;
  label?: string;
  authorities?: string[];
  items?: MenuItemTreeType[];
}

export interface MenuItemTreeType {
  icon?: string;
  label: string;
  path: string;
  authorities?: string[];
}
