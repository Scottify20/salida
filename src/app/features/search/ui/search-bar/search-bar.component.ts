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
  // this sets the default value of the search bar with the value passed by the  parent (useful for maintaining the value even if the searchbar is destroyed)
  ngAfterViewInit() {
    const searchInputEl = this.searchInput.nativeElement as HTMLInputElement;
    searchInputEl.value = this.defaultValue();
  }

  searchForm = this.fb.group({
    searchQuery: ['', Validators.required],
  });

  hasValue = false;

  private destroyRef = inject(DestroyRef);
  constructor(private fb: FormBuilder) {
    // subscribes to the value of the search input
    // then sets hasValue whether the search input has a value or not
    this.searchForm.valueChanges
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((value) => {
        this.hasValue = !!value.searchQuery;
      });
  }

  onClear() {
    // outputs an empty string '' when the clear (X) button is clicked
    this.searchForm.reset();
    this.search.emit('');
  }

  onSubmit(event: Event) {
    event.preventDefault();
    // outputs a non-empty string when the search or enter button is pushed/clicked
    if (this.searchForm.valid) {
      this.search.emit(this.searchForm.value.searchQuery || undefined);
    }
  }
}
