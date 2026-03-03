import { Component, EventEmitter, inject, OnInit, Output } from '@angular/core';
import { first } from 'rxjs';
import { Transaction } from '../../models/transaction.model';
import { TransactionsService } from '../../services/transactions.service';
import { CurrencyPipe, DatePipe, NgIf } from '@angular/common';
import { TransactionTypes } from '../../constants/transaction-types.enum';
import { NegativeValuesPipe } from '../../../../../shared/pipes/negative-values.pipe';
import { RouterService } from '../../../../../core/services/router.service';
import { TransactionPagesEnum } from '../../constants/transaction-pages.enum';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { forkJoin } from 'rxjs';
import { map } from 'rxjs/operators';
import { Transfer } from '../../../transfers/models/transfer.model';
import { TransfersService } from '../../../transfers/services/transfers.service';

@Component({
  selector: 'app-list-transactions',
  imports: [
    DatePipe,
    CurrencyPipe,
    NegativeValuesPipe,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    NgIf
],
  templateUrl: './list-transactions.component.html',
  styleUrl: './list-transactions.component.css',
})
export class ListTransactionsComponent implements OnInit {
  private readonly transactionsService = inject(TransactionsService);
  private readonly routerService = inject(RouterService);
  private readonly transferService = inject(TransfersService)

  @Output() editEmitter = new EventEmitter<string>();

  transactions: Transaction[] = [];
  transactionTypesEnum = TransactionTypes;
  search: string = '';
  sortField: 'amount' | 'type' | 'date' = 'date';
  sortAsc = false;

  ngOnInit(): void {
    this.getTransactions();
  }



  getTransactions(): void {
    forkJoin({
      transactions: this.transactionsService.getTransactions(),
      transfers: this.transferService.getTransfer()
    })
    .pipe(
      map(({ transactions, transfers }) => {
        const transfersMapped: Transaction[] = transfers.map(t => ({
          id: t.id,
          date: t.date,
          description: t.description,
          amount: t.amount,
          type: TransactionTypes.TRANSFER,
          destination: t.destination
        }));
        return [...transactions, ...transfersMapped];
      })
    )
    .pipe(first())
    .subscribe({
      next: (res) => {
        this.transactions = res;
      },
      error: (err) => console.log(err),
    });
  }

  redirectToCreate(): void {
    this.routerService.setTransactionPage(TransactionPagesEnum.CREATE);
  }

  onEdit(id: string): void {
    this.editEmitter.emit(id);
  }

  onDelete(id: string): void {
    this.transactionsService
      .deleteTransaction(id)
      .pipe(first())
      .subscribe({
        next: () => {
          this.getTransactions();
        },
        error: (err) => {
          console.log(err);
        },
      });
  }

  filterTransactions(): Transaction[] {
    return this.transactions
      .filter((item) =>
        item.description.toLowerCase().includes(this.search.toLowerCase())
      )
      .sort((a, b) => {
        let result = 0;

        if (this.sortField === 'amount') {
          result = a.amount - b.amount;
        } else if (this.sortField === 'date') {
          result = new Date(a.date).getTime() - new Date(b.date).getTime();
        } 
        else if (this.sortField === 'type') {
          result = a.type.localeCompare(b.type);
        }

        return this.sortAsc ? result : -result;
      });
    }
}
