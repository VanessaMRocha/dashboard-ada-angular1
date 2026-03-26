import { Component } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-credit-card-invoice',
  imports: [ MatIcon, MatCardModule],
  templateUrl: './credit-card-invoice.component.html',
  styleUrl: './credit-card-invoice.component.css'
})
export class CreditCardInvoiceComponent {

}
