import { Component, inject, Input, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { provideNativeDateAdapter } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { NgxMaskDirective } from 'ngx-mask';
import { first } from 'rxjs';
import { RouterService } from '../../../../../core/services/router.service';
import { TransactionPagesEnum } from '../../constants/transaction-pages.enum';
import { TransactionTypes } from '../../constants/transaction-types.enum';
import { Transaction } from '../../models/transaction.model';
import { TransactionsService } from '../../services/transactions.service';
import { DatePipe } from '@angular/common';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-create-transaction',
  imports: [
    ReactiveFormsModule,
    MatInputModule,
    MatFormFieldModule,
    MatDatepickerModule,
    MatSelectModule,
    NgxMaskDirective,
    DatePipe,
  ],
  providers: [provideNativeDateAdapter()],
  templateUrl: './create-transaction.component.html',
  styleUrl: './create-transaction.component.css',
})
export class CreateTransactionComponent implements OnInit {
  private readonly transactionsService = inject(TransactionsService);
  private readonly routerService = inject(RouterService);
  private readonly dialog = inject(MatDialog);

  @Input() id?: string;

  form!: FormGroup;
  transactionTypesEnum = TransactionTypes;
  // today = new Date().toISOString().substring(0, 10);
  todayLocale = new Date().toLocaleDateString().split('/');
  todayISO = `${this.todayLocale[2]}-${this.todayLocale[1]}-${this.todayLocale[0]}`;

  ngOnInit(): void {
    this.buildForm();

    if (this.id) {
      this.getTransactionById();
    }

    this.form
      .get('date')
      ?.valueChanges.subscribe(() => console.log(this.form.get('date')));
  }

  buildForm(): void {
    this.form = new FormGroup({
      date: new FormControl(this.todayISO, [
        Validators.required,
        this.dateRangeValidator(new Date(2026, 0, 1), new Date()),
      ]),
      description: new FormControl(null, [
        Validators.required,
        Validators.minLength(5),
        Validators.maxLength(100),
      ]),
      amount: new FormControl(null, Validators.required),
      type: new FormControl(null, Validators.required),
    });
  }

  getTransactionById(): void {
    this.transactionsService
      .getTransactionById(this.id!)
      .pipe(first())
      .subscribe({
        next: (transaction) => {
          this.form.patchValue(transaction);
        },
        error: (err) => {
          console.log(err);
        },
      });
  }

  onSubmit(): void {
    const payload: Transaction = this.form.getRawValue();
    payload.amount =
      (payload.type === TransactionTypes.EXPENSE ? -1 : 1) * payload.amount;

    this.transactionsService
      .getAccount() 
      .pipe(first())
      .subscribe({
        next: (account) => {
          const newBalance = account.balance + payload.amount;

          if (newBalance < 0) {
            // abre o dialog
            const dialogRef = this.dialog.open(ConfirmDialogComponent);

            dialogRef.afterClosed().subscribe((usarChequeEspecial: boolean | undefined) => {
              if (!usarChequeEspecial) {
                return; // usuário disse Não → não salva
              }
              // usuário disse Sim → continua e salva
              if (this.id) {
                this.updateTransaction(payload);
                return;
              }

              this.saveTransaction(payload);
            });
          }
          else{
            if (this.id) {
              this.updateTransaction(payload);
              return;
            }

            this.saveTransaction(payload);
          }
        }  
    });
  }

  saveTransaction(payload: Transaction): void {
    this.transactionsService
      .createTransaction(payload)
      .pipe(first())
      .subscribe({
        next: () => {
          console.log('Sucesso!');
          this.backToList();
        },
        error: (err) => {
          console.log(err);
        },
      });
  }

  updateTransaction(payload: Transaction): void {
    this.transactionsService
      .updateTransaction(payload, this.id!)
      .pipe(first())
      .subscribe({
        next: () => {
          console.log('Sucesso!');
          this.backToList();
        },
        error: (err) => {
          console.log(err);
        },
      });
  }

  backToList(): void {
    this.routerService.setTransactionPage(TransactionPagesEnum.LIST);
  }

  dateRangeValidator(minDate: Date, maxDate: Date): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) return null;

      const value = new Date(control.value);

      if (isNaN(value.getTime())) {
        return { invalidDate: true };
      }

      if (value <= minDate || value >= maxDate) {
        return {
          dateOutOfRange: {
            min: minDate,
            max: maxDate,
            actual: value,
          },
        };
      }

      return null;
    };
  }
}


