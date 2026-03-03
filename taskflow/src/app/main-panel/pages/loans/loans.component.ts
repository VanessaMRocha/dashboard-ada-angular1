import { Component, inject } from '@angular/core';
import { SearchLoanComponent } from './component/search-loan/search-loan.component';
import { ResultLoanComponent } from './component/result-loan/result-loan.component';
import { LoansPagesEnum } from './constants/loans-pages.enum';
import { RouterService } from '../../../core/services/router.service';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-loans',
  imports: [SearchLoanComponent, ResultLoanComponent, AsyncPipe],
  templateUrl: './loans.component.html',
  styleUrl: './loans.component.css'
})
export class LoansComponent {

  private readonly routerService = inject(RouterService);

  page$ = this.routerService.getLoanPage();
  pagesEnum = LoansPagesEnum;

}
