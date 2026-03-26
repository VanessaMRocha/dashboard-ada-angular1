import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable , throwError} from 'rxjs';
import { Account } from '../models/account.model';
import { catchError, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class DashboardService {
  private readonly http = inject(HttpClient);

  apiUrl = 'http://localhost:3000';

  private normalizeAccount(payload: Account | { item?: Account } | null | undefined): Account {
    if (!payload) {
      return { id: 0, name: 'Cliente', balance: 0 };
    }

    if ('item' in payload && payload.item) {
      return payload.item;
    }

    return payload as Account;
  }

  getAccount(): Observable<Account> {
    return this.http
      .get<Account | { item?: Account }>(`${this.apiUrl}/account`)
      .pipe(
        catchError(() => this.http.get<Account | { item?: Account }>(`${this.apiUrl}/account/item`)),
      )
      .pipe(map((account) => this.normalizeAccount(account)));
  }

  updateBalance(newBalance: number): Observable<Account> {
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
  }
}

