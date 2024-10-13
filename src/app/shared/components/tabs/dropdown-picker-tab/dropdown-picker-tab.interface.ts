import { WritableSignal } from '@angular/core';

export interface DropDownPickerTabProps {
  id: string;
  text: string | (() => string) | WritableSignal<string>;
  callback: () => void;
  visibleIf: () => boolean;
}
