import { AfterViewInit, Component, inject, OnDestroy } from '@angular/core';
import { UserMaster } from '../../../../core/Models/UserMaster';
import { ApiResult } from '../../../../core/DTOs/ApiResult';
import { UserMngService } from '../../../services/user-mng.service';
import { CommonModule } from '@angular/common';
import { ProfileCardComponent } from "../../../../shared/components/profile-card/profile-card.component";
import { CategoryMaster } from '../../../../core/Models/CategoryMaster';
import { ProductMaster } from '../../../../core/Models/ProductMaster';
import { StockMngService } from '../../../services/stock-mng.service';
import { FormsModule } from '@angular/forms';
import { AssignItemToUser } from '../../../../core/DTOs/AssignItemToUser';
import { SweetAlertService } from '../../../../shared/services/sweet-alert.service';
declare var $: any;

@Component({
  selector: 'app-assign-item',
  standalone: true,
  imports: [CommonModule, ProfileCardComponent, FormsModule],
  templateUrl: './assign-item.component.html',
  styleUrl: './assign-item.component.css'
})
export class AssignItemComponent implements AfterViewInit, OnDestroy {
  userListApiResult: ApiResult<UserMaster> = { dataList: [], result: false, message: 'Connection Not Available.' };
  catListApiResult: ApiResult<CategoryMaster> = { dataList: [], result: false, message: 'Connection Not Available.' };
  productListApiResult: ApiResult<ProductMaster> = { dataList: [], result: false, message: 'Connection Not Available.' };

  filteredUsers: UserMaster[] = [];
  filteredCategories: CategoryMaster[] = [];
  filteredProducts: ProductMaster[] = [];

  selectedUser?: UserMaster;
  selectedUserId : number = 0;
  selectedCatId?: number;
  selectedProId?: number;
  isUserSelected: Boolean = false;
  isValidCount: Boolean = false;
  availableProduct: number = 0;
  assignedQuantity: number = 0; 
  assignedRemark: string = ''; 


  private userService = inject(UserMngService);
  private stockService = inject(StockMngService);
  private sweetAlert  = inject(SweetAlertService);

  ngOnInit(): void {
    this.loadUsers();
    this.loadCategory();
  }

  ngAfterViewInit() {
    setTimeout(() => {

      // Initialize Select2 for User dropdown
      $('#user-select').select2({
        theme: "bootstrap-5",
        width: '10%',
        placeholder: 'Choose one User',
        allowClear: true
      }).on('change', (event: any) => { // Use 'any' for the event
        this.onChangeUser(event);
      });

      // Initialize Select2 for Category dropdown
      $('#category-select').select2({
        theme: "bootstrap-5",
        width: '100%',
        placeholder: 'Choose one Category',
        allowClear: true
      }).on('change', (event: any) => {
        this.onChangeCategory(event);
      }).on('select2:clearing', () => {
        this.availableProduct = 0;
        this.filteredProducts = [];
      });
      // Initialize Select2 for Product dropdown
      $('#product-select').select2({
        theme: "bootstrap-5",
        width: '100%',
        placeholder: 'Choose one Product',
        allowClear: true
      }).on('change', (event: any) => {
        this.onChangeProduct(event);
      }).on('select2:clearing', () => {
        this.availableProduct = 0;
      });

    });
  }

  ngOnDestroy() {
    $('#user-select').off('change').select2('destroy');
    $('#category-select').off('change').select2('destroy');
    $('#product-select').off('change').select2('destroy');
  }

  private loadUsers(): void {
    this.userService.getUsers().subscribe({
      next: (response: ApiResult<UserMaster>) => {
        this.userListApiResult = response;
        this.filteredUsers = response.dataList ?? [];
      },
      error: (err) => {
        console.error('Error fetching Users', err);
        this.userListApiResult = { dataList: [], result: false, message: 'Error fetching Users' };
        this.filteredUsers = [];
      }
    });
  }

  private loadCategory(): void {
    this.stockService.GetAvailableCategoryForAssignItem().subscribe({
      next: (response: ApiResult<CategoryMaster>) => {
        this.catListApiResult = response;
        this.filteredCategories = response.dataList ?? [];

      },
      error: (err) => {
        console.error('Error fetching Category', err);
        this.catListApiResult = { dataList: [], result: false, message: 'Error fetching Users' };
        this.filteredCategories = [];
      }
    });
  }

  onChangeUser(event: Event) {
    const selectElement = event.target as HTMLSelectElement;
    const selectedValue = selectElement.value;
    this.selectedUserId = parseInt(selectedValue);
    this.resetAssignForm();
    if (selectedValue) {
      this.selectedUser = this.filteredUsers.find(user => user.id?.toString() == selectedValue);
      this.isUserSelected = true;
    }
    else {
      this.isUserSelected = false;
    }
  }

  onChangeCategory(event: Event) {
    const selectElement = event.target as HTMLSelectElement;
    const selectedValue = parseInt(selectElement.value);
    this.selectedCatId = selectedValue;
    if (selectedValue) {
      this.stockService.GetAvailableProductForAssignItem(selectedValue).subscribe({
        next: (response: ApiResult<ProductMaster>) => {
          this.productListApiResult = response;
          this.filteredProducts = response.dataList ?? [];
        },
        error: (err) => {
          console.error('Error fetching Category', err);
          this.productListApiResult = { dataList: [], result: false, message: 'Error fetching Category' };
          this.filteredProducts = [];
        }
      });
    }
  }

  onChangeProduct(event: Event) {
    const selectElement = event.target as HTMLSelectElement;
    const selectedValue = parseInt(selectElement.value);
    this.selectedProId = selectedValue;
    if (selectedValue) {
      this.stockService.GetAvailableItemForAssignItem(selectedValue).subscribe({
        next: (response: ApiResult<object>) => {
          if (response.result) {
            const dataValue = response.data as string | undefined;
            this.availableProduct = parseInt(dataValue ?? '0', 10);
          }
        },
        error: (err) => {
          console.error('Error fetching Product', err);
          this.productListApiResult = { dataList: [], result: false, message: 'Error fetching Product' };
          this.filteredProducts = [];
        }
      });
    }
  }

  onQtyChange() {

    if ((this.assignedQuantity <= this.availableProduct && this.assignedQuantity > 0) && this.selectedUserId > 0) {
      this.isValidCount = true;
    }
    else {
      this.isValidCount = false;
    }

  }

  onAssignItem() {
    const assignItemData = new AssignItemToUser({
      userId: this.selectedUserId,
      catId: this.selectedCatId,
      proId: this.selectedProId,
      count: this.assignedQuantity,
      remark : this.assignedRemark
    });

    this.stockService.AssignItemsToUserAtAdmin(assignItemData).subscribe({
      next: (response: ApiResult<number>) => {
        if(response.result){
          this.sweetAlert.toast('Assign Success', 'success');
          this.resetAssignForm();
        }
        else{
          this.sweetAlert.toast('Failed To Assign', 'warning');
        }
      },
      error: (err) => {
        console.error('Error fetching Item Details', err);
      }
    });
  }

  resetAssignForm(){
    this.availableProduct = 0;
    this.assignedQuantity = 0;
    this.isValidCount = false;

    // Clear the product select dropdown
    $('#product-select').val(null).trigger('change');
  }
}
