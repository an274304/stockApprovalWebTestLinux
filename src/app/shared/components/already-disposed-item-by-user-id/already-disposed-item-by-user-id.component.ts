import { Component, inject, Input, OnChanges, SimpleChanges } from '@angular/core';
import { ApiResult } from '../../../core/DTOs/ApiResult';
import { AlreadyAssignedItem } from '../../../core/DTOs/AlreadyAssignedItem';
import { StockMngService } from '../../../admin/services/stock-mng.service';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-already-disposed-item-by-user-id',
  standalone: true,
  imports: [DatePipe],
  templateUrl: './already-disposed-item-by-user-id.component.html',
  styleUrl: './already-disposed-item-by-user-id.component.css'
})
export class AlreadyDisposedItemByUserIdComponent implements OnChanges {
  @Input() userId? : number;
  @Input() refreshTrigger?: boolean;

  disposedItemApiResult: ApiResult<AlreadyAssignedItem> = { dataList: [], result: false, message: 'Connection Not Available.' };
  disposedItems: AlreadyAssignedItem[] = [];

  stockService = inject(StockMngService);

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['userId'] && this.userId) {
      this.loadDisposedItems(this.userId);
    }

    if (changes['refreshTrigger'] && this.userId) {
      this.loadDisposedItems(this.userId);
    }
  }

  private loadDisposedItems(userId : number): void {
    this.stockService.GetDisposedStockItemsByUserId(userId).subscribe({
      next: (response: ApiResult<AlreadyAssignedItem>) => {
        this.disposedItemApiResult = response;
        this.disposedItems = response.dataList ?? [];
      },
      error: (err: any) => {
        console.error('Error fetching Item For User', err);
        this.disposedItemApiResult = { dataList: [], result: false, message: 'Error fetching Item For User' };
        this.disposedItems = [];
      }
    });
  }
}
