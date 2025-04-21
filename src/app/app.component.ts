import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {MatIconModule} from '@angular/material/icon';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  imports: [
    RouterOutlet,
    MatIconModule
  ],
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'smartindus-frontend';
}
