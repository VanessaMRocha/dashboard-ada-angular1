import { Component, inject, OnInit } from '@angular/core';
import { Pages } from '../constants/pages.enum';
import { RouterService } from '../core/services/router.service';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { TransactionsComponent } from './pages/transactions/transactions.component';
import { LoginComponent } from './pages/login/login.component';
import { AsyncPipe } from '@angular/common';
import { TransfersComponent } from "./pages/transfers/transfers.component";

@Component({
  selector: 'app-main-panel',
  imports: [DashboardComponent, TransactionsComponent, AsyncPipe, LoginComponent, TransfersComponent],
  templateUrl: './main-panel.component.html',
  styleUrl: './main-panel.component.css',
})
export class MainPanelComponent  {
  private readonly routerService = inject(RouterService);

  // page!: Pages;
  page$ = this.routerService.getCurrentPage();
  pagesEnum = Pages;

}
