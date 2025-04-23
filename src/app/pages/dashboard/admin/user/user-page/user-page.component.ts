import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {User} from '../../../../../core/interface/user.interface';
import {UserService} from '../../../../../service/user.service';
import {PaginationComponent} from '../../../../../shared/pagination.component';
import {FormsModule} from '@angular/forms';

@Component({
  selector: 'app-user',
  standalone: true,
  imports: [CommonModule, PaginationComponent, FormsModule],
  templateUrl: './user-page.component.html',
  styleUrls: ['./user-page.component.css'],
})
export class UserPageComponent implements OnInit {
  users: User[] = [];
  selectedUserId: string = '';
  selectedUserRole: string = '';
  currentPage = 0;
  pageSize = 10; // Increased page size for better UX
  totalPages = 0;
  totalElements = 0;
  loading = false;

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.loading = true;
    this.userService.getUsers(this.currentPage, this.pageSize).subscribe({
      next: (response) => {
        this.users = response.content;
        this.totalPages = response.totalPages;
        this.totalElements = response.totalElements;
        console.log('Users loaded:', this.users);
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading users:', error);
        this.loading = false;
      }
    });
  }

  onPageChange(page: number): void {
    this.currentPage = page;
    this.loadUsers();
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

  updateUserRole(): void {
    const roleSelect = document.getElementById('role') as HTMLSelectElement;
    const newRole = roleSelect?.value;
    console.log("Selected role:", newRole);

    if (this.selectedUserId && newRole) {
      this.userService.updateUserRole(newRole, this.selectedUserId).subscribe({
        next: (updatedUser) => {
          console.log('User role updated successfully:', updatedUser);
          this.onRoleUpdated();

          const modal = document.getElementById('my_modal_1') as HTMLDialogElement;
          if (modal) {
            modal.close();
          }
        },
        error: (error) => {
          console.error('Error updating user role:', error);
        }
      });
    }
  }

  onDelete(id: string): void {
    if (confirm('Are you sure you want to delete this user?')) {
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
  }

  onRoleUpdated(): void {
    this.loadUsers();
  }
}
