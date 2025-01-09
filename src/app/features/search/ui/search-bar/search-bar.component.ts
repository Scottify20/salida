import {
  Component,
  Output,
  EventEmitter,
  Input,
  Signal,
  signal,
  ViewChild,
  ElementRef,
  inject,
  DestroyRef,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormBuilder, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-search-bar',
  imports: [ReactiveFormsModule],
  templateUrl: './search-bar.component.html',
  styleUrl: './search-bar.component.scss',
})
export class SearchBarComponent {
  @Output() search = new EventEmitter<string>();

  @ViewChild('searchInput') searchInput!: ElementRef;
  @Input({ required: true }) defaultValue!: Signal<string>;
  // this sets the default value of the search bar with the value passed by the  parent (for maintaining the value even if the searchbar is destroyed)
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

  private destroyRef = inject(DestroyRef);
  constructor(private fb: FormBuilder) {
    // subscribes to the value of the search input
    // then sets hasValue whether the search input has a value or not
    this.searchForm.valueChanges
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((value) => {
        this.hasValue.set(!!value.searchQuery);
      });
  }

  onClear() {
    // outputs 'clear-search-bar' when the clear (X) button is clicked
    this.searchForm.reset();
    this.hasValue.set(false);
    this.emitValue('cleared-search-bar');
  }

  onSubmit(event: Event) {
    event.preventDefault();
    // outputs the typed string when the search or enter button is pushed/clicked
    if (this.searchForm.valid) {
      this.emitValue(this.searchForm.value.searchQuery || '');
    }
  }

  emitValue(value: string) {
    if (value === this.previousValue) {
      return;
    }

    this.search.emit(value);
    this.previousValue = value;
  }
}
