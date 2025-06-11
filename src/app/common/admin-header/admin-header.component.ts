import { Component } from '@angular/core';
import { EMAIL_NAME, getLocalStorage, removeLocalStorage, TOKEN_NAME } from '../../utils/token';
import { NgIf } from '@angular/common';
import { Router,  } from '@angular/router';

@Component({
  selector: 'app-admin-header',
  imports: [NgIf],
  templateUrl: './admin-header.component.html',
  styleUrl: './admin-header.component.css'
})
export class AdminHeaderComponent {
    user :string | null= getLocalStorage(EMAIL_NAME);
    isVisible = false;

    constructor(private router:Router){
      
    }
    onChangeNav(){
    this.isVisible = !this.isVisible;
    }

    logout(){
      removeLocalStorage(EMAIL_NAME);
      removeLocalStorage(TOKEN_NAME);
      this.router.navigate(['/login']);

    }
}
