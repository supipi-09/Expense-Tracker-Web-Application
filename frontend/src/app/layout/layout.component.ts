import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { CommonModule } from '@angular/common'; // <-- Import this

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [
    RouterModule,
    SidebarComponent,
    CommonModule, // <-- Add here
  ],
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.css'],
})
export class LayoutComponent {
  showSidebar = true; // Or your logic
}
