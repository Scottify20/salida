import { Component, Input, Signal } from '@angular/core';
import { ExtractStringService } from '../../services/utility/extract-string.service';

export interface SectionTitleProps {
  sectionTitle: string | Signal<string | null | undefined> | (() => string);
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
  standalone: true,
  imports: [],
  templateUrl: './section-title.component.html',
  styleUrl: './section-title.component.scss',
})
export class SectionTitleComponent {
  @Input({ required: true }) props: SectionTitleProps = {
    sectionTitle: '-------',
    viewAllButtonProps: { onClick: () => false },
  };

  constructor(protected extractStringService: ExtractStringService) {}
}
