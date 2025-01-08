import { Component, Input } from '@angular/core';

// this component becomes a dropdown on mobile width screens and then tabs for wider screens
// but can be set to just dropdown or just tabs in the mode property
export interface PillTabsOrDropdownMenuProps {
  mode: 'tabs-and-dropdown' | 'tabs-only' | 'dropdown-only';
  tabs: TabOrMenuItem[];
}

interface TabOrMenuItem {
  text: string;
  iconPathActive?: string;
  iconPathDisabled?: string;
}

@Component({
    selector: 'app-pill-tabs-or-dropdown-menu',
    imports: [],
    templateUrl: './pill-tabs-or-dropdown-menu.component.html',
    styleUrl: './pill-tabs-or-dropdown-menu.component.scss'
})
export class PillTabsOrDropdownMenuComponent {
  @Input() props: PillTabsOrDropdownMenuProps = {
    mode: 'tabs-and-dropdown',
    tabs: [],
  };
}
