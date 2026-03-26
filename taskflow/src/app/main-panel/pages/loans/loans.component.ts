import { Component, signal } from '@angular/core';
import { SearchLoanComponent } from './component/search-loan/search-loan.component';
import { MatCardModule } from '@angular/material/card';
import { CurrencyPipe } from '@angular/common';

@Component({
  selector: 'app-loans',
  imports: [SearchLoanComponent, MatCardModule, CurrencyPipe ],
  templateUrl: './loans.component.html',
  styleUrl: './loans.component.css'
})
export class LoansComponent {

  loanLimit = signal(180000);

}
