import { ComponentRef, Injectable, ViewContainerRef } from '@angular/core';
import { ToastComponent, ToastItem } from '../ui/toast/toast.component';
import { PlatformCheckService } from '../../shared/services/dom/platform-check.service';

@Injectable({
  providedIn: 'root',
})
export class ToastsService {
  constructor(private platformCheckService: PlatformCheckService) {}

  toastsContainerRef!: ViewContainerRef;

  toastRefs: { id: string; componentRef: ComponentRef<ToastComponent> }[] = [];

  addToast(toastProps: ToastItem) {
    if (!this.platformCheckService.isBrowser() || !this.toastsContainerRef) {
      return;
    }

    //create stringified id based on the props
    const id = JSON.stringify(toastProps);
    toastProps.idBasedOnContent = id;

    // create component ref, pass the props to the ref, and then push it to toastRefs
    const componentRef =
      this.toastsContainerRef.createComponent(ToastComponent);
    componentRef.instance.toastProps = toastProps;
    this.toastRefs.push({ id, componentRef });

    // remove the toast after the specified duration
    // if there is no specified duration, remove it after 8000 milliseconds by default;
    if (toastProps.duration) {
      this.removeToast(id, toastProps.duration);
    } else {
      this.removeToast(id, 8000);
    }
  }

  async removeToast(id: string, duration: number = 0) {
    // the default value of 0 is for immediate removal of the toast
    await new Promise((resolve) => setTimeout(resolve, duration));

    // get the index of the toast
    const toastIndex = this.toastRefs.findIndex((toast) => toast.id === id);

    // if the toast exists remove it from the dom
    if (toastIndex !== -1) {
      const componentRef = this.toastRefs[toastIndex].componentRef;
      componentRef.instance.closed = true;
      setTimeout(() => {
        componentRef.destroy();
      }, 150); // 150 is the time to wait for the slide out or fade animation
    }

    // remove the componentRef from the array
    this.toastRefs.splice(toastIndex, 1);
  }
}
