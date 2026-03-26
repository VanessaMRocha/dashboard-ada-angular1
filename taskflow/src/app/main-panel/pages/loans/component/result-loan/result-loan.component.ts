import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { SimuladorService, LoanSimulationResult } from '../../services/simulador.service';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-result-loan',
  standalone: true,
  imports: [CommonModule, MatCardModule, RouterLink],
  templateUrl: './result-loan.component.html',
  styleUrl: './result-loan.component.css'
})
export class ResultLoanComponent implements OnInit {

  private readonly simuladorService = inject(SimuladorService);
  result?: LoanSimulationResult;

  ngOnInit(): void {
    this.result = this.simuladorService.getLastResult();
  }

}
