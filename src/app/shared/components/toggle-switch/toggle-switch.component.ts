import { Component, Input, Signal } from '@angular/core';

export interface ToggleSwitchProps {
  buttonsContent: 'text' | 'icon';
  buttons: ToggleButtonProps[];
}

interface ToggleButtonProps {
  onClick: () => void;
  isActive: Signal<boolean> | (() => boolean);
  label?: string;
  iconPathActive?: string;
  iconPathDisabled?: string;
}

@Component({
    selector: 'app-toggle-switch',
    imports: [],
    templateUrl: './toggle-switch.component.html',
    styleUrl: './toggle-switch.component.scss'
})
export class ToggleSwitchComponent {
  @Input({ required: true }) props: ToggleSwitchProps = {
    buttonsContent: 'text',
    buttons: [],
  };
}
