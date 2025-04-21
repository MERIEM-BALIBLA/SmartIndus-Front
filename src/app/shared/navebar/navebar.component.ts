// navbar.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-navbar',  // <-- corriger ici

  templateUrl: './navebar.component.html',
  styleUrls: ['./navebar.component.css'],
  standalone: true,
  imports: [CommonModule, RouterModule]
})
export class NavbarComponent implements OnInit {
  pageTitle = 'Tableau de bord';
  userName = 'John Doe';
  userInitials = 'JD';
  isUserMenuOpen = false;

  constructor(private router: Router) {}

  ngOnInit() {
    // Mettre à jour le titre de la page en fonction de la route
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      this.updatePageTitle();
    });
  }

  toggleUserMenu() {
    this.isUserMenuOpen = !this.isUserMenuOpen;
  }

  toggleSidebar() {
    // Logique pour afficher/cacher la sidebar sur mobile
  }

  logout() {
    localStorage.removeItem('token');
    this.router.navigate(['/login']);
  }

  private updatePageTitle() {
    const path = this.router.url.split('/').pop() || '';

    switch(path) {
      case 'home':
        this.pageTitle = 'Tableau de bord';
        break;
      case 'profile':
        this.pageTitle = 'Profil';
        break;
      // Ajoutez d'autres titres selon vos routes
      default:
        this.pageTitle = 'Smart Indus';
    }
  }
}
