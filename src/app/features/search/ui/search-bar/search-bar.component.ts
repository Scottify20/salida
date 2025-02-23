import { Component, Output, EventEmitter, Input, Signal, signal, ViewChild, ElementRef, DestroyRef, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormBuilder, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { debounceTime, Subject } from 'rxjs';

@Component({
  selector: 'app-search-bar',
  imports: [ReactiveFormsModule],
  templateUrl: './search-bar.component.html',
  styleUrl: './search-bar.component.scss',
})
export class SearchBarComponent {
  private fb = inject(FormBuilder);
  private destroyRef = inject(DestroyRef);

  constructor() {
    // subscribes to the value of the search input
    // then sets hasValue whether the search input has a value or not
    this.searchForm.valueChanges
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((value) => {
        this.hasValue.set(!!value.searchQuery);
      });

    this.emitValue$
      .pipe(takeUntilDestroyed(this.destroyRef), debounceTime(500))
      .subscribe((value) => {
        if (value === this.previousValue) {
          return;
        }
        this.search.emit(value);
        this.previousValue = value;
      });
  }

  @Output() search = new EventEmitter<string>();
  private emitValue$ = new Subject<string>();

  @ViewChild('searchInput') searchInput!: ElementRef;
  @Input({ required: true }) defaultValue!: Signal<string>;
  // this sets the default value of the search bar with the value passed by the parent (for maintaining the value even if the searchbar is destroyed)
  ngAfterViewInit() {
    if (!this.defaultValue()) {
      return;
    }
    const searchInputEl = this.searchInput.nativeElement as HTMLInputElement;
    searchInputEl.value = this.defaultValue();
    this.hasValue.set(true);
  }

  searchForm = this.fb.group({
    searchQuery: ['', Validators.required],
  });

  hasValue = signal(false);
  previousValue = '';

  onClear() {
    // outputs 'clear-search-bar' when the clear (X) button is clicked
    this.searchForm.reset();
    this.hasValue.set(false);
    this.emitValue$.next('cleared-search-bar');
  }

  onSubmit(event: Event, searchbar: HTMLInputElement) {
    event.preventDefault();
    searchbar.blur();
    // outputs the typed string when the search or enter button is pushed/clicked
    if (this.searchForm.valid) {
      this.emitValue$.next(this.searchForm.value.searchQuery || '');
    }
  }
}
