import { Component, EventEmitter, inject, OnInit, Output } from '@angular/core';
import { first } from 'rxjs';
import { Transfer } from '../../models/transfer.model';
import { TransfersService } from '../../services/transfers.service';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { NegativeValuesPipe } from '../../../../../shared/pipes/negative-values.pipe';
import { Router } from '@angular/router';

@Component({
  selector: 'app-list-transfers',
  imports: [
    DatePipe, 
    CurrencyPipe, 
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    NegativeValuesPipe
  ],
  templateUrl: './list-transfers.component.html',
  styleUrl: './list-transfers.component.css'
})
export class ListTransfersComponent implements OnInit {

  private readonly transfersService = inject(TransfersService);
  private readonly router = inject(Router);

  @Output() editEmitter = new EventEmitter<string>();

  transfers: Transfer[] = [];
  search: string = '';
  sortField: 'amount' | 'date' = 'date';
  sortAsc = false;

  ngOnInit(): void {
    this.getTransfers();
  }

  getTransfers(): void {
    this.transfersService
      .getTransfer()
      .pipe(first())
      .subscribe({
        next: (res) => {
          this.transfers = res;
        },
        error: (err) => {
          console.log(err);
        },
      });
  }

  redirectToCreate(): void {
    this.router.navigate(['/transferencia/criar']);
  }

  filterTransfers(): Transfer[] {
    return this.transfers
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

        return this.sortAsc ? result : -result;
      });
    }
}
