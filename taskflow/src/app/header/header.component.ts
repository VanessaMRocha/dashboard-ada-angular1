import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { StatusLoginService } from '../main-panel/pages/login/services/status-login.service';
import { AuthService } from '../core/services/auth.service';
import { TranslateService } from '@ngx-translate/core';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-header',
  imports: [MatButtonModule, MatIconModule, CommonModule, TranslatePipe],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
})
export class HeaderComponent implements OnInit {

  private readonly statusLogin = inject(StatusLoginService);
  private readonly authService = inject(AuthService);
  private readonly translate = inject(TranslateService)

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

  mudarIdioma(idioma: string) {
    this.translate.use(idioma);
  }

}
