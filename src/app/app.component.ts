import { Component } from '@angular/core';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { FooterComponent } from './common/footer/footer.component';
import { HeaderComponent } from './common/header/header.component';
import { AdminHeaderComponent } from './common/admin-header/admin-header.component';
import { AdminNavigationComponent } from './common/admin-navigation/admin-navigation.component';

@Component({
  selector: 'app-root',
  imports: [FooterComponent,HeaderComponent,RouterOutlet,AdminHeaderComponent,AdminNavigationComponent,],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
  standalone:true
})
export class AppComponent {
  title = 'cafe-mangament-frontend';
  routesIsAdmin=false

  constructor(private router: Router) {
    this.router.events.subscribe(() => {
      this.routesIsAdmin = this.router.url.includes('/admin');
    });
  }

}


