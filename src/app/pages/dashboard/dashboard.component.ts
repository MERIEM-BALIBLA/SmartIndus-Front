// dashboard.component.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import {SidebarComponent} from '../../shared/sidebar/sidebar.component';
import {NavbarComponent} from '../../shared/navebar/navebar.component';


@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
  standalone: true,
  imports: [CommonModule, RouterModule, SidebarComponent, NavbarComponent]
})
export class DashboardComponent {
  // Logique du dashboard si nécessaire
}
