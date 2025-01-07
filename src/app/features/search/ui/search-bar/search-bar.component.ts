import { Component, Output, EventEmitter } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-search-bar',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './search-bar.component.html',
  styleUrl: './search-bar.component.scss',
})
export class SearchBarComponent {
  @Output() search = new EventEmitter<string>();

  searchForm = this.fb.group({
    searchQuery: ['', Validators.required],
  });

  hasValue = false;

  constructor(private fb: FormBuilder) {
    this.searchForm.valueChanges.subscribe((value) => {
      this.hasValue = !!value.searchQuery;
    });
  }

  onClear() {
    this.searchForm.reset();
    console.log('reset');
  }

  onSubmit(event: Event) {
    event.preventDefault(); // Prevent the default form submission behavior
    if (this.searchForm.valid) {
      this.search.emit(this.searchForm.value.searchQuery || undefined);
      console.log('Search query:', this.searchForm.value.searchQuery);
    }
  }
}
