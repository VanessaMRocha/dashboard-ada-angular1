import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { StatusLoginService } from './services/status-login.service';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  imports: [ CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {

  email: string = '';
  password: string = '';
  errorMessage: string = '';
  exibeLogin: boolean = true;

  private readonly statusLogin = inject(StatusLoginService);
  private readonly router = inject(Router);
  private authService = inject(AuthService);

  onSubmit() {
    if (!this.authService.login(this.email, this.password)){
      this.errorMessage = 'Login ou senha incorretos!'
    }
    else{
      this.statusLogin.setUsername(this.email);
    }
  }
}


