import { Component, inject, OnInit, signal, effect } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { Account } from './models/account.model';
import { DashboardService } from './services/dashboard.service';
import { TransactionsService } from '../transactions/services/transactions.service';
import { first, forkJoin } from 'rxjs';
import { map } from 'rxjs/operators';
import { Transaction } from '../transactions/models/transaction.model';
import { DatePipe, CurrencyPipe, CommonModule } from '@angular/common';
import { TransactionTypes } from '../transactions/constants/transaction-types.enum';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { NegativeValuesPipe } from '../../../shared/pipes/negative-values.pipe';
import { TransfersService } from '../transfers/services/transfers.service';
import { CreditCardInvoiceComponent } from './components/credit-card-invoice/credit-card-invoice.component';
import { MatIcon } from '@angular/material/icon';
import { toSignal } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-dashboard',
  imports: [
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    DatePipe,
    FormsModule,
    CurrencyPipe,
    CommonModule,
    NegativeValuesPipe,
    CreditCardInvoiceComponent,
    MatIcon
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
})
export class DashboardComponent implements OnInit {
  private readonly dashboardService = inject(DashboardService);
  private readonly transactionsService = inject(TransactionsService);
  private readonly transferService = inject(TransfersService);

  accountData = toSignal<Account | undefined>(this.dashboardService.getAccount(), {initialValue: undefined});

  transactions: Transaction[] = [];

  search: string = '';
  sortField: keyof Transaction = 'date'; // ordena inicialmente por data
  sortAsc: boolean = false; // ordenação descrescente

  transactionTypesEnum = TransactionTypes;

  currentMonthLabel: string;

  totalIncome: number = 0;
  totalExpense: number = 0;

  isBalanceVisible = signal(true);

  constructor() {
    const now = new Date();
    const monthNames = [
      'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
      'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
    ];
    const month = monthNames[now.getMonth()];
    const year = now.getFullYear().toString().slice(-2); // 2 últimos dígitos
    this.currentMonthLabel = `${month}/${year}`;

    effect(() => {
      console.log('A visibilidade do extrato mudou para:', this.isBalanceVisible());
    });
  }

  ngOnInit(): void {
    this.getTransactions();
  }


  getTransactions(): void {
    forkJoin({
      transactions: this.transactionsService.getTransactions(),
      transfers: this.transferService.getTransfer(),
    })
      .pipe(
        map(({ transactions, transfers }) => {
          const transfersMapped: Transaction[] = transfers.map((t) => ({
            id: t.id,
            date: t.date,
            description: t.description,
            amount: t.amount,
            type: TransactionTypes.TRANSFER, // 
            destination: t.destination,
          }));
          return [...transactions, ...transfersMapped];
        })
      )
      .pipe(first())
      .subscribe({
        next: (res: Transaction[]) => {
          this.transactions = res;

          // calcula receitas e despesas do mês corrente
          const now = new Date();
          const currentMonth = now.getMonth();
          const currentYear = now.getFullYear();

          const currentMonthTransactions = this.transactions.filter((item) => {
            const itemDate = new Date(item.date);
            return (
              itemDate.getMonth() === currentMonth &&
              itemDate.getFullYear() === currentYear
            );
          });

          this.totalIncome = currentMonthTransactions
            .filter((t) => t.type === this.transactionTypesEnum.INCOME)
            .reduce((sum, t) => sum + t.amount, 0);

          this.totalExpense = currentMonthTransactions
            .filter((t) => 
              t.type === this.transactionTypesEnum.EXPENSE ||
              t.type === this.transactionTypesEnum.TRANSFER)
            .reduce((sum, t) => sum + Math.abs(t.amount), 0);
        },
        error: (err) => {
          console.log(err);
        },
      });
  }

  filterTransactions(): Transaction[] {
    const now = new Date();
    const currentMonth = now.getMonth(); // 0 = Janeiro
    const currentYear = now.getFullYear();

    return this.transactions
      .filter((item) => {
        const itemDate = new Date(item.date);
        const sameMonth = itemDate.getMonth() === currentMonth;
        const sameYear = itemDate.getFullYear() === currentYear;

        return (
          sameMonth &&
          sameYear &&
          (!this.search ||
            item.description.toLowerCase().includes(this.search.toLowerCase()) ||
            item.destination?.toLowerCase().includes(this.search.toLowerCase()))
        );
      })
      .sort((a, b) => {
        let result = 0;

        if (this.sortField === 'amount') {
          result = a.amount - b.amount;
        } else if (this.sortField === 'date') {
          result = new Date(a.date).getTime() - new Date(b.date).getTime();
        } else if (this.sortField === 'type') {
          result = (a.type ?? '').toString().localeCompare((b.type ?? '').toString());
        }

        return this.sortAsc ? result : -result;
      });
  }

  toogleBalance(): void {
    this.isBalanceVisible.update((visible) => !visible);
  }
  
} 