import { Component, inject, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { UserMaster } from '../../../core/Models/UserMaster';
import { ApiResult } from '../../../core/DTOs/ApiResult';
import { UserMngService } from '../../../admin/services/user-mng.service';
import { BranchMaster } from '../../../core/Models/BranchMaster';
import { BranchMngService } from '../../../admin/services/branch-mng.service';
import { DepartmentMaster } from '../../../core/Models/DepartmentMaster';
import { DepartmentMngService } from '../../../admin/services/department-mng.service';

@Component({
  selector: 'app-profile-card',
  standalone: true,
  imports: [],
  templateUrl: './profile-card.component.html',
  styleUrls: ['./profile-card.component.css']
})
export class ProfileCardComponent implements OnInit, OnChanges {
  @Input() selectedUser?: UserMaster;

  branchListApiResult: ApiResult<BranchMaster> = { dataList: [], result: false, message: 'Connection Not Available.' };
  departmentListApiResult: ApiResult<DepartmentMaster> = { dataList: [], result: false, message: 'Connection Not Available.' };

  filteredBranches: BranchMaster[] = [];
  filteredDepartments: DepartmentMaster[] = [];

  private branchService = inject(BranchMngService);
  private departmentService = inject(DepartmentMngService);

  userImg: string = '';
  userName: string = '';
  userType: string = '';
  userBranch: string = 'Loading...';
  userDepartment: string = 'Loading...';
  userEmail: string = '';
  userMob: string = '';

  constructor() {}

  ngOnInit(): void {
    this.loadBranches();
    this.loadDepartments();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['selectedUser'] && this.selectedUser) {
      this.userImg = this.selectedUser.usImg ?? '';
      this.userName = this.selectedUser.usName ?? '';
      this.userType = this.selectedUser.usTypeName ?? '';
      this.userEmail = this.selectedUser.usEmail ?? '';
      this.userMob = this.selectedUser.usMob ?? '';

      this.updateUserBranchAndDepartment();
    }
  }

  private loadBranches(): void {
    this.branchService.getBranches().subscribe({
      next: (response: ApiResult<BranchMaster>) => {
        if (response.result) {
          this.branchListApiResult = response;
          this.filteredBranches = response.dataList ?? [];
          this.updateUserBranchAndDepartment(); // Update after loading branches
        }
      },
      error: (err) => {
        console.error('Error fetching branches', err);
        this.branchListApiResult = { dataList: [], result: false, message: 'Error fetching branches' };
        this.filteredBranches = [];
      }
    });
  }

  private loadDepartments(): void {
    this.departmentService.getDepartments().subscribe({
      next: (response: ApiResult<DepartmentMaster>) => {
        this.departmentListApiResult = response;
        this.filteredDepartments = response.dataList ?? [];
        this.updateUserBranchAndDepartment(); // Update after loading departments
      },
      error: (err) => {
        console.error('Error fetching Departments', err);
        this.departmentListApiResult = { dataList: [], result: false, message: 'Error fetching Departments' };
        this.filteredDepartments = [];
      }
    });
  }

  private updateUserBranchAndDepartment(): void {
    if (this.selectedUser) {
      this.userBranch = this.filteredBranches.find(branch => branch.id === this.selectedUser?.usBranchId)?.branchName ?? 'Loading...';
      this.userDepartment = this.filteredDepartments.find(department => department.id === this.selectedUser?.usDepartmentId)?.depName ?? 'Loading...';
    }
  }
}
