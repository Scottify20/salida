import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { EpisodeGroupComponent } from './episode-group/episode-group.component';

@Component({
  selector: 'app-seasons',
  standalone: true,
  imports: [EpisodeGroupComponent],
  templateUrl: './seasons.component.html',
  styleUrl: './seasons.component.scss',
})
export class SeasonsComponent {}
