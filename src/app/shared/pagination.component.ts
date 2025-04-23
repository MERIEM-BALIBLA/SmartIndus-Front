// pagination.component.ts
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-pagination',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="flex justify-center items-center space-x-2 my-4">
      <button
        [disabled]="currentPage === 0"
        (click)="onPageChange(0)"
        class="px-3 py-1 rounded border"
        [ngClass]="currentPage === 0 ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-white text-gray-700 hover:bg-gray-100'"
      >
        First
      </button>

      <button
        [disabled]="currentPage === 0"
        (click)="onPageChange(currentPage - 1)"
        class="px-3 py-1 rounded border"
        [ngClass]="currentPage === 0 ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-white text-gray-700 hover:bg-gray-100'"
      >
        Prev
      </button>

      <div *ngFor="let page of visiblePages" class="flex items-center">
        <button
          (click)="onPageChange(page)"
          class="px-3 py-1 rounded border"
          [ngClass]="currentPage === page ? 'bg-blue-500 text-white' : 'bg-white text-gray-700 hover:bg-gray-100'"
        >
          {{ page + 1 }}
        </button>
      </div>

      <button
        [disabled]="currentPage === totalPages - 1 || totalPages === 0"
        (click)="onPageChange(currentPage + 1)"
        class="px-3 py-1 rounded border"
        [ngClass]="currentPage === totalPages - 1 || totalPages === 0 ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-white text-gray-700 hover:bg-gray-100'"
      >
        Next
      </button>

      <button
        [disabled]="currentPage === totalPages - 1 || totalPages === 0"
        (click)="onPageChange(totalPages - 1)"
        class="px-3 py-1 rounded border"
        [ngClass]="currentPage === totalPages - 1 || totalPages === 0 ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-white text-gray-700 hover:bg-gray-100'"
      >
        Last
      </button>

      <span class="ml-2 text-sm text-gray-600">
        Page {{ currentPage + 1 }} of {{ totalPages || 1 }} ({{ totalElements }} items)
      </span>
    </div>
  `,
})
export class PaginationComponent {
  @Input() currentPage: number = 0;
  @Input() totalPages: number = 0;
  @Input() totalElements: number = 0;
  @Output() pageChange = new EventEmitter<number>();

  get visiblePages(): number[] {
    const maxPages = 5;
    if (this.totalPages <= maxPages) {
      return Array(this.totalPages).fill(0).map((_, i) => i);
    }

    let start = Math.max(0, this.currentPage - Math.floor(maxPages / 2));
    let end = Math.min(this.totalPages - 1, start + maxPages - 1);

    if (end - start + 1 < maxPages) {
      start = Math.max(0, end - maxPages + 1);
    }

    return Array(end - start + 1).fill(0).map((_, i) => start + i);
  }

  onPageChange(page: number): void {
    this.pageChange.emit(page);
  }
}
