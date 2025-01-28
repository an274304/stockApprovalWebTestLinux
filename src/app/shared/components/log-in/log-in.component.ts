import { Component, OnInit, AfterViewInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { GlobalStateService } from '../../services/global-state.service';
import { AuthService } from '../../services/auth.service';
import { SweetAlertService } from '../../services/sweet-alert.service';

@Component({
  selector: 'app-log-in',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './log-in.component.html',
  styleUrls: ['./log-in.component.css']
})
export class LogInComponent implements OnInit, AfterViewInit {
  loginForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private globalState: GlobalStateService,
    private sweetAlert : SweetAlertService
  ) {
    this.loginForm = this.fb.group({
      email: '',
      password: '',
      isRemember: false
    });
  }

  ngOnInit(): void {

    const userRole = this.globalState.getUserRole();
    if(userRole){
      this.redirectBasedOnRole(userRole);
    }
   
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      const { email, password, isRemember } = this.loginForm.value;
      this.authService.LogIn(email, password, isRemember).subscribe({
        next: (response) => {
          this.globalState.setToken(response.token);
          this.globalState.setUserName(response.userName);
          this.globalState.setUserImage(response.userImage);
          this.globalState.setUserId(response.userId);
          this.globalState.setUserRole(response.userRole);
          this.globalState.setIsAuthenticated('true');
          this.redirectBasedOnRole(response.userRole);
        },
        error: () => {
          this.sweetAlert.toast('Wrong Credentials !!!', 'error');
        }
      });
    }
  }

  redirectBasedOnRole(userRole : string): void {
   
    if (userRole == 'Admin') {
      this.router.navigate(['/admin']);
    } else if (userRole == 'Director') {
      this.router.navigate(['/director']);
    } else if (userRole == 'Account') {
      this.router.navigate(['/account']);
    }

  }

  ngAfterViewInit(): void {
    // Optional: Your jQuery-based password visibility toggle
  }
}
