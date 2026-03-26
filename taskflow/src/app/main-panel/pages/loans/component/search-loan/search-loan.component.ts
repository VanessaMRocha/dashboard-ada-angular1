import { Component, OnInit, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { NgxMaskDirective } from 'ngx-mask';
import { SimuladorService, LoanSimulationRequest  } from '../../services/simulador.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-search-loan',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatInputModule,
    MatFormFieldModule,
    NgxMaskDirective
  ],
  templateUrl: './search-loan.component.html',
  styleUrl: './search-loan.component.css'
})
export class SearchLoanComponent implements OnInit {

  private readonly simuladorService = inject(SimuladorService);
  private readonly router = inject(Router)

  form!: FormGroup;

  constructor() {}

  ngOnInit(): void {
    this.buildForm();
  }

  buildForm(): void {
    this.form = new FormGroup({
      amount: new FormControl(null, Validators.required),
      parcelas: new FormControl(null, [
        Validators.required,
        Validators.min(12),
        Validators.max(300),
      ]),
      interestRate: new FormControl(null, [
        Validators.required,
        Validators.min(5),
        Validators.max(10),
      ]),
    });
  }

  onSubmit(): void {
    if (this.form.valid) {
      const payload: LoanSimulationRequest = this.form.getRawValue();
      this.simuladorService.simulateLoan(payload);
      this.router.navigate(['/emprestimo/simulacao']);
    }
  }
}