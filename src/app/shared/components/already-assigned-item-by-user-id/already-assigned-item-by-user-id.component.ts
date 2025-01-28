import { Component, EventEmitter, inject, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { StockMngService } from '../../../admin/services/stock-mng.service';
import { ApiResult } from '../../../core/DTOs/ApiResult';
import { AlreadyAssignedItem } from '../../../core/DTOs/AlreadyAssignedItem';
import { CommonModule, DatePipe } from '@angular/common';
import { SweetAlertService } from '../../services/sweet-alert.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-already-assigned-item-by-user-id',
  standalone: true,
  imports: [DatePipe, FormsModule, CommonModule],
  templateUrl: './already-assigned-item-by-user-id.component.html',
  styleUrl: './already-assigned-item-by-user-id.component.css'
})
export class AlreadyAssignedItemByUserIdComponent implements OnChanges {
  @Input() userId?: number;
  @Output() dataChanged = new EventEmitter<void>();

  assignedItemApiResult: ApiResult<AlreadyAssignedItem> = { dataList: [], result: false, message: 'Connection Not Available.' };
  assignedItems: AlreadyAssignedItem[] = [];
  selectAll: boolean = false;

  stockService = inject(StockMngService);
  sweetAlert = inject(SweetAlertService);

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['userId'] && this.userId) {
      this.loadAssignedItems(this.userId);
    }
  }

  private loadAssignedItems(userId: number): void {
    this.stockService.GetAssignedStockItemsByUserId(userId).subscribe({
      next: (response: ApiResult<AlreadyAssignedItem>) => {
        this.assignedItemApiResult = response;
        // Ensure each item has `selected` set to false by default
        this.assignedItems = (response.dataList ?? []).map(item => ({
          ...item,
          selected: false  // Initialize selected to false by default
        }));
        this.selectAll = false; // Ensure the "Select All" checkbox is unchecked
      },
      error: (err: any) => {
        console.error('Error fetching Item For User', err);
        this.assignedItemApiResult = { dataList: [], result: false, message: 'Error fetching Item For User' };
        this.assignedItems = [];
      }
    });
  }


  toggleSelectAll(): void {
    this.assignedItems.forEach(item => item.selected = this.selectAll);
  }

  updateSelection(): void {
    this.selectAll = this.assignedItems.every(item => item.selected);
  }

  get selectedItems(): AlreadyAssignedItem[] {
    return this.assignedItems.filter(item => item.selected);
  }

  DisposeBulkFromStockMasterByIdArray(): void {
    const selectedIds = this.selectedItems
      .map(item => item.id)          // Map to get the ids
      .filter((id): id is number => id !== undefined);  // Filter out undefined values
    
    this.stockService.DisposeBulkFromStockMasterByIdArray(selectedIds).subscribe({
      next: (response: ApiResult<number>) => {
        if (response.result) {
          this.sweetAlert.toast('Bulk Dispose Success', 'success');
          this.loadAssignedItems(this.userId ?? 0);
          this.dataChanged.emit();
        } else {
          this.sweetAlert.toast('Failed To Dispose Items', 'warning');
        }
      },
      error: (err: any) => {
        console.error('Error disposing items', err);
      }
    });
  }
  

  disposeItemById(stockItemCode: number) {
    if (stockItemCode) {
      this.stockService.DisposeStockItemById(stockItemCode).subscribe({
        next: (response: ApiResult<number>) => {
          if (response.result) {
            this.sweetAlert.toast('Dispose Success', 'success');
            this.loadAssignedItems(this.userId ?? 0);
            this.dataChanged.emit();
          }
          else {
            this.sweetAlert.toast('Failed To Dipose', 'warning');
          }
        },
        error: (err: any) => {
          console.error('Error fetching Item For User', err);
          this.assignedItemApiResult = { dataList: [], result: false, message: 'Error fetching Item For User' };
          this.assignedItems = [];
        }
      });
    }
  }
}
