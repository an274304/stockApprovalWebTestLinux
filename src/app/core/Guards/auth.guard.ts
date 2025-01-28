import { Injectable } from "@angular/core";
import { CanActivate, Router} from "@angular/router";
import { GlobalStateService } from "../../shared/services/global-state.service";

@Injectable({providedIn:"root"})
export class AuthGaurd implements CanActivate{
constructor(private globalState: GlobalStateService, private router: Router){}

canActivate():boolean {

     if (this.globalState.getIsAuthenticated())
    {
        return true;
    }
    else 
    {
        this.router.navigate(['/login']);
        return false;
    }
}
}