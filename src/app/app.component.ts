import { AfterViewInit, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { GlobalStateService } from './shared/services/global-state.service';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, AfterViewInit {
  title = 'Stock Approval';

  constructor(private globalState: GlobalStateService, private router: Router) {
    
  }

  ngOnInit(): void {
    if(this.globalState.getIsAuthenticated() == 'true'){

      this.redirectBasedOnRole();

    }
    else{
      this.router.navigate(['/login']);  // Redirect to login
    }
  }

  ngAfterViewInit(): void {
   
  }

  redirectBasedOnRole(): void {
    const userRole = this.globalState.getUserRole();

    if (userRole === 'admin') {
      this.router.navigate(['/admin']);
    } else if (userRole === 'director') {
      this.router.navigate(['/director']);
    } else if (userRole === 'account') {
      this.router.navigate(['/account']);
    }
  }
}
