import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { StatusLoginService } from '../main-panel/pages/login/services/status-login.service';
import { Pages } from '../constants/pages.enum';
import { RouterService } from '../core/services/router.service';

@Component({
  selector: 'app-header',
  imports: [MatButtonModule, MatIconModule, CommonModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
})
export class HeaderComponent {
  
  username: string = '';

  constructor(
    private statusLogin: StatusLoginService,
    private routerService: RouterService
  ) {}

  ngOnInit() {
    this.statusLogin.username$.subscribe(nome => {
      this.username = nome;
    });
  }

  redirectToPage(page: Pages): void {
      this.routerService.setCurrentPage(page);
  }

  efetuarLogout(): void {
    // Limpa o estado de login
    this.statusLogin.logout();

    // Redireciona para a página de login
    this.redirectToPage(Pages.LOGIN);
  }


}
