import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { StatusLoginService } from '../main-panel/pages/login/services/status-login.service';
import { AuthService } from '../core/services/auth.service';

@Component({
  selector: 'app-header',
  imports: [MatButtonModule, MatIconModule, CommonModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
})
export class HeaderComponent {

  private readonly statusLogin = inject(StatusLoginService);
  private readonly authService = inject(AuthService);

  username: string = '';

  constructor(  ) {}

  ngOnInit() {
    this.statusLogin.username$.subscribe(nome => {
      this.username = nome.split('@')[0];
    });
  }

  logout() {
    this.authService.logout();
  }

  isAuthenticated = this.authService.isAuthenticated;

}
