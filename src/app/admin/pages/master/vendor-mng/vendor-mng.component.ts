import { CommonModule } from '@angular/common';
import { Component, ElementRef, inject, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ApiResult } from '../../../../core/DTOs/ApiResult';
import { VendorMaster } from '../../../../core/Models/VendorMaster';
import { VendorMngService } from '../../../services/vendor-mng.service';
import { SweetAlertService } from '../../../../shared/services/sweet-alert.service';

@Component({
  selector: 'app-vendor-mng',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, FormsModule],
  templateUrl: './vendor-mng.component.html',
  styleUrl: './vendor-mng.component.css'
})
export class VendorMngComponent {
  vendorListApiResult: ApiResult<VendorMaster> = { dataList: [], result: false, message: 'Connection Not Available.' };
  vendorForm: FormGroup;
  imagePreviewUrl: string | ArrayBuffer | null = null;
  @ViewChild('vendorFileInput') vendorFileInput: ElementRef<HTMLInputElement> | undefined;
  vendorSaveApiResult: ApiResult<VendorMaster> = { data: undefined, dataList: [], result: false, message: 'Connection Not Available.' };

  selectedVendor: VendorMaster | null = null;

  searchTerm: string = '';
  filteredVendors: VendorMaster[] = [];

  private vendorService = inject(VendorMngService);
  private sweetAlert  = inject(SweetAlertService);


  constructor(private fb: FormBuilder) {
    this.vendorForm = this.fb.group({
      id: [0],
      venName: ['', Validators.required],
      venCode: [''],
      venShopName: ['', Validators.required],
      venImg: [null],
      venAddress: ['', Validators.required],
      venEmail: ['', [Validators.required, Validators.email]],
      venMob: ['', Validators.required, Validators.pattern('^[0-9]{10}$')],
      venGstin: ['', Validators.required],
      status: [false],
      created: [null],
      createdBy: [''],
      updated: [null],
      updatedBy: ['']
    });
  }

  ngOnInit(): void {
    this.loadVendors();
  }

  private loadVendors(): void {
    this.vendorService.getVendors().subscribe({
      next: (response: ApiResult<VendorMaster>) => {
        this.vendorListApiResult = response;
        this.filteredVendors = response.dataList ?? [];
      },
      error: (err) => {
        console.error('Error fetching vendors', err);
        this.vendorListApiResult = { dataList: [], result: false, message: 'Error fetching vendors' };
        this.filteredVendors = [];
      }
    });
  }

  onSearchChange(): void {
    if (this.searchTerm) {
      this.filteredVendors = this.vendorListApiResult.dataList?.filter(vendor =>
        vendor.venName?.toLowerCase().includes(this.searchTerm.toLowerCase())
      ) ?? [];
    } else {
      this.filteredVendors = this.vendorListApiResult.dataList ?? [];
    }
  }

  onSelectVendor(vendor: VendorMaster): void {
    this.vendorService.getVendorById(vendor.id!).subscribe({
      next: (response: ApiResult<VendorMaster>) => {
        if (response.result && response.data) {
          this.selectedVendor = response.data;

          // Set the image preview URL
          this.imagePreviewUrl = this.selectedVendor.venImg ? this.selectedVendor.venImg : null;

          // Prepare form data without the file input field
          const { venImg, ...formData } = this.selectedVendor;

          // Patch the form with other fields
          this.vendorForm.patchValue(formData);
        }
      },
      error: (err) => {
        console.error('Error fetching vendor by ID', err);
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
    this.vendorForm.reset();
    this.vendorForm.markAsPristine();
    this.selectedVendor = null;
    this.imagePreviewUrl = null;
  }

  submitForm(): void {
    if (this.vendorForm.invalid) {
      this.sweetAlert.toast('Form Is Invalid', 'warning');
      this.vendorForm.markAllAsTouched(); // Mark all fields as touched to show validation messages
      return;
    }
  
    const formData = new FormData();
    this.appendFormData(formData);
  
    const saveOrUpdate$ = this.selectedVendor?.id ? 
      this.vendorService.updateVendor(formData) : 
      this.vendorService.saveVendor(formData);
  
    saveOrUpdate$.subscribe({
      next: (response: ApiResult<VendorMaster>) => {
        this.vendorSaveApiResult = response;
        if (response.result) {
          this.sweetAlert.toast(this.selectedVendor ? 'Updated successfully' : 'Saved successfully', 'success');
          this.loadVendors();
          this.resetForm();
        } else {
          this.sweetAlert.toast('Failed to save', 'warning');
        }
      },
      error: (err) => {
        console.error('Error saving category', err);
        this.vendorSaveApiResult = { dataList: [], result: false, message: 'Error saving category' };
      }
    });
  }

  private appendFormData(formData: FormData): void {
    formData.append('id', this.selectedVendor?.id?.toString() ?? '0');
    formData.append('venName', this.vendorForm.get('venName')?.value ?? '');
    formData.append('venEmail', this.vendorForm.get('venEmail')?.value ?? '');
    formData.append('venMob', this.vendorForm.get('venMob')?.value ?? '');
    formData.append('venGstin', this.vendorForm.get('venGstin')?.value ?? '');
    formData.append('venShopName', this.vendorForm.get('venShopName')?.value ?? '');
    formData.append('venAddress', this.vendorForm.get('venAddress')?.value ?? '');
    formData.append('created', new Date().toISOString());
    formData.append('createdBy', 'getSessionIN');
    formData.append('updated', new Date().toISOString());
    formData.append('updatedBy', 'getSessionUP');
    if (this.vendorFileInput?.nativeElement) {
      const file = this.vendorFileInput.nativeElement.files?.[0];
      if (file) {
        formData.append('file', file, file.name);
      } else {
       // console.error('No file selected.');
      }
    }
  }
}
