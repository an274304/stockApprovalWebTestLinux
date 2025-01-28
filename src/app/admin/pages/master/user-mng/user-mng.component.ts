import { Component, ElementRef, inject, ViewChild } from '@angular/core';
import { UserMngService } from '../../../services/user-mng.service';
import { UserMaster } from '../../../../core/Models/UserMaster';
import { ApiResult } from '../../../../core/DTOs/ApiResult';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { BranchMngService } from '../../../services/branch-mng.service';
import { BranchMaster } from '../../../../core/Models/BranchMaster';
import { DepartmentMaster } from '../../../../core/Models/DepartmentMaster';
import { DepartmentMngService } from '../../../services/department-mng.service';
import { AuthService } from '../../../../shared/services/auth.service';
import { UserTypeMaster } from '../../../../core/Models/UserTypeMaster';
import { SweetAlertService } from '../../../../shared/services/sweet-alert.service';

@Component({
  selector: 'app-user-mng',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, FormsModule],
  templateUrl: './user-mng.component.html',
  styleUrl: './user-mng.component.css'
})
export class UserMngComponent {

  userListApiResult: ApiResult<UserMaster> = { dataList: [], result: false, message: 'Connection Not Available.' };
  branchListApiResult: ApiResult<BranchMaster> = { dataList: [], result: false, message: 'Connection Not Available.' };
  departmentListApiResult: ApiResult<DepartmentMaster> = { dataList: [], result: false, message: 'Connection Not Available.' };
  userTypeMasterListApiResult: ApiResult<UserTypeMaster> = { dataList: [], result: false, message: 'Connection Not Available.' };

  userForm: FormGroup;
  imagePreviewUrl: string | ArrayBuffer | null = null;
  @ViewChild('userFileInput') userFileInput: ElementRef<HTMLInputElement> | undefined;
  userSaveApiResult: ApiResult<UserMaster> = { data: undefined, dataList: [], result: false, message: 'Connection Not Available.' };

  selectedUser: UserMaster | null = null;

  searchTerm: string = '';
  filteredUsers: UserMaster[] = [];
  filteredBranches: BranchMaster[] = [];
  filteredDepartments: DepartmentMaster[] = [];
  filteredUserTypeMaster: UserTypeMaster[] = [];

  private userService = inject(UserMngService);
  private branchService = inject(BranchMngService);
  private departmentService = inject(DepartmentMngService);
  private AuthService = inject(AuthService);
  private sweetAlert  = inject(SweetAlertService);

  constructor(private fb: FormBuilder) {
    this.userForm = this.fb.group({
      id: [0],
      usTypeId: [null, Validators.required],
      usBranchId: [null, Validators.required],
      usDepartmentId: [null, Validators.required],
      usName: ['', [Validators.required, Validators.minLength(3)]],
      usCode: [''],
      usPrefix: [''],
      usImg: [null],
      usAddress: ['', Validators.required],
      usEmail: ['', [Validators.required, Validators.email]],
      usMob: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]], // Adjust the pattern as needed
      usGstin: [''],
      status: [false],
      created: [null],
      createdBy: [''],
      updated: [null],
      updatedBy: [''],
      usPassword: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  ngOnInit(): void {
    this.loadUsers();
    this.loadUserTypeMaster();
    this.loadBranches();
    this.loadDepartments();
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

  private loadBranches(): void {
    this.branchService.getBranches().subscribe({
      next: (response: ApiResult<BranchMaster>) => {
        this.branchListApiResult = response;
        this.filteredBranches = response.dataList ?? [];
      },
      error: (err) => {
        console.error('Error fetching categories', err);
        this.branchListApiResult = { dataList: [], result: false, message: 'Error fetching categories' };
        this.filteredBranches = [];
      }
    });
  }

  private loadUserTypeMaster(): void {
    this.AuthService.GetAllUserType().subscribe({
      next: (response: ApiResult<UserTypeMaster>) => {
        this.userTypeMasterListApiResult = response;
        this.filteredUserTypeMaster = response.dataList ?? [];
      },
      error: (err) => {
        console.error('Error fetching userTypeMaster', err);
        this.userTypeMasterListApiResult = { dataList: [], result: false, message: 'Error fetching userTypeMaster' };
        this.filteredUserTypeMaster = [];
      }
    });
  }

  private loadDepartments(): void {
    this.departmentService.getDepartments().subscribe({
      next: (response: ApiResult<DepartmentMaster>) => {
        this.departmentListApiResult = response;
        this.filteredDepartments = response.dataList ?? [];
      },
      error: (err) => {
        console.error('Error fetching Departments', err);
        this.departmentListApiResult = { dataList: [], result: false, message: 'Error fetching Departments' };
        this.filteredDepartments = [];
      }
    });
  }

  onSearchChange(): void {
    if (this.searchTerm) {
      this.filteredUsers = this.userListApiResult.dataList?.filter(user =>
        user.usName?.toLowerCase().includes(this.searchTerm.toLowerCase())
      ) ?? [];
    } else {
      this.filteredUsers = this.userListApiResult.dataList ?? [];
    }
  }

  onSelectUser(user: UserMaster): void {
    this.userService.getUserById(user.id!).subscribe({
      next: (response: ApiResult<UserMaster>) => {
        if (response.result && response.data) {
          this.selectedUser = response.data;

          // Set the image preview URL
          this.imagePreviewUrl = this.selectedUser.usImg ? this.selectedUser.usImg : null;

          // Prepare form data without the file input field
          const { usImg, ...formData } = this.selectedUser;

          // Patch the form with other fields
          this.userForm.patchValue(formData);
        }
      },
      error: (err) => {
        console.error('Error fetching user by ID', err);
      }
    });
  }

  onFileChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length) {
      const file = input.files[0];
      const reader = new FileReader();

      reader.onload = (e: ProgressEvent<FileReader>) => {
        this.imagePreviewUrl = e.target?.result as string | ArrayBuffer | null;
      };

      reader.readAsDataURL(file);
    }
  }


