import { Component, EventEmitter, inject, OnInit, Output, signal } from '@angular/core';
import { first } from 'rxjs';
import { Transaction } from '../../models/transaction.model';
import { TransactionsService } from '../../services/transactions.service';
import { CurrencyPipe, DatePipe, NgIf, NgClass } from '@angular/common';
import { TransactionTypes } from '../../constants/transaction-types.enum';
import { NegativeValuesPipe } from '../../../../../shared/pipes/negative-values.pipe';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { forkJoin } from 'rxjs';
import { map } from 'rxjs/operators';
import { TransfersService } from '../../../transfers/services/transfers.service';
import { Router } from '@angular/router';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'app-list-transactions',
  imports: [
    DatePipe,
    CurrencyPipe,
    NegativeValuesPipe,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    NgIf,
    MatIcon,
    NgClass
],
  templateUrl: './list-transactions.component.html',
  styleUrl: './list-transactions.component.css',
})
export class ListTransactionsComponent implements OnInit {
  private readonly transactionsService = inject(TransactionsService);
  private readonly router = inject(Router);
  private readonly transferService = inject(TransfersService)

  @Output() editEmitter = new EventEmitter<string>();

  transactions = signal<Transaction[]>([]);
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
    .subscribe((result) => {
        if (result) {
          this.transactions.set(result);
        }
      });
  }

  redirectToCreate(): void {
    this.router.navigate(['/transacoes/criar']);
  }

  onEdit(id: string): void {
    this.router.navigate([`/transacoes/editar/${id}`]);
  }

  isLoading = signal(false);
  errorMessage = signal<string | null>(null);

  onDelete(id: string): void {
    this.isLoading.set(true);
    this.errorMessage.set(null);

    this.transactionsService
      .deleteTransaction(id)
      .pipe(first())
      .subscribe({
        next: () => {
          this.getTransactions();
        },
        error: (err) => {
          console.error('Erro ao excluir transação:', err);
          this.errorMessage.set('Ocorreu um erro ao excluir a transação.');
        },
        complete: () => {
        this.isLoading.set(false);
      }
      });
  }

  filterTransactions(): Transaction[] {
    return this.transactions()
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
