import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { StatusLoginService } from './services/status-login.service';
import { RouterService } from '../../../core/services/router.service';
import { Pages } from '../../../constants/pages.enum';

@Component({
  selector: 'app-login',
  imports: [ FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {

  username: string = '';
  password: string = '';
  exibeLogin: boolean = true;

  private readonly routerService = inject(RouterService);
  private readonly statusLogin = inject(StatusLoginService);

    redirectToPage(page: Pages): void {
        this.routerService.setCurrentPage(page);
    }

  onSubmit() {
      alert('Login realizado com sucesso!'); //Simulação de login
      this.exibeLogin = false;
      this.statusLogin.setUsername(this.username);
      this.statusLogin.setExibeLogin(this.exibeLogin);
      this.redirectToPage(Pages.DASHBOARD);

  }
}


