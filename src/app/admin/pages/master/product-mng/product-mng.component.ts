import { CommonModule } from '@angular/common';
import { Component, ElementRef, inject, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ApiResult } from '../../../../core/DTOs/ApiResult';
import { ProductMaster } from '../../../../core/Models/ProductMaster';
import { ProductMngService } from '../../../services/product-mng.service';
import { CategoryMaster } from '../../../../core/Models/CategoryMaster';
import { CategoryMngService } from '../../../services/category-mng.service';
import { SweetAlertService } from '../../../../shared/services/sweet-alert.service';

@Component({
  selector: 'app-product-mng',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, FormsModule],
  templateUrl: './product-mng.component.html',
  styleUrl: './product-mng.component.css'
})
export class ProductMngComponent {
  catListApiResult: ApiResult<CategoryMaster> = { dataList: [], result: false, message: 'Connection Not Available.' };
  productListApiResult: ApiResult<ProductMaster> = { dataList: [], result: false, message: 'Connection Not Available.' };

  productForm: FormGroup;

  imagePreviewUrl: string | ArrayBuffer | null = null;
  @ViewChild('productFileInput') productFileInput: ElementRef<HTMLInputElement> | undefined;
  productSaveApiResult: ApiResult<ProductMaster> = { data: undefined, dataList: [], result: false, message: 'Connection Not Available.' };

  selectedProduct: ProductMaster | null = null;

  searchTerm: string = '';
  filteredProducts: ProductMaster[] = [];
  filteredCategories: CategoryMaster[] = [];


  private productService = inject(ProductMngService);
  private categoryService = inject(CategoryMngService);
  private sweetAlert  = inject(SweetAlertService);

  constructor(private fb: FormBuilder) {
    this.productForm = this.fb.group({
      id: [0],
      catId: [null, [Validators.required]], // Ensure a category is selected
      proName: ['', [Validators.required, Validators.maxLength(100)]], // Required and max length
      proCode: ['', [Validators.required]], // Required
      proPrefix: ['', [Validators.maxLength(50), Validators.required]], // Optional, but max length
      proType: [''],
      proImg: [null],
      proBuyDt: [null],
      proExpDt: [null],
      status: [false],
      isAsset: [false],
      proDesc: ['N/A', [Validators.required]],
      created: [null],
      createdBy: [''],
      updated: [null],
      updatedBy: ['']
    });
  }

  ngOnInit(): void {
    this.loadProductes();
    this.loadCategories();

    this.productForm.get('proName')?.valueChanges.subscribe(value => {
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

  private loadProductes(): void {
    this.productService.getProducts().subscribe({
      next: (response: ApiResult<ProductMaster>) => {
        this.productListApiResult = response;
        this.filteredProducts = response.dataList ?? [];
      },
      error: (err) => {
        console.error('Error fetching products', err);
        this.productListApiResult = { dataList: [], result: false, message: 'Error fetching products' };
        this.filteredProducts = [];
      }
    });
  }

  onSearchChange(): void {
    if (this.searchTerm) {
      this.filteredProducts = this.productListApiResult.dataList?.filter(product =>
        product.proName?.toLowerCase().includes(this.searchTerm.toLowerCase())
      ) ?? [];
    } else {
      this.filteredProducts = this.productListApiResult.dataList ?? [];
    }
  }

  onSelectProduct(product: ProductMaster): void {
    this.productService.getProductById(product.id!).subscribe({
      next: (response: ApiResult<ProductMaster>) => {
        if (response.result && response.data) {
          this.selectedProduct = response.data;

          // Set the image preview URL
          this.imagePreviewUrl = this.selectedProduct.proImg ? this.selectedProduct.proImg : null;

          // Prepare form data without the file input field
          const { proImg, ...formData } = this.selectedProduct;

          // Patch the form with other fields, including isAsset as a boolean
          this.productForm.patchValue({
            ...formData,
            isAsset: !!formData.isAsset // Convert to boolean
          });

        }
      },
      error: (err) => {
        console.error('Error fetching product by ID', err);
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
    this.productForm.reset();
    this.productForm.markAsPristine();
    this.selectedProduct = null;
    this.imagePreviewUrl = null;
  }

  submitForm(): void {
    if (this.productForm.invalid) {
      this.sweetAlert.toast('Form Is Invalid', 'warning');
      this.productForm.markAllAsTouched(); // Mark all controls as touched to trigger validation messages
      return;
    }

    const formData = new FormData();
    this.appendFormData(formData);

    const saveOrUpdate$ = this.selectedProduct?.id ?
      this.productService.updateProduct(formData) :
      this.productService.saveProduct(formData);

    saveOrUpdate$.subscribe({
      next: (response: ApiResult<ProductMaster>) => {
        this.productSaveApiResult = response;
        if (response.result) {
          this.sweetAlert.toast(this.selectedProduct ? 'Updated successfully' : 'Saved successfully', 'success');
          this.loadProductes();
          this.resetForm();
        } else {
          this.sweetAlert.toast('Failed To Save', 'warning');
        }
      },
      error: (err) => {
        console.error('Error saving category', err);
        this.productSaveApiResult = { dataList: [], result: false, message: 'Error saving category' };
      }
    });
  }

  appendFormData(formData: FormData): void {
    formData.append('id', this.selectedProduct?.id?.toString() ?? '0');
    formData.append('catId', this.productForm.get('catId')?.value ?? '');
    formData.append('proName', this.productForm.get('proName')?.value ?? '');
    formData.append('proCode', this.productForm.get('proCode')?.value ?? '');
    formData.append('proPrefix', this.productForm.get('proPrefix')?.value ?? '');
    formData.append('isAsset', this.productForm.get('isAsset')?.value);
    formData.append('proDesc', this.productForm.get('proDesc')?.value);
    formData.append('created', new Date().toISOString());
    formData.append('createdBy', 'getSessionIN');
    formData.append('updated', new Date().toISOString());
    formData.append('updatedBy', 'getSessionUP');
    if (this.productFileInput?.nativeElement) {
      const file = this.productFileInput.nativeElement.files?.[0];
      if (file) {
        formData.append('file', file, file.name);
      } else {
        // console.error('No file selected.');
      }
    }
  }

  updateProCodeAndPrefix(value: string): void {
    const firstThreeLetters = value.substring(0, 3).toUpperCase();

    this.productForm.patchValue({
      proCode: firstThreeLetters,
      proPrefix: firstThreeLetters
    });
  }
}
