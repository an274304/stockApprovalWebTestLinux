import { Component, ElementRef, inject, ViewChild } from '@angular/core';
import { ApiResult } from '../../../../core/DTOs/ApiResult';
import { CurrencyMaster } from '../../../../core/Models/CurrencyMaster';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CurrencyMngService } from '../../../services/currency-mng.service';
import { CommonModule } from '@angular/common';
import { SweetAlertService } from '../../../../shared/services/sweet-alert.service';

@Component({
  selector: 'app-currency-mng',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, FormsModule],
  templateUrl: './currency-mng.component.html',
  styleUrl: './currency-mng.component.css'
})
export class CurrencyMngComponent {
  currencyListApiResult: ApiResult<CurrencyMaster> = { dataList: [], result: false, message: 'Connection Not Available.' };
  currencyForm: FormGroup;
  imagePreviewUrl: string | ArrayBuffer | null = null;
  @ViewChild('CurrencyFileInput') currencyFileInput: ElementRef<HTMLInputElement> | undefined;
  currencySaveApiResult: ApiResult<CurrencyMaster> = { data: undefined, dataList: [], result: false, message: 'Connection Not Available.' };

  selectedCurrency: CurrencyMaster | null = null;

  searchTerm: string = '';
  filteredCurrencies : CurrencyMaster[] = [];

  private currencyService = inject(CurrencyMngService);
  private sweetAlert  = inject(SweetAlertService);

  constructor(private fb: FormBuilder) {
    const today = new Date().toISOString().split('T')[0]; // Format today's date to 'yyyy-MM-dd'
  
    this.currencyForm = this.fb.group({
      id: [0],
      currName: ['', [Validators.required, Validators.minLength(2)]],  // Minimum 2 characters
      currCode: ['', [Validators.required, Validators.maxLength(3)]],  // Max length 3
      currPrefix: ['', Validators.required],  // Added required validation
      currSymbol: [''],
      currInrVal: [null, [Validators.required, Validators.pattern("^[0-9]*$")]], // Must be a number
      currInrValDate: [today, Validators.required],  // Date is required
      status: [false],
      created: [null],
      createdBy: [''],
      updated: [null],
      updatedBy: ['']
    });
  }
  ngOnInit(): void {
    this.loadCurrency();
  }


  private loadCurrency(): void {
    this.currencyService.getCurrencies().subscribe({
      next: (response: ApiResult<CurrencyMaster>) => {
        this.currencyListApiResult = response;
        this.filteredCurrencies = response.dataList ?? [];
      },
      error: (err) => {
        console.error('Error fetching currencies', err);
        this.currencyListApiResult = { dataList: [], result: false, message: 'Error fetching currencies' };
        this.filteredCurrencies = [];
      }
    });
  }

  onSearchChange(): void {
    if (this.searchTerm) {
      this.filteredCurrencies = this.currencyListApiResult.dataList?.filter(currency =>
        currency.currName?.toLowerCase().includes(this.searchTerm.toLowerCase())
      ) ?? [];
    } else {
      this.filteredCurrencies = this.currencyListApiResult.dataList ?? [];
    }
  }

  onSelectCurrency(currency: CurrencyMaster): void {
    this.currencyService.getCurrencyById(currency.id!).subscribe({
      next: (response: ApiResult<CurrencyMaster>) => {
        if (response.result && response.data) {
          this.selectedCurrency = response.data;

          // Set the image preview URL
          this.imagePreviewUrl = this.selectedCurrency.currSymbol ? this.selectedCurrency.currSymbol : null;

          // Prepare form data without the file input field
          const { currSymbol, ...formData } = this.selectedCurrency;

          // Patch the form with other fields
          this.currencyForm.patchValue(formData);
        }
      },
      error: (err) => {
        console.error('Error fetching currency by ID', err);
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
    this.currencyForm.reset();
    this.currencyForm.markAsPristine();
    this.selectedCurrency = null;
    this.imagePreviewUrl = null;
  }

  submitForm(): void {
    if (this.currencyForm.invalid) {
      // Mark all fields as touched so errors show up
      this.sweetAlert.toast('Form Is Invalid', 'warning');
      this.currencyForm.markAllAsTouched();
      return;
    }
  
    const formData = new FormData();
    this.appendFormData(formData);
  
    const saveOrUpdate$ = this.selectedCurrency?.id ? 
      this.currencyService.updateCurrency(formData) : 
      this.currencyService.saveCurrency(formData);
  
    saveOrUpdate$.subscribe({
      next: (response: ApiResult<CurrencyMaster>) => {
        this.currencySaveApiResult = response;
        if (response.result) {
          this.sweetAlert.toast(this.selectedCurrency ? 'Updated successfully' : 'Saved successfully', 'success');
          this.loadCurrency();
          this.resetForm();
        } else {
          this.sweetAlert.toast('Failed To Save', 'warning');
        }
      },
      error: (err) => {
        console.error('Error saving currency', err);
        this.currencySaveApiResult = { dataList: [], result: false, message: 'Error saving currency' };
      }
    });
  }

  private appendFormData(formData: FormData): void {
    formData.append('id', this.selectedCurrency?.id?.toString() ?? '0');
    formData.append('currName', this.currencyForm.get('currName')?.value ?? '');
    formData.append('currCode', this.currencyForm.get('currCode')?.value ?? '');
    formData.append('currPrefix', this.currencyForm.get('currPrefix')?.value ?? '');
    formData.append('currInrVal', this.currencyForm.get('currInrVal')?.value ?? '');
    formData.append('currInrValDate', this.currencyForm.get('currInrValDate')?.value ?? '');
    formData.append('created', new Date().toISOString());
    formData.append('createdBy', 'getSessionIN');
    formData.append('updated', new Date().toISOString());
    formData.append('updatedBy', 'getSessionUP');
    if (this.currencyFileInput?.nativeElement) {
      const file = this.currencyFileInput.nativeElement.files?.[0];
      if (file) {
        formData.append('file', file, file.name);
      } else {
       // console.error('No file selected.');
      }
    }
  }  
}
