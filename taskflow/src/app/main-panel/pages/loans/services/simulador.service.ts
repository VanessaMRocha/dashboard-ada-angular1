import { Injectable } from '@angular/core';

export interface LoanSimulationRequest {
  amount: number;
  parcelas: number;
  interestRate: number; // taxa anual em %
}

export interface LoanSimulationResult {
  monthlyInstallment: number;
  totalPayment: number;
  totalInterest: number;
}

@Injectable({
  providedIn: 'root'
})
export class SimuladorService {

  private lastResult?: LoanSimulationResult;

  simulateLoan(request: LoanSimulationRequest): LoanSimulationResult {
    const principal = request.amount;
    const months = request.parcelas;
    const annualRate = request.interestRate / 100;
    const monthlyRate = annualRate / 12;

    const monthlyInstallment =
      (principal * monthlyRate) /
      (1 - Math.pow(1 + monthlyRate, -months));

    const totalPayment = monthlyInstallment * months;
    const totalInterest = totalPayment - principal;

    this.lastResult = {
      monthlyInstallment,
      totalPayment,
      totalInterest
    };

    return this.lastResult;
  }

  getLastResult(): LoanSimulationResult | undefined {
    return this.lastResult;
  }
}