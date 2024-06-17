import {Router} from '@angular/router';
import {Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';

// import {User} from 'src/app/core/models/user';
// import {Screen} from 'src/app/core/enums/screen';

import {UnitySelectComponent} from './unity/unity.component';

// import {ModalService} from '';
// import {AuthService} from 'src/app/core/services/api/auth.service';
// import {StorageService} from 'src/app/core/services/storage.service';

interface Item {
  title: string;
  icon?: string;
  open?: boolean;
  notification?: boolean;
  url?: string;
  permission?: Screen;
  subItems?: Item[];
  sectionTitle?: string;
}

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {

  @Output() toogleMenu = new EventEmitter<void>();
  @ViewChild('menu', {static: true}) menuEl!: ElementRef<HTMLUListElement>;

  @Input() open = true;

  user: User;

  items: Item[] = [
    { title: 'Dashboard', icon: 'assets/icon/grid.svg', url: '/', permission: Screen.Dashboard },
  ];
  allMenuItems: any[] = [];

  constructor(
    private router: Router,
    private _auth: AuthService,
    private _modal: ModalService,
    private _storage: StorageService,
  ) {
    this.user = this._storage.getUser;
    this.items = this.checkPermission(this.items);
  }

  ngOnInit() {
    const routerLinkActive = this.router.url;

    setTimeout(() => {
      const items = Array.from(this.menuEl.nativeElement.querySelectorAll('.subItems'));
      items.forEach(item => {
        const aEl = item.querySelector(`[href="${routerLinkActive}"]`);
        if (aEl) item.classList.add('open');
      });
    });
    this.allMenuItems = this.items;
  }

  get unity() {
    return this._storage.getUnity;
  }

  openSubItems(event: Event, liEl: any, item: any, hasSubItem: boolean = false) {

    event.stopPropagation();

    if (!hasSubItem) {
      return;
    }

    if (item.open) {
      item.open = false;
      return;
    }

    this.allMenuItems.forEach(menuItem => {
      menuItem.open = false;
    });

    item.open = true;
  }

  closeMenu() {
    this.allMenuItems.forEach(menuItem => {
      menuItem.open = false;
    });
  }

  async openUnity() {
    this._modal.open(UnitySelectComponent);

    // if (['ROOT', 'ADMIN'].includes(this.user.tipoUsuario.chave)) {
    //   this._modal.open(UnitySelectComponent);
    //   const data = await this._modal.onClose();
    //   if (data) {
    //     this.router.navigateByUrl('/');
    //     if (this.router.url === '/') window.location.reload();
    //   }
    // }
  }

  private checkPermission(items: Item[]) {
    const result: Item[] = [];
    for (const item of items) {
      if (item.subItems?.length) {
        item.subItems = this.checkPermission(item.subItems);
        if (item.subItems.length) result.push(item);
      } else if (!item.permission || this.user.screens?.some(x => x.name === item.permission)) {
        result.push(item);
      }
    }
    return result;
  }

  signOut() {
    this._auth.signOut();
    this.router.navigateByUrl('/auth/entrar');
  }
}
