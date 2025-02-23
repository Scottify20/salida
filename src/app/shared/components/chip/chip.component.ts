import { Component, Input, Signal } from '@angular/core';
import { ExtractStringService } from '../../services/utility/extract-string.service';

export interface ChipProps {
  text: string | Signal<string | null | undefined> | (() => string);
  onClickFn?: () => void;
}

@Component({
  selector: 'app-chip',
  imports: [],
  templateUrl: './chip.component.html',
  styleUrl: './chip.component.scss',
})
export class ChipComponent {
  constructor(protected extractStringService: ExtractStringService) {}
  @Input({ required: true }) props!: ChipProps;
}
