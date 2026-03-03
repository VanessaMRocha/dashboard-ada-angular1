import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable, switchMap } from 'rxjs';
import { Transfer } from '../models/transfer.model';

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
  createTransfer(transfer: Transfer): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/transfers`, transfer).pipe(
      switchMap(() => {
        // busca conta atual
        return this.http.get<{ id: number; name: string; balance: number }>(
          `${this.apiUrl}/account`
        ).pipe(
          switchMap((account) => {
            const newBalance = account.balance + transfer.amount;
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

  getAccount(): Observable<{ id: number; name: string; balance: number }> {
    return this.http.get<{ id: number; name: string; balance: number }>(
      `${this.apiUrl}/account`
    );
  }
}



