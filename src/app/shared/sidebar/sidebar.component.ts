// sidebar.component.ts
import {Component, ElementRef, ViewChild} from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css'],
  standalone: true,
  imports: [CommonModule, RouterModule]
})
export class SidebarComponent {
  constructor(private router: Router) {}
  isSidebarOpen = false;

  @ViewChild('loadingRef') loadingRef!: ElementRef;

  ngOnInit(): void {
    // setTimeout(() => {
    //   this.loadingRef.nativeElement.classList.add('hidden');
    // }, 1000); // Simule le chargement
  }

  toggleSidebar(): void {
    this.isSidebarOpen = !this.isSidebarOpen;
  }

  closeSidebar(): void {
    this.isSidebarOpen = false;
  }

  logout(): void {
    localStorage.removeItem('jwt'); // supprime le token
    this.router.navigate(['/login']); // redirige vers la page de login
  }

}
