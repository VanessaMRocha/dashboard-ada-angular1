import { Component, inject, OnInit } from '@angular/core';
import { StatusLoginService } from '../../../login/services/status-login.service';

@Component({
  selector: 'app-personal-data',
  imports: [],
  templateUrl: './personal-data.component.html',
  styleUrl: './personal-data.component.css'
})
export class PersonalDataComponent implements OnInit{
  private readonly statusLogin = inject(StatusLoginService);

  username: string = '';

  ngOnInit() {
    this.statusLogin.username$.subscribe(nome => {
      this.username = nome;
    });
  }
}
