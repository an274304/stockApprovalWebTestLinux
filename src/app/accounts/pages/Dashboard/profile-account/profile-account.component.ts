import { Component } from '@angular/core';
import { UserMaster } from '../../../../core/Models/UserMaster';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { GlobalStateService } from '../../../../shared/services/global-state.service';
import { SweetAlertService } from '../../../../shared/services/sweet-alert.service';
import { UserMngService } from '../../../../admin/services/user-mng.service';
import { ApiResult } from '../../../../core/DTOs/ApiResult';
import { ProfileCardComponent } from '../../../../shared/components/profile-card/profile-card.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-profile-account',
  standalone: true,
  imports: [ProfileCardComponent, FormsModule, CommonModule, ReactiveFormsModule],
  templateUrl: './profile-account.component.html',
  styleUrl: './profile-account.component.css'
})
export class ProfileAccountComponent {
  selectedUser?: UserMaster;
  passwordForm: FormGroup;

  constructor(
    private globalState : GlobalStateService,
    private sweetAlert : SweetAlertService,
    private userMng : UserMngService,
    private fb: FormBuilder
  ){
    this.passwordForm = this.fb.group({
      id: [0],
      newPassword: ['', [Validators.required, Validators.maxLength(50), Validators.minLength(6)]]
    });
  }

  ngOnInit(): void {
    const userId = this.globalState.getUserId();
    if(userId){
      this.GetUserByUserId(parseInt(userId));
    }
    else{
        this.sweetAlert.message("Unable To Get User Id", 'warning');
    }
  }

  UpdatePassword(): void {
    if (this.passwordForm.invalid) {
      this.sweetAlert.toast('Form Is Invalid', 'warning');
      this.passwordForm.markAllAsTouched(); // Mark all fields as touched to show errors
      return;
    }
  
    const formData = new FormData();
    formData.append('Id', this.selectedUser?.id?.toString() ?? '0');
    formData.append('UsPassword', this.passwordForm.get('newPassword')?.value ?? '');
    
    this.userMng.updateUsersPassword(formData).subscribe({
      next: (response: ApiResult<UserMaster>) => {
        if (response.result) {
          this.resetForm();
          this.sweetAlert.message("Updated Successfully", 'success');
        }
        else{
          this.sweetAlert.message("Unable To Get Profile Details", 'error');
        }
      },
      error: (err) => {
        console.error('Error fetching user by ID', err);
        this.sweetAlert.message("Unable To Send Profile Details", 'error');
      }
    });
  }

  private GetUserByUserId(userId: number): void {
    this.userMng.getUserById(userId).subscribe({
      next: (response: ApiResult<UserMaster>) => {
        if (response.result) {
          this.selectedUser = response.data;
        }
        else{
          this.sweetAlert.message("Unable To Get Profile Details", 'error');
        }
      },
      error: (err) => {
        console.error('Error fetching user by ID', err);
        this.sweetAlert.message("Unable To Get Profile Details", 'error');
      }
    });
  }

  resetForm(): void {
    this.passwordForm.reset();
    this.passwordForm.markAsPristine();
  }
}
