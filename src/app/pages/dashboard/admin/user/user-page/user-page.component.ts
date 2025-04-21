import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {User} from '../../../../../core/interface/user.interface';
import {UserService} from '../../../../../service/user.service';

@Component({
  selector: 'app-user',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './user-page.component.html',
  styleUrls: ['./user-page.component.css'],
})
export class UserPageComponent implements OnInit {
  users: User[] = [];
  selectedUserId: string = '';
  selectedUserRole: string = '';
  currentPage = 0;
  pageSize = 2;
  totalPages = 0;
  totalElements = 0;
  protected Math = Math;

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.userService.getUsers(this.currentPage, this.pageSize).subscribe({
      next: (response) => {
        this.users = response.content;
        this.totalPages = response.totalPages;
        this.totalElements = response.totalElements;
        console.log('Users loaded:', this.users);
      },
      error: (error) => {
        console.error('Error loading users:', error);
      }
    });
  }

  onPageChange(page: number): void {
    this.currentPage = page;
    this.loadUsers();
  }

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

  openEditModal(userId: string, currentRole: string): void {
    const modal = document.getElementById('my_modal_1') as HTMLDialogElement;
    if (modal) {
      modal.showModal();
      this.selectedUserId = userId;
      this.selectedUserRole = currentRole;
    }

    const roleSelect = document.getElementById('role') as HTMLSelectElement;
    if (roleSelect) {
      roleSelect.value = currentRole;
    }
  }

  onDelete(id: string) {
    this.userService.deleteUser(id).subscribe({
      next: () => {
        console.log('User deleted successfully');
        this.loadUsers(); // Reload users after deletion
      },
      error: (error) => {
        console.error('Error deleting user:', error);
      }
    });
  }

  onRoleUpdated() {
    this.loadUsers(); // Reload users after role update
  }
}
