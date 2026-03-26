import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable, switchMap } from 'rxjs';
import { Transaction } from '../models/transaction.model';
import { Account } from '../../dashboard/models/account.model';

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
  createTransaction(transaction: Omit<Transaction, 'id'>): Observable<Account> {
    const headers = new HttpHeaders({
      Authorization: 'Bearer token-secreto-banco-123',
      'Content-Type': 'application/json'
    });
    return this.http.post<Transaction>(`${this.apiUrl}/transactions`, transaction, { headers }).pipe(
      switchMap(() => {
        // busca conta atual
        return this.http.get<{ id: number; name: string; balance: number }>(
          `${this.apiUrl}/account`
        ).pipe(
          switchMap((account) => {
            const newBalance = account.balance + transaction.amount;
            // sobrescreve objeto account inteiro
            return this.http.put<Account>(`${this.apiUrl}/account`, {
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
    // Enviar um motivo de cancelamento junto com a requisição de DELETE
    const params = new HttpParams().set('motivo', 'cancelamento');
    return this.getTransactionById(id).pipe(
      switchMap((transaction) =>
        this.http.delete<void>(`${this.apiUrl}/transactions/${id}`, { params }).pipe(
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