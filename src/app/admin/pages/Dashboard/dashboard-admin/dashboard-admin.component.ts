import { Component, OnInit } from '@angular/core';
import { ApiResult } from '../../../../core/DTOs/ApiResult';
import { CountDashboard } from '../../../../core/DTOs/CountDashboard';
import { SweetAlertService } from '../../../../shared/services/sweet-alert.service';
import { DashboardAdminServiceService } from '../../../services/dashboard-admin-service.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dashboard-admin',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard-admin.component.html',
  styleUrl: './dashboard-admin.component.css'
})
export class DashboardAdminComponent implements OnInit {
  bgGrdColor: string[] = ['branding', 'danger', 'deep-blue', 'info', 'success', 'warning', 'primary'];
  dashboardApiResult?: CountDashboard[] = [];

 // Ensure monthWiseExpense is initialized as an empty CountDashboard object
 monthWiseExpense: CountDashboard = new CountDashboard({
  items: [], // Default to an empty array
});

  constructor(
    private DashboardAdmin: DashboardAdminServiceService,
    private sweetAlert: SweetAlertService
  ) {

  }

  ngOnInit(): void {
    this.GetCountDashboard();
  }

  GetCountDashboard() {
    this.DashboardAdmin.GetCountDashboard().subscribe({
      next: (response: ApiResult<CountDashboard>) => {
        if (response.result) {
          this.dashboardApiResult = response.dataList;
        }
        else {
          this.sweetAlert.toast('Fail To Load Dashboard', 'warning');
        }
      },
      error: (err: any) => {
        console.error('Error fetching Order Details', err);
      }
    });

  }

  monthWisExpenseChange(event: Event) {
    const input = event.target as HTMLInputElement;
    const value = input.value;  // value is in the format YYYY-MM
    const [year, month] = value.split('-'); // Split into year and month
    
    this.DashboardAdmin.GetExpensesOfMonthByMonthAndYear(this.parseAsNumber(month), this.parseAsNumber(year))
    .subscribe({
      next: (response: ApiResult<CountDashboard>) => {
        if (response.result) {
          this.monthWiseExpense = response.data || new CountDashboard({ items: [] }); // Fallback to empty if undefined
        } else {
          this.sweetAlert.toast('Fail To Load Month Wise Expense', 'warning');
          this.monthWiseExpense = new CountDashboard({ items: [] }); // Fallback to empty
        }
      },
      error: (err: any) => {
        console.error('Error fetching Order Details', err);
        this.monthWiseExpense = new CountDashboard({ items: [] }); // Fallback to empty on error
      }
    });
  }

  getRandomBackgroundColor(): string {
    const randomIndex = Math.floor(Math.random() * this.bgGrdColor.length);
    return this.bgGrdColor[randomIndex];
  }

  parseAsNumber(itemCount: any) {
    return parseInt(itemCount);
  }
}
