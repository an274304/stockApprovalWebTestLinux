import { isPlatformBrowser } from '@angular/common';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class GlobalStateService {
  private tokenKey = 'token';
  private userNameKey = 'userName';
  private userImage = 'userImage';
  private userIdKey = 'userId';
  private userRoleKey = 'userRole';
  private userIsAuthenticated = 'userIsAuthenticated';

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  setToken(token: string): void {
    if (isPlatformBrowser(this.platformId)) {
    localStorage.setItem(this.tokenKey, token);
    }
  }

  getToken(): string | null {
    if (isPlatformBrowser(this.platformId)) {
      return localStorage.getItem(this.tokenKey);
    }
   
    return null;
  }

  setUserName(userName: string): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem(this.userNameKey, userName);
    }
   
  }

  getUserName(): string | null {
    if (isPlatformBrowser(this.platformId)) {
      return localStorage.getItem(this.userNameKey);
    }
 
    return null;
  }

  setUserImage(userImage: string): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem(this.userImage, userImage);
    }
   
  }

  getUserImage(): string | null {
    if (isPlatformBrowser(this.platformId)) {
      return localStorage.getItem(this.userImage);
    }
 
    return null;
  }

  setUserId(userId: string): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem(this.userIdKey, userId);
    }
    
  }

  getUserId(): string | null {
    if (isPlatformBrowser(this.platformId)) {
      return localStorage.getItem(this.userIdKey);
    }
   
    return null;
  }

  setUserRole(userRole: string): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem(this.userRoleKey, userRole);
    }
  }

  getUserRole(): string | null {
    if (isPlatformBrowser(this.platformId)) {
      return localStorage.getItem(this.userRoleKey);
    }
    return null;
  }

  setIsAuthenticated(IsAuthenticated: string): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem(this.userIsAuthenticated, IsAuthenticated);
    }
  }

  getIsAuthenticated(): string | null {
    if (isPlatformBrowser(this.platformId)) {
      return localStorage.getItem(this.userIsAuthenticated);
    }
    return null;
  }

  clear(): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem(this.tokenKey);
      localStorage.removeItem(this.userNameKey);
      localStorage.removeItem(this.userImage);
      localStorage.removeItem(this.userIdKey);
      localStorage.removeItem(this.userRoleKey);
      localStorage.removeItem(this.userIsAuthenticated);
    }
  }
}
