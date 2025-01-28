import { Component, ElementRef, inject, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormGroupName, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ApiResult } from '../../../../core/DTOs/ApiResult';
import { BranchMaster } from '../../../../core/Models/BranchMaster';
import { CommonModule } from '@angular/common';
import { BranchMngService } from '../../../services/branch-mng.service';
import { SweetAlertService } from '../../../../shared/services/sweet-alert.service';

@Component({
  selector: 'app-branch-mng',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, FormsModule],
  templateUrl: './branch-mng.component.html',
  styleUrl: './branch-mng.component.css'
})
export class BranchMngComponent implements OnInit {
  branchListApiResult: ApiResult<BranchMaster> = { dataList: [], result: false, message: 'Connection Not Available.' };
  branchForm: FormGroup;
  imagePreviewUrl: string | ArrayBuffer | null = null;
  @ViewChild('branchFileInput') branchFileInput: ElementRef<HTMLInputElement> | undefined;
  branchSaveApiResult: ApiResult<BranchMaster> = { data: undefined, dataList: [], result: false, message: 'Connection Not Available.' };

  selectedBranch: BranchMaster | null = null;

  searchTerm: string = '';
  filteredBranches: BranchMaster[] = [];

  private branchService = inject(BranchMngService);
  private sweetAlert  = inject(SweetAlertService);
  
  constructor(private fb: FormBuilder) {
    this.branchForm = this.fb.group({
      id: [0],
      branchName: ['', [Validators.required, Validators.maxLength(100)]], // Required and max length 100
      branchCode: ['', [Validators.required, Validators.maxLength(10)]], // Required and max length 10
      branchPrefix: ['', [Validators.required, Validators.maxLength(5)]], // Required and max length 5
      branchImg: [null],
      status: [false],
      created: [null],
      createdBy: [''],
      updated: [null],
      updatedBy: [''],
      branchAddress: ['', [Validators.required]]
    });
  }

  ngOnInit(): void {
    this.loadBranches();
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

  onSearchChange(): void {
    if (this.searchTerm) {
      this.filteredBranches = this.branchListApiResult.dataList?.filter(branch =>
        branch.branchName?.toLowerCase().includes(this.searchTerm.toLowerCase())
      ) ?? [];
    } else {
      this.filteredBranches = this.branchListApiResult.dataList ?? [];
    }
  }

  onSelectCategory(branch: BranchMaster): void {
    this.branchService.getBranchById(branch.id!).subscribe({
      next: (response: ApiResult<BranchMaster>) => {
        if (response.result && response.data) {
          this.selectedBranch = response.data;

          // Set the image preview URL
          this.imagePreviewUrl = this.selectedBranch.branchImg ? this.selectedBranch.branchImg : null;

          // Prepare form data without the file input field
          const { branchImg, ...formData } = this.selectedBranch;

          // Patch the form with other fields
          this.branchForm.patchValue(formData);
        }
      },
      error: (err) => {
        console.error('Error fetching branch by ID', err);
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
    this.branchForm.reset();
    this.branchForm.markAsPristine();
    this.selectedBranch = null;
    this.imagePreviewUrl = null;
  }

  submitForm(): void {
    if (this.branchForm.invalid) {
      this.sweetAlert.toast('Form Is Invalid', 'warning');
      this.branchForm.markAllAsTouched(); // Mark all fields as touched to show errors
      return;
    }
  
    const formData = new FormData();
    this.appendFormData(formData);
  
    const saveOrUpdate$ = this.selectedBranch?.id ? 
      this.branchService.updateBranch(formData) : 
      this.branchService.saveBranch(formData);
  
    saveOrUpdate$.subscribe({
      next: (response: ApiResult<BranchMaster>) => {
        this.branchSaveApiResult = response;
        console.log(response.result);
        if (response.result) {
          this.sweetAlert.toast(this.selectedBranch ? 'Updated successfully' : 'Saved successfully', 'success');
          this.loadBranches();
          this.resetForm();
        } else {
          this.sweetAlert.toast('Failed To Save', 'warning');
        }
      },
      error: (err) => {
        console.error('Error saving category', err);
        this.branchSaveApiResult = { dataList: [], result: false, message: 'Error saving category' };
      }
    });
  }

  private appendFormData(formData: FormData): void {
    formData.append('id', this.selectedBranch?.id?.toString() ?? '0');
    formData.append('branchName', this.branchForm.get('branchName')?.value ?? '');
    formData.append('branchCode', this.branchForm.get('branchCode')?.value ?? '');
    formData.append('branchPrefix', this.branchForm.get('branchPrefix')?.value ?? '');
    formData.append('branchAddress', this.branchForm.get('branchAddress')?.value ?? '');
    formData.append('created', new Date().toISOString());
    formData.append('createdBy', 'getSessionIN');
    formData.append('updated', new Date().toISOString());
    formData.append('updatedBy', 'getSessionUP');
    if (this.branchFileInput?.nativeElement) {
      const file = this.branchFileInput.nativeElement.files?.[0];
      if (file) {
        formData.append('file', file, file.name);
      } else {
       // console.error('No file selected.');
      }
    }
  }
}
