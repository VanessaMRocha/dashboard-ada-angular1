import { Component, inject, OnInit, signal } from '@angular/core';
import { StatusLoginService } from '../../../login/services/status-login.service';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'app-security-data',
  imports: [ MatIcon ],
  templateUrl: './security-data.component.html',
  styleUrl: './security-data.component.css'
})

export class SecurityDataComponent implements OnInit {

  private readonly statusLogin = inject(StatusLoginService);

  senha: string = '';

  isSenhaVisible = signal(false);

  ngOnInit() {
    this.statusLogin.senha$.subscribe(senha => {
      this.senha = senha;
    });
  }

  toogleSenha(): void {
    this.isSenhaVisible.update((visible) => !visible);
  }
}
