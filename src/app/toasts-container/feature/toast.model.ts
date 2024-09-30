export type ActionButtonType =
  | 'accent'
  | 'danger'
  | 'warning'
  | 'success'
  | 'neutral';

export interface ToastItem {
  idBasedOnContent?: string;
  iconPath?: string;
  text: string;
  actionButton?: {
    type: ActionButtonType;
    callback?: () => void;
    label?: string;
    iconPath?: string;
  };
  scope: 'global' | 'route';
  duration?: number;
}
