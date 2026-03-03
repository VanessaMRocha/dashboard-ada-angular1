import { Injectable } from '@angular/core';
import { Pages } from '../../constants/pages.enum';
import { BehaviorSubject, Observable } from 'rxjs';
import { TransactionPagesEnum } from '../../main-panel/pages/transactions/constants/transaction-pages.enum';
import { TransferPagesEnum } from '../../main-panel/pages/transfers/constants/transfer-pages.enum';
import { LoansPagesEnum } from '../../main-panel/pages/loans/constants/loans-pages.enum';

@Injectable({
  providedIn: 'root',
})
export class RouterService {
  private currentPage$ = new BehaviorSubject<Pages>(Pages.LOGIN);

  private transactionPage$ = new BehaviorSubject<TransactionPagesEnum>(
    TransactionPagesEnum.LIST,
  );

  private transferPage$ = new BehaviorSubject<TransferPagesEnum>(
    TransferPagesEnum.LIST,
  );

  private loanPage$ = new BehaviorSubject<LoansPagesEnum>(
    LoansPagesEnum.SEARCH,
  );

  setCurrentPage(page: Pages): void {
    this.currentPage$.next(page);
  }

  getCurrentPage(): Observable<Pages> {
    return this.currentPage$;
  }

  setTransactionPage(page: TransactionPagesEnum): void {
    this.transactionPage$.next(page);
  }

  getTransactionPage(): Observable<TransactionPagesEnum> {
    return this.transactionPage$;
  }

  setTransferPage(page: TransferPagesEnum): void {
    this.transferPage$.next(page);
  }

  getTransferPage(): Observable<TransferPagesEnum> {
    return this.transferPage$;
  }

  getLoanPage(): Observable<LoansPagesEnum> {
    return this.loanPage$;
  }

  setLoanPage(page: LoansPagesEnum): void {
    this.loanPage$.next(page);
  }
}
