import { Component, inject } from '@angular/core';
import { CreateTransferComponent } from './components/create-transfer/create-transfer.component';
import { ListTransfersComponent } from './components/list-transfers/list-transfers.component';
import { RouterService } from '../../../core/services/router.service';
import { TransferPagesEnum } from './constants/transfer-pages.enum';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-transfers',
  imports: [ CreateTransferComponent, ListTransfersComponent, AsyncPipe],
  templateUrl: './transfers.component.html',
  styleUrl: './transfers.component.css'
})
export class TransfersComponent {
 
  private readonly routerService = inject(RouterService);

  page$ = this.routerService.getTransferPage();
  pagesEnum = TransferPagesEnum;

}




