import { Component, inject, Input, OnInit, signal } from '@angular/core';
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
import { Transfer } from '../../models/transfer.model';
import { TransfersService } from '../../services/transfers.service';
import { DatePipe } from '@angular/common';
import { ConfirmDialogComponent } from '../../../transactions/components/confirm-dialog/confirm-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';

@Component({
  selector: 'app-create-transfer',
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
  templateUrl: './create-transfer.component.html',
  styleUrl: './create-transfer.component.css'
})
export class CreateTransferComponent implements OnInit{

  private readonly transfersService = inject(TransfersService);
  private readonly router = inject(Router);
  private readonly dialog = inject(MatDialog);

  @Input() id?: string;

  form!: FormGroup;

  todayLocale = new Date().toLocaleDateString().split('/');
  todayISO = `${this.todayLocale[2]}-${this.todayLocale[1]}-${this.todayLocale[0]}`;

  ngOnInit(): void {
    this.buildForm();

    if (this.id) {
      this.getTransferById();
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
      destination: new FormControl(null, [
        Validators.required,
        Validators.pattern(/^\d{6}-\d{2}$/) // exatamente 6 dígitos, traço, 2 dígitos
      ]),
      amount: new FormControl(null, Validators.required),
      description: new FormControl(null, [
        Validators.required,
        Validators.minLength(5),
        Validators.maxLength(100),
      ]),
    });
  }

  getTransferById(): void {
    this.transfersService
      .getTransferById(this.id!)
      .pipe(first())
      .subscribe({
        next: (transfer) => {
          this.form.patchValue(transfer);
        },
        error: (err) => {
          console.log(err);
        },
      });
  }

  isTransfering = signal(false);
  error: string | null = null;
  success = false;

  onSubmit(): void {

    const payload: Transfer = this.form.getRawValue();
    payload.amount = -1 * payload.amount;
    this.transfersService
      .getAccount() 
      .pipe(first())
      .subscribe({
        next: (account) => {
          const newBalance = account.balance - payload.amount;

          if (newBalance < 0) {
            // abre o dialog
            const dialogRef = this.dialog.open(ConfirmDialogComponent);

            dialogRef.afterClosed().subscribe((usarChequeEspecial: boolean | undefined) => {
              if (!usarChequeEspecial) {
                return; // usuário disse Não → não salva
              }

              // usuário disse Sim → continua e salva
              this.saveTransaction(payload);
            });
          }
          else{
            this.saveTransaction(payload);
          }
        }  
    });
  }

  saveTransaction(payload: Transfer): void {
    this.error = null;
    this.success = false;
    this.isTransfering.set(true);

    this.transfersService
      .createTransfer(payload)
      .pipe(first())
      .subscribe({
        next: () => {
          this.success = true;
          this.backToList();
        },
        error: (err) => {
          this.error = err?.message || 'Erro ao realizar transferência';
        },
        complete: () => {
          this.isTransfering.set(false);
        }
      });
  }

  backToList(): void {
    this.router.navigate(['/transferencia']);
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




