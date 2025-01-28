import { Component, Input } from '@angular/core';
import { UpdateNewStockItem } from '../../../core/DTOs/UpdateNewStockItem';
import { CommonModule, DatePipe } from '@angular/common';
import { StockItemMaster } from '../../../core/Models/StockItemMaster';

@Component({
  selector: 'app-updated-stock-master-item-table',
  standalone: true,
  imports: [CommonModule, DatePipe],
  templateUrl: './updated-stock-master-item-table.component.html',
  styleUrl: './updated-stock-master-item-table.component.css'
})
export class UpdatedStockMasterItemTableComponent {
  @Input() updatedStockMasterItem: StockItemMaster[] = [];

  printTable() {
    const printContents = document.getElementById('printStockItemCodeTable')?.outerHTML;
    const originalContents = document.body.innerHTML;

    if (printContents) {
        const newWindow = window.open('', '', 'height=600,width=800');
        newWindow?.document.write('<html><head><title>Print Table</title>');
        newWindow?.document.write('<link href="/assets/css/bootstrap.min.css" rel="stylesheet">'); // Include Bootstrap CSS
        newWindow?.document.write('</head><body>');
        newWindow?.document.write(printContents);
        newWindow?.document.write('</body></html>');
        newWindow?.document.close();
        newWindow?.window.print();
    }
}

}
