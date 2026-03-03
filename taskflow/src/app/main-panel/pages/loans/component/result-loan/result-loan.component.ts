import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { SimuladorService, LoanSimulationResult } from '../../services/simulador.service';
import { LoansPagesEnum } from '../../constants/loans-pages.enum';
import { RouterService } from '../../../../../core/services/router.service';

@Component({
  selector: 'app-result-loan',
  standalone: true,
  imports: [CommonModule, MatCardModule],
  templateUrl: './result-loan.component.html',
  styleUrl: './result-loan.component.css'
})
export class ResultLoanComponent implements OnInit {

  private readonly simuladorService = inject(SimuladorService);
  private readonly routerService = inject(RouterService);

  result?: LoanSimulationResult;

  ngOnInit(): void {
    this.result = this.simuladorService.getLastResult();
  }

  backToSearch(): void {
    this.routerService.setLoanPage(LoansPagesEnum.SEARCH);
  }

}
