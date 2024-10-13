import { Component, Input, Signal } from '@angular/core';
import { DropDownPickerTabProps } from './dropdown-picker-tab.interface';

@Component({
  selector: 'app-dropdown-picker-tab',
  standalone: true,
  imports: [],
  templateUrl: './dropdown-picker-tab.component.html',
  styleUrl: './dropdown-picker-tab.component.scss',
})
export class DropdownPickerTabComponent {
  @Input({ required: true }) dropDownPickerTabProps: DropDownPickerTabProps = {
    id: '',
    text: '',
    callback: () => {},
    visibleIf: () => {
      return false;
    },
  };

  getText(
    text:
      | undefined
      | string
      | Signal<string | null | undefined>
      | (() => string),
  ): string | null | undefined {
    return !text ? undefined : typeof text === 'string' ? text : text();
  }
}
