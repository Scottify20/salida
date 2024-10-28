import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CollapsibleTextSectionService {
  // this will collapse all instances of the collapsibleTextSection component exept the one that has it's uuid set to this subject
  collapseOthers$ = new BehaviorSubject<string>('');

  // stores the scrollTops of the text for each instance of the component
  scrollTops: { [key: string]: number }[] = [];

  setInitialScrolltTop() {}
}
