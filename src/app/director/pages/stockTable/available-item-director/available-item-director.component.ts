import { AfterViewInit, Component, OnInit } from '@angular/core';
import { ShowAvailableStockTable } from '../../../../core/DTOs/ShowAvailableStockTable';
import { ApiResult } from '../../../../core/DTOs/ApiResult';
import { UserProductInfoDtoForStockTable } from '../../../../core/DTOs/UserProductInfoDtoForStockTable';
import { StockMngService } from '../../../../admin/services/stock-mng.service';
import { CommonModule, DatePipe } from '@angular/common';
import { Router } from '@angular/router';
declare var $ : any;

@Component({
  selector: 'app-available-item-director',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './available-item-director.component.html',
  styleUrl: './available-item-director.component.css'
})
export class AvailableItemDirectorComponent implements OnInit, AfterViewInit {
  tableData: ApiResult<ShowAvailableStockTable> = { dataList: [], result: false, message: 'Connection Not Available.' };
  popUsersForProduct: ApiResult<UserProductInfoDtoForStockTable> = { dataList: [], result: false, message: 'Connection Not Available.' };

  hasData: boolean = false;
  Users : UserProductInfoDtoForStockTable[] = [];

  constructor(private stockMngService: StockMngService, private router:Router) {}

  ngOnInit(): void {
    this.loadPendingBillTable();
  }

  private loadPendingBillTable(): void {
    this.stockMngService.GetAvailableStockAtAdmin().subscribe({
      next: (response: ApiResult<ShowAvailableStockTable>) => {
        this.tableData = response;
        // Explicitly ensure hasData is a boolean
        this.hasData = !!this.tableData.dataList?.length; 
        this.initializeDataTable(); // Initialize DataTable after data is loaded
      },
      error: (err: any) => {
        console.error('Error fetching table data', err);
        this.tableData = { dataList: [], result: false, message: 'Error fetching table data' };
        this.hasData = false; // Ensure hasData is set to false on error
      }
    });
  }

  getUsersViaAllotedProductId(productId : number){
      this.stockMngService.getUsersViaAllotedProductId(productId).subscribe({
      next: (response: ApiResult<UserProductInfoDtoForStockTable>) => {
      
            this.popUsersForProduct = response;
            this.Users = this.popUsersForProduct.dataList ?? [];
       
             // Update the modal body with new content
             $('#UsersForProductPop .modal-body').html(`
              <table class="table">
                  <thead>
                      <tr>
                          <th>Sn.</th>
                          <th>Item Code</th>
                          <th>Product Name</th>
                          <th>User Name</th>
                          <th>User Type</th>
                          <th>Branch</th>
                          <th>Department</th>
                          <th>Mobile</th>
                           <th>Remark</th>
                          <th>Assigned Date</th>
                      </tr>
                  </thead>
                  <tbody>
                      ${this.Users?.length > 0
                          ? this.Users.map((item, index) => `
                              <tr>
                                  <td>${index + 1}</td>
                                 <td>${item.stockItemCode}</td>
                                 <td>${item.productName}</td>
                                 <td>${item.userName}</td>
                                 <td>${item.userTypeName}</td>
                                 <td>${item.branchName}</td>
                                 <td>${item.departmentName}</td>
                                 <td>${item.userMobile}</td>
                                 <td>${item.remark}</td>
                                 <td>${this.formatDate(item.assignedDate)}</td>
                              </tr>
                          `).join('')
                          : '<tr><td colspan="9" class="text-danger">No Items Found!</td></tr>'
                      }
                  </tbody>
              </table>
          `);

          $('#UsersForProductPop').modal('show');
    
      },
      error: (err: any) => {
        console.error('Error fetching table data', err);
        this.popUsersForProduct = { dataList: [], result: false, message: 'Error fetching pop data' };
      }
    });
  }

  ngAfterViewInit(): void {
    this.initializeDataTable();
  }

  private initializeDataTable(): void {
    if (typeof $ !== 'undefined') {
      $(document).ready(() => {
        if (this.hasData) {
          var table = $('#AvailableStockTable').DataTable({
            lengthChange: false,
            buttons: ['copy', 'excel', 'pdf', 'print'],
            "destroy": true // Ensure DataTable is reinitialized correctly
          });
          table.buttons().container()
            .appendTo('#AvailableStockTable_wrapper .col-md-6:eq(0)');
        }
      });
    }
  }

  formatDate = (dateString : any) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-based
    const year = date.getFullYear();

    return `${day}-${month}-${year}`;
  };
}
