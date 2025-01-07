import { Component, Input } from '@angular/core';
import { Genre } from '../../../../../shared/interfaces/models/tmdb/All';

@Component({
  selector: 'app-genres',
  standalone: true,
  imports: [],
  templateUrl: './genres.component.html',
  styleUrl: './genres.component.scss',
})
export class GenresComponent {
  @Input({ required: true }) props: Genre[] = [];
}
