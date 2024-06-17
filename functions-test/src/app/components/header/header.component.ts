import { Router } from '@angular/router';
import { Component, ElementRef, EventEmitter, Output, Renderer2 } from '@angular/core';


import { AuthService } from 'src/app/core/services/auth.service';
import { StorageService } from 'src/app/core/services/storage.service';
import { User } from 'src/app/core/models/user';


@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {

  @Output() toogleMenu = new EventEmitter<void>();

  user?: User;
  hasNotifications = false;
  menuVisible = false;
  listenerFn: () => void = () => { };

  constructor(
    private router: Router,
    private _storage: StorageService,
    private _elementRef: ElementRef,
    private renderer: Renderer2,
    private _authService: AuthService,
  ) {
    this.user = this._storage.getUser;
    this.user.pictureFile
  }

  goToLogin() {
    this.router.navigateByUrl('/auth/entrar');
  }

  toggleMenu(): void {
    this.menuVisible = !this.menuVisible;
    this.listenerFn = this.renderer.listen('document', 'click', (event: any) => {
      if (!this._elementRef.nativeElement.contains(event.target)) {
        this.menuVisible = false;
        this.listenerFn();
      }
    });
  }

  signOut() {
    this._authService.signOut();
    this.router.navigateByUrl('/auth/entrar');
  }

  editPerfil(){
    this.router.navigate(['/perfil']);
  }

}
