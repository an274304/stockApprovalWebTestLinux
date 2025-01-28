import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { GlobalStateService } from '../../../shared/services/global-state.service';
import { AuthService } from '../../../shared/services/auth.service';
declare var $ : any;

@Component({
  selector: 'app-account-layout',
  standalone: true,
  imports: [CommonModule,RouterOutlet,RouterLink],
  templateUrl: './account-layout.component.html',
  styleUrl: './account-layout.component.css'
})
export class AccountLayoutComponent {
  username : string = '';
  userImg : string = '';

  constructor(private globalState: GlobalStateService, private router: Router, private authService : AuthService) {
   
  }

  ngOnInit(): void {
    this.username= this.globalState.getUserName() ?? '';
    this.userImg= this.globalState.getUserImage() ?? '/assets/images/avatars/01.png';
  }
  
  logOut(): void {
    this.globalState.clear();  // Clear global state
    this.router.navigate(['/login']);  // Redirect to login
  }

  ngAfterViewInit(): void {
    $('#sidenav').metisMenu();

    $(".btn-toggle").click(function () {
      $("body").hasClass("toggled") ? ($("body").removeClass("toggled"), $(".sidebar-wrapper").unbind("hover")) : ($("body").addClass("toggled"), $(".sidebar-wrapper").hover(function () {
        $("body").addClass("sidebar-hovered")
      }, function () {
        $("body").removeClass("sidebar-hovered")
      }))
    })
  
  }
}
