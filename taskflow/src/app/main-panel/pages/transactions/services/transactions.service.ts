import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable, switchMap } from 'rxjs';
import { Transaction } from '../models/transaction.model';
import { TransactionTypes } from '../constants/transaction-types.enum';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class TransactionsService {
  private readonly http = inject(HttpClient);

  apiUrl = 'http://localhost:3000';

  getTransactions(): Observable<Transaction[]> {
    return this.http.get<Transaction[]>(`${this.apiUrl}/transactions`);
  }

  getTransactionById(id: string): Observable<Transaction> {
    return this.http.get<Transaction>(`${this.apiUrl}/transactions/${id}`);
  }

  // Criação de transação + sobrescrever saldo
  createTransaction(transaction: Transaction): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/transactions`, transaction).pipe(
      switchMap(() => {
        // busca conta atual
        return this.http.get<{ id: number; name: string; balance: number }>(
          `${this.apiUrl}/account`
        ).pipe(
          switchMap((account) => {
            const newBalance = account.balance + transaction.amount;
            // sobrescreve objeto account inteiro
            return this.http.put<void>(`${this.apiUrl}/account`, {
              id: account.id,
              name: account.name,
              balance: newBalance,
            });
          })
        );
      })
    );
  }

  updateTransaction(transaction: Transaction, id: string): Observable<void> {
    return this.getTransactionById(id).pipe(
      switchMap((oldTransaction) =>
        this.http.put<void>(`${this.apiUrl}/transactions/${id}`, transaction).pipe(
          switchMap(() =>
            this.getAccount().pipe(
              switchMap((account) => {
                // diferença entre novo e antigo
                const diff = transaction.amount - oldTransaction.amount;
                const newBalance = account.balance + diff;

                return this.http.put<void>(`${this.apiUrl}/account`, {
                  id: account.id,
                  name: account.name,
                  balance: newBalance,
                });
              })
            )
          )
        )
      )
    );
  }

  deleteTransaction(id: string): Observable<void> {
    return this.getTransactionById(id).pipe(
      switchMap((transaction) =>
        this.http.delete<void>(`${this.apiUrl}/transactions/${id}`).pipe(
          switchMap(() =>
            this.getAccount().pipe(
              switchMap((account) => {
                // devolve o valor da transação excluída
                const newBalance = account.balance - transaction.amount;

                return this.http.put<void>(`${this.apiUrl}/account`, {
                  id: account.id,
                  name: account.name,
                  balance: newBalance,
                });
              })
            )
          )
        )
      )
    );
  }

  getAccount(): Observable<{ id: number; name: string; balance: number }> {
    return this.http.get<{ id: number; name: string; balance: number }>(
      `${this.apiUrl}/account`
    );
  }
}