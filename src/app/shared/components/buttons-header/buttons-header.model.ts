import { Signal } from '@angular/core';

export interface HeaderButton {
  id?: string;
  type: 'icon' | 'text' | 'iconWithBG';
  text?: string;
  iconPath?: string | Signal<string | null | undefined> | (() => string);
  anchor?: {
    urlType: 'internal' | 'external';
    path: string;
    target: '_self' | '_blank';
  };
  actionCallback?: () => void;
}
