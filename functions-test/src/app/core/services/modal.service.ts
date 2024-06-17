import {
  ApplicationRef,
  ComponentRef,
  createComponent,
  EmbeddedViewRef,
  Injectable,
  Injector,
  Type,
} from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ModalService<T = any> {

  private dataReturn?: any;
  private componentRef?: ComponentRef<T>;
  private display?: BehaviorSubject<boolean>;

  constructor(
    private injector: Injector,
    private appRef: ApplicationRef
  ) { }

  open(component: Type<T>, data?: any) {
    if (this.componentRef) return;

    const elementInjector = Injector.create({
			providers: [],
			parent: this.injector
		});

    this.componentRef = createComponent(component, {
			elementInjector,
			environmentInjector: this.appRef.injector
		});

    for (const name in data) {
      this.componentRef.setInput(name, data[name]);
    }

    this.appRef.attachView(this.componentRef.hostView);

    const domElem = (this.componentRef.hostView as EmbeddedViewRef<any>).rootNodes[0] as HTMLElement;
    document.body.appendChild(domElem);

    this.display = new BehaviorSubject<boolean>(true);
  }

  async onClose<T = any>(): Promise<T | undefined> {
    return new Promise(resolve => {
      this.display?.subscribe(res => {
        if (!res) {
          resolve(this.dataReturn);
          this.dataReturn = undefined;
        }
      })
    });
  }

  close(params?: any) {
    if (!this.componentRef) return;

    this.appRef.detachView(this.componentRef.hostView);
    this.componentRef.destroy();

    this.componentRef = undefined;

    this.dataReturn = params;
    this.display?.next(false);
    this.display = undefined;
  }
}
