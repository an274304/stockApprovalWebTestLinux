import { Component, inject } from '@angular/core';
import { UserMaster } from '../../../../core/Models/UserMaster';
import { ApiResult } from '../../../../core/DTOs/ApiResult';
import { UserMngService } from '../../../services/user-mng.service';
import { ProfileCardComponent } from "../../../../shared/components/profile-card/profile-card.component";
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AlreadyAssignedItemByUserIdComponent } from "../../../../shared/components/already-assigned-item-by-user-id/already-assigned-item-by-user-id.component";
import { AlreadyDisposedItemByUserIdComponent } from "../../../../shared/components/already-disposed-item-by-user-id/already-disposed-item-by-user-id.component";
declare var $: any;

@Component({
  selector: 'app-dispose-item',
  standalone: true,
  imports: [CommonModule, ProfileCardComponent, FormsModule, AlreadyAssignedItemByUserIdComponent, AlreadyDisposedItemByUserIdComponent],
  templateUrl: './dispose-item.component.html',
  styleUrl: './dispose-item.component.css'
})
export class DisposeItemComponent {
  refreshTrigger: boolean = false;
  userListApiResult: ApiResult<UserMaster> = { dataList: [], result: false, message: 'Connection Not Available.' };
  filteredUsers: UserMaster[] = [];

  selectedUser?: UserMaster;
  selectedUserId : number = 0;
  isUserSelected: Boolean = false;

  private userService = inject(UserMngService);

  ngOnInit(): void {
    this.loadUsers();
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

    });
  }

  ngOnDestroy() {
    $('#user-select').off('change').select2('destroy');
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

  onChangeUser(event: Event) {
    const selectElement = event.target as HTMLSelectElement;
    const selectedValue = selectElement.value;
    this.selectedUserId = parseInt(selectedValue);

    if (selectedValue) {
      this.selectedUser = this.filteredUsers.find(user => user.id?.toString() == selectedValue);
      this.isUserSelected = true;
    }
    else {
      this.isUserSelected = false;
    }
  }

  handleDataChange() {
    this.refreshTrigger = !this.refreshTrigger;
  }
}
