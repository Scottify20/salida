import { Signal, WritableSignal } from '@angular/core';

export interface DialogProps {
  config: {
    id: string;
    isBackdropEnabled?: boolean;
    isOpenSig: WritableSignal<boolean | null>; // should be null by default to prevent initial open or closed animation
    triggerElementIds: string[];
  };
  mainContent: {
    iconPath?: string;
    title: string | Signal<string | null | undefined> | (() => string);
    textItems?:
      | string[]
      | Signal<string | null | undefined>[]
      | (() => string)[];
  };
  buttons: {
    primary: PrimaryButton;
    secondary?: DialogButton;
  };
}

interface PrimaryButton extends DialogButton {
  type: 'default' | 'info' | 'success' | 'danger' | 'warning';
}

interface DialogButton {
  label: string | Signal<string | null | undefined> | (() => string);
  onClickCallback: () => void;
}
