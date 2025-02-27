import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { MediaSummary } from '../../../shared/interfaces/models/tmdb/All';

export interface ListData {
  listId: number;
  listName: string;
  sourceType: string;
  sourceId: number;
  sourceName: string;
  page: number;
  totalPages: number;
  totalResults: number;
  results: MediaSummary[];
}

@Injectable({
  providedIn: 'root',
})
export class ListsService {
  // private listsSubject = new BehaviorSubject<ListData[]>([]);
  // lists$: Observable<ListData[]> = this.listsSubject.asObservable();
  // private currentPageSubject = new BehaviorSubject<number>(1);
  // currentPage$: Observable<number> = this.currentPageSubject.asObservable();
  // private totalPagesSubject = new BehaviorSubject<number>(1);
  // totalPages$: Observable<number> = this.totalPagesSubject.asObservable();
  // Method to set the current page
  // setCurrentPage(page: number): void {
  //   this.currentPageSubject.next(page);
  //   // this.fetchLists(page); // Call the fetch method here or wherever appropriate
  // }
  // Example method to fetch lists
  // fetchLists(page: number): void {
  //   // Make your API call here and update the listsSubject with the new data
  //   // Also, update the totalPagesSubject with the total number of pages
  // }
}
