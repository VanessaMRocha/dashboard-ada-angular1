import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class StatusLoginService {

  constructor() { }

  private usernameSubject = new BehaviorSubject<string>('');
  username$ = this.usernameSubject.asObservable();

  private passwordSubject = new BehaviorSubject<string>('');
  senha$ = this.passwordSubject.asObservable();

  private exibeLoginSubject = new BehaviorSubject<boolean>(true);
  exibeLogin$ = this.exibeLoginSubject.asObservable();

  setUsername(nome: string) {
    this.usernameSubject.next(nome);
  }

  setPassword(senha: string) {
    this.passwordSubject.next(senha);
  }

  setExibeLogin(valor: boolean) {
    this.exibeLoginSubject.next(valor);
  }

  logout(): void {
    this.usernameSubject.next('');
    this.exibeLoginSubject.next(true);
  }
}



  