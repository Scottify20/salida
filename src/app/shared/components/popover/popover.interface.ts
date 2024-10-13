export interface PopoverProps {
  popoverId: string;
  anchorElementId: string;
  position: PopoverPosition;
  backdrop: 'mobile-only' | 'always' | 'none';
  childComponentType: any;
  childComponentsProps: ComponentProps;
}

export interface ComponentProps {
  [key: string]: any; // Allows any prop name with any type
}

type PopoverPosition =
  | 'bottom'
  | 'top'
  | 'left'
  | 'right'
  | 'bottom-start'
  | 'bottom-end'
  | 'top-start'
  | 'top-end'
  | 'right-start'
  | 'right-end'
  | 'left-start'
  | 'left-end';
