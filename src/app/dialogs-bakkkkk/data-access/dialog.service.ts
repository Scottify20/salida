// import { DOCUMENT } from '@angular/common';
// import { ElementRef, Inject, Injectable } from '@angular/core';
// import { PlatformCheckService } from '../../shared/services/dom/platform-check.service';
// import { ScrollDisablerService } from '../../shared/services/dom/scroll-disabler.service';

// @Injectable({
//   providedIn: 'root',
// })
// export class DialogService {
//   constructor(
//     @Inject(DOCUMENT) private document: Document,
//     private platformCheck: PlatformCheckService,
//     private scrollDisablerService: ScrollDisablerService,
//   ) {}

//   dialogRefs: { key: string; dialogRef: ElementRef }[] = [];

//   addDialog(id: string, dialogRef: ElementRef) {
//     if (this.platformCheck.isServer()) {
//       console.log('no element ref');
//       return;
//     }

//     const dialogElement = dialogRef.nativeElement as HTMLDivElement;

//     this.document.body.appendChild(dialogElement);
//     this.scrollDisablerService.disableBodyScroll(id);
//     this.dialogRefs.push({ key: id, dialogRef: dialogRef });
//   }

//   removeDialog(id: string) {
//     const dialogRef = this.dialogRefs.find((ref) => ref.key === id)?.dialogRef;
//     const dialogRefIndex = this.dialogRefs.findIndex((ref) => ref.key === id);

//     if (!dialogRefIndex || !dialogRef) {
//       return;
//     }

//     this.document.body.removeChild(dialogRef.nativeElement);
//     this.scrollDisablerService.enableBodyScroll(id);
//     this.dialogRefs.splice(dialogRefIndex, 1);
//   }
// }
