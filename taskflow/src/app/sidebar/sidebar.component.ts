import { Component } from '@angular/core'
import { MenuItem } from '../models/menu-item.model';
import { MatIcon } from '@angular/material/icon';
import { RouterModule } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-sidebar',
  imports: [MatIcon, RouterModule, TranslatePipe],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css',
})
export class SidebarComponent {

  constructor() {}

  menuItems: MenuItem[] = [
    {
      label: 'SIDEBAR.DASHBOARD',
      icon: 'dashboard',
      link: '/dashboard',
      selected: true,
    },
    {
      label: 'Extrato',
      icon: 'receipt_long',
      link: '/transacoes',
      selected: false,
    },
    {
      label: 'SIDEBAR.TRANSFER',
      icon: 'currency_exchange',
      link: '/transferencia',
      selected: false,
    },
    {
      label: 'SIDEBAR.LOAN',
      icon: 'calculate',
      link: '/emprestimo',
      selected: false,
    },
    {
      label: 'SIDEBAR.PROFILE',
      icon: 'person',
      link: '/perfil',
      selected: false,
    },
    
  ];

}

  /*
    Comunicação entre components
      DO .ts para o template
        Interpolação de string {{}
      Pai pra filho
        Property Binding []
      Filho para pai
        Event binding ()
      Pai para filho e filho para pai, ao mesmo tempo
        Two way binding [()]
      Comunicação entre componentes irmãos
        Estado centralizado (services ou ngrx)
  */


