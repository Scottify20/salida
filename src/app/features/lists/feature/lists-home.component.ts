import { Component, signal, WritableSignal } from '@angular/core';
import {
  HeaderButtonProps,
  HeaderButtonComponent,
} from '../../../shared/components/header-button/header-button.component';
import { ListPreviewComponent } from '../ui/list-preview/list-preview.component';
import {
  PillIndexedTabsComponent,
  PillIndexedTabsProps,
} from '../../../shared/components/tabs/pill-indexed-tabs/pill-indexed-tabs.component';

export interface ListInfo {
  sourceType: ListSourceType;
  sourceName: string | null;
  sourceID: number;
  listName: string;
  listID: number;
}

export type ListSourceType = 'user' | 'provider' | 'community';

@Component({
  selector: 'app-lists-home',
  imports: [
    HeaderButtonComponent,
    ListPreviewComponent,
    PillIndexedTabsComponent,
  ],
  templateUrl: '../ui/lists-home.component.html',
  styleUrl: '../ui/lists-home.component.scss',
})
export class ListsHomeComponent {
  listSource: WritableSignal<'personal' | 'community'> = signal('personal');

  pillTabProps: PillIndexedTabsProps = {
    buttonContent: 'text',
    tabs: [
      {
        text: 'Personal',
        onClickCallback: () => {
          this.listSource.set('personal');
        },
      },
      {
        text: 'Community',
        onClickCallback: () => {
          this.listSource.set('community');
        },
      },
    ],
    animationType: 'slide',
    swipeGestures: true,
  };

  headerButtonsProps: HeaderButtonProps[] = [
    {
      type: 'icon',
      iconPath: '/assets/icons/lists/add.svg',
      ariaLabel: 'Add a list',
    },
  ];
}
