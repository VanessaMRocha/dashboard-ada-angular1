import { Component, inject } from '@angular/core';
import { Pages } from '../constants/pages.enum';
import { RouterService } from '../core/services/router.service';
import { MenuItem } from '../models/menu-item.model';
import { StatusLoginService } from '../main-panel/pages/login/services/status-login.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-sidebar',
  imports: [CommonModule],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css',
})
export class SidebarComponent {

  exibeLogin: boolean = true;

  constructor(
    private statusLogin: StatusLoginService,
    private routerService: RouterService
  ) {}

  ngOnInit() {
    this.statusLogin.exibeLogin$.subscribe(valor => {
      this.exibeLogin = valor;
    });
  }

  menuItems: MenuItem[] = [
    {
      label: 'Dashboard',
      icon: '',
      page: Pages.DASHBOARD,
      selected: true,
    },
    {
      label: 'Extrato',
      icon: '',
      page: Pages.TRANSACTIONS,
      selected: false,
    },
    {
      label: 'Transferência',
      icon: '',
      page: Pages.TRANSFERS,
      selected: false,
    },
    {
      label: 'Simulador de Crédito',
      icon: '',
      page: Pages.LOANS,
      selected: false,
    },
    
  ];

  redirectToPage(page: Pages): void {
    this.routerService.setCurrentPage(page);
  }


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


