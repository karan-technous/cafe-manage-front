import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
// import { MatIconModule } from '@angular/material';

@Component({
  selector: 'app-admin-navigation',
  imports: [RouterLink,RouterLinkActive],
  templateUrl: './admin-navigation.component.html',
  styleUrl: './admin-navigation.component.css'
})
export class AdminNavigationComponent {

}
