import { Component, Input } from '@angular/core';

export interface CategoryChipProps {
  label: string;
  iconURL: string;
  onClick: () => void;
}

@Component({
  selector: 'app-category-chip',
  imports: [],
  templateUrl: './category-chip.component.html',
  styleUrl: './category-chip.component.scss',
})
export class CategoryChipComponent {
  @Input({ required: true }) props!: CategoryChipProps;
}
