import { Component, Input, Signal, inject } from '@angular/core';
import { ExtractStringService } from '../../services/utility/extract-string.service';

export interface SectionTitleProps {
  sectionTitle: string | Signal<string | null | undefined> | (() => string);
  iconURL?: string | null;
  sectionTitlePlural?:
    | string
    | Signal<string | null | undefined>
    | (() => string);
  viewAllButtonProps?: ViewAllButtonProps;
}

export type ViewAllButtonProps = {
  onClick: () => void;
};

@Component({
  selector: 'app-section-title',
  imports: [],
  templateUrl: './section-title.component.html',
  styleUrl: './section-title.component.scss',
})
export class SectionTitleComponent {
  protected extractStringService = inject(ExtractStringService);

  @Input({ required: true }) props: SectionTitleProps = {
    sectionTitle: '-------',
    viewAllButtonProps: { onClick: () => false },
  };
}
