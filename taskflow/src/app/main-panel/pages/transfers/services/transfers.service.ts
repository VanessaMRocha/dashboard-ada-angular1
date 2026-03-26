import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable, switchMap, throwError } from 'rxjs';
import { Transfer } from '../models/transfer.model';
import { catchError } from 'rxjs/operators';
import { Account } from '../../dashboard/models/account.model';

@Injectable({
  providedIn: 'root'
})
export class TransfersService {
  private readonly http = inject(HttpClient);

  constructor() { }

  apiUrl = 'http://localhost:3000';

  getTransfer(): Observable<Transfer[]> {
    return this.http.get<Transfer[]>(`${this.apiUrl}/transfers`);
  }

  getTransferById(id: string): Observable<Transfer> {
    return this.http.get<Transfer>(`${this.apiUrl}/transfers/${id}`);
  }

  // Realizar transferência + sobrescrever saldo
  createTransfer(transfer: Transfer): Observable<Account> {
    return this.http.post<void>(`${this.apiUrl}/transfers`, transfer).pipe(
      switchMap(() => {
        // busca conta atual
        return this.http.get<{ id: number; name: string; balance: number }>(
          `${this.apiUrl}/account`
        ).pipe(
          switchMap((account) => {
            const newBalance = account.balance + transfer.amount;
            const payload = {
              balance: newBalance,
              item: { balance: newBalance },
            };
            return this.http
              .patch<Account>(`${this.apiUrl}/account`, payload)
              .pipe(
                catchError((err) => {
                  console.error(err);
                  return throwError(() => new Error('Erro ao atualizar o saldo'));
                })
              );
          })
        );
      })
    );
  }

  getAccount(): Observable<{ id: number; name: string; balance: number }> {
    return this.http.get<{ id: number; name: string; balance: number }>(
      `${this.apiUrl}/account`
    );
  }
}