  resetForm(): void {
    this.userForm.reset();
    this.userForm.markAsPristine();
    this.selectedUser = null;
    this.imagePreviewUrl = null;
  }

  submitForm(): void {
    if (this.userForm.invalid) {
      this.sweetAlert.toast('Form Is Invalid', 'warning');
      this.userForm.markAllAsTouched();
      return;
    }

    const formData = new FormData();
    this.appendFormData(formData);
  
    const saveOrUpdate$ = this.selectedUser?.id ?
      this.userService.updateUser(formData) :
      this.userService.saveUser(formData);

    saveOrUpdate$.subscribe({
      next: (response: ApiResult<UserMaster>) => {
        this.userSaveApiResult = response;
        if (response.result) {
          this.sweetAlert.toast(this.selectedUser ? 'Updated successfully' : 'Saved successfully', 'success');
          this.loadUsers();
          this.resetForm();
        } else {
          this.sweetAlert.toast('Failed To Save', 'warning');
        }
      },
      error: (err) => {
        console.error('Error saving user', err);
        this.userSaveApiResult = { dataList: [], result: false, message: 'Error saving category' };
      }
    });
  }

  private appendFormData(formData: FormData): void {
    formData.append('id', this.selectedUser?.id?.toString() ?? '0');
    formData.append('usTypeId', this.userForm.get('usTypeId')?.value ?? '0');
    formData.append('usBranchId', this.userForm.get('usBranchId')?.value ?? '0');
    formData.append('usDepartmentId', this.userForm.get('usDepartmentId')?.value ?? '0');
    formData.append('usName', this.userForm.get('usName')?.value ?? '');
   
    const selectedTypeId = this.userForm.get('usTypeId')?.value;
    const selectedType = this.filteredUserTypeMaster.find(type => type.id == selectedTypeId);
    const usTypeName = selectedType ? selectedType.usTypeName : ''; // Ensure this is always a string
    formData.append('usTypeName', usTypeName!);

    formData.append('usEmail', this.userForm.get('usEmail')?.value ?? '');
    formData.append('usMob', this.userForm.get('usMob')?.value ?? '');
    formData.append('usAddress', this.userForm.get('usAddress')?.value ?? '');
    formData.append('usPassword', this.userForm.get('usPassword')?.value ?? '');
    formData.append('created', new Date().toISOString());
    formData.append('createdBy', 'getSessionIN');
    formData.append('updated', new Date().toISOString());
    formData.append('updatedBy', 'getSessionUP');

    if (this.userFileInput?.nativeElement) {
      const file = this.userFileInput.nativeElement.files?.[0];
      if (file) {
        formData.append('file', file, file.name);
      } else {
        // console.error('No file selected.');
      }
    }
  }
}
