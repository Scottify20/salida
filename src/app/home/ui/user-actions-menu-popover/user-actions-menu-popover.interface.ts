import { Signal } from '@angular/core';

export interface PopoverProps {
  popoverId: string;
  anchoringConfig: {
    anchorElementId: string;
    position:
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
  };
  backdrop: 'mobile-only' | 'always' | 'none';
  itemSectionsConfig: ItemsConfigSection[];
}

interface ItemsConfigSection {
  contentType: 'icon' | 'icon-and-text' | 'text';
  sectionName: string;
  items: MenuItem[];
}

export interface MenuItem {
  iconPath?: string;
  text?: string | Signal<string | null | undefined> | (() => string);
  isActive?: () => boolean; // refer to the isActiveClass() method on the end of this component's class
  isVisibleIf?: () => boolean | Signal<boolean | null | undefined>; // shows the item if true, hide otherwise // always show if this fn is not defined
  onClickCallback?: () => void;
}
