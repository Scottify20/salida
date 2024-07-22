import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Router } from 'express';

@Component({
  selector: 'app-buttons-header',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './buttons-header.component.html',
  styleUrl: './buttons-header.component.scss',
})
export class ButtonsHeaderComponent {
  @Input() headerButtons: HeaderButton[] = [];
}

export interface HeaderButton {
  type: 'icon' | 'text';
  text?: string;
  iconPath?: string;
  anchor?: {
    urlType: 'internal' | 'external';
    path: string;
    target: '_self' | '_blank';
  };
  actionCallback?: () => void;
}
