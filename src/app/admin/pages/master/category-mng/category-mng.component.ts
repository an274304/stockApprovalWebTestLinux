import { Component, ElementRef, inject, OnInit, ViewChild } from '@angular/core';
import { CategoryMngService } from '../../../services/category-mng.service';
import { CategoryMaster } from '../../../../core/Models/CategoryMaster';
import { ApiResult } from '../../../../core/DTOs/ApiResult';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { VendorMaster } from '../../../../core/Models/VendorMaster';
import { VendorMngService } from '../../../services/vendor-mng.service';
import { SweetAlertService } from '../../../../shared/services/sweet-alert.service';

@Component({
  selector: 'app-category-mng',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, FormsModule],
  templateUrl: './category-mng.component.html',
  styleUrls: ['./category-mng.component.css']
})
export class CategoryMngComponent implements OnInit {

  catListApiResult: ApiResult<CategoryMaster> = { dataList: [], result: false, message: 'Connection Not Available.' };
  vendorListApiResult: ApiResult<VendorMaster> = { dataList: [], result: false, message: 'Connection Not Available.' };

  catForm: FormGroup;
  imagePreviewUrl: string | ArrayBuffer | null = null;
  @ViewChild('catFileInput') catFileInput: ElementRef<HTMLInputElement> | undefined;
  categorySaveApiResult: ApiResult<CategoryMaster> = { data: undefined, dataList: [], result: false, message: 'Connection Not Available.' };

  selectedCat: CategoryMaster | null = null;

  searchTerm: string = '';
  filteredCategories: CategoryMaster[] = [];
  filteredVendors: VendorMaster[] = [];


  private categoryService = inject(CategoryMngService);
  private vendorService = inject(VendorMngService);
  private sweetAlert  = inject(SweetAlertService);

  constructor(private fb: FormBuilder) {
    this.catForm = this.fb.group({
      id: [0],
      catVendorId: [null, Validators.required],
      catName: ['', [Validators.required, Validators.minLength(3)]],
      catCode: ['', [Validators.required]], // Only alphanumeric codes allowed
      catPrefix: ['', [Validators.required, Validators.maxLength(5)]],
      catImg: [null],
      status: [false],
      created: [null],
      createdBy: [''],
      updated: [null],
      updatedBy: ['']
    });
  }

  ngOnInit(): void {
    this.loadCategories();
    this.loadVendors();

    this.catForm.get('catName')?.valueChanges.subscribe(value => {
      this.updateProCodeAndPrefix(value);
    });
  }



  private loadCategories(): void {
    this.categoryService.getCategories().subscribe({
      next: (response: ApiResult<CategoryMaster>) => {
        this.catListApiResult = response;
        this.filteredCategories = response.dataList ?? [];
      },
      error: (err) => {
        console.error('Error fetching categories', err);
        this.catListApiResult = { dataList: [], result: false, message: 'Error fetching categories' };
        this.filteredCategories = [];
      }
    });
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
      this.filteredCategories = this.catListApiResult.dataList?.filter(cat =>
        cat.catName?.toLowerCase().includes(this.searchTerm.toLowerCase())
      ) ?? [];
    } else {
      this.filteredCategories = this.catListApiResult.dataList ?? [];
    }
  }

  onSelectCategory(category: CategoryMaster): void {
    this.categoryService.getCategoryById(category.id!).subscribe({
      next: (response: ApiResult<CategoryMaster>) => {
        if (response.result && response.data) {
          this.selectedCat = response.data;

          // Set the image preview URL
          this.imagePreviewUrl = this.selectedCat.catImg ? this.selectedCat.catImg : null;

          // Prepare form data without the file input field
          const { catImg, ...formData } = this.selectedCat;

          // Patch the form with other fields
          this.catForm.patchValue(formData);
        }
      },
      error: (err) => {
        console.error('Error fetching category by ID', err);
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
    this.catForm.reset();
    this.catForm.markAsPristine();
    this.selectedCat = null;
    this.imagePreviewUrl = null;
  }

  submitForm(): void {
    if (this.catForm.invalid) {
      this.sweetAlert.toast('Form Is Invalid', 'warning');
      this.catForm.markAllAsTouched(); // Mark all fields as touched to show errors
      return;
    }

    const formData = new FormData();
    this.appendFormData(formData);

    const saveOrUpdate$ = this.selectedCat?.id ?
      this.categoryService.updateCategory(formData) :
      this.categoryService.saveCategory(formData);

    saveOrUpdate$.subscribe({
      next: (response: ApiResult<CategoryMaster>) => {
        this.categorySaveApiResult = response;
        if (response.result) {
          this.sweetAlert.toast(this.selectedCat ? 'Updated successfully' : 'Saved successfully', 'success');
          this.loadCategories();
          this.resetForm();
        } else {
          this.sweetAlert.toast('Failed To Save', 'warning');
        }
      },
      error: (err) => {
        console.error('Error saving category', err);
        this.categorySaveApiResult = { dataList: [], result: false, message: 'Error saving category' };
      }
    });
  }

  private appendFormData(formData: FormData): void {
    formData.append('id', this.selectedCat?.id?.toString() ?? '0');
    formData.append('catName', this.catForm.get('catName')?.value ?? '');
    formData.append('catCode', this.catForm.get('catCode')?.value ?? '');
    formData.append('catPrefix', this.catForm.get('catPrefix')?.value ?? '');
    formData.append('catVendorId', this.catForm.get('catVendorId')?.value ?? '');
    formData.append('created', new Date().toISOString());
    formData.append('createdBy', 'getSessionIN');
    formData.append('updated', new Date().toISOString());
    formData.append('updatedBy', 'getSessionUP');
    if (this.catFileInput?.nativeElement) {
      const file = this.catFileInput.nativeElement.files?.[0];
      if (file) {
        formData.append('file', file, file.name);
      } else {
        console.error('No file selected.');
      }
    }
  }

  updateProCodeAndPrefix(value: string): void {
    const firstThreeLetters = value.substring(0, 3).toUpperCase();

    this.catForm.patchValue({
      catCode: firstThreeLetters,
      catPrefix: firstThreeLetters
    });
  }
}
