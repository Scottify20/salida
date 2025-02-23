import { Injectable, PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser, isPlatformServer } from '@angular/common';
import UAParser from 'ua-parser-js';

@Injectable({ providedIn: 'root' })
export class PlatformCheckService {
  private platformId = inject<Object>(PLATFORM_ID);

  constructor() {
    this.startDetectedOSAttributeInsertion();

    if (this.isBrowser()) {
      this.parser = new UAParser(navigator.userAgent);
    }
  }

  parser!: UAParser;

  isBrowser(): boolean {
    return isPlatformBrowser(this.platformId);
  }

  isServer(): boolean {
    return isPlatformServer(this.platformId);
  }

  // inserts a class of the OS's name to the body
  // 'android' , 'windows', etc.
  startDetectedOSAttributeInsertion() {
    if (this.isServer()) {
      return;
    }

    if (this.isWindows()) {
      document.body.setAttribute('data-detected-os', 'windows');
    }

    if (this.isAndroid()) {
      document.body.setAttribute('data-detected-os', 'android');
    }
  }

  isWindows(): boolean {
    return navigator.userAgent.includes('Windows');
  }

  isAndroid(): boolean {
    return navigator.userAgent.includes('Android');
  }

  isChromium(): boolean {
    if (!this.parser) {
      return false;
    }

    const engineName = this.parser.getEngine().name;
    console.log(engineName);
    return engineName && engineName.includes('Blink') ? true : false;
  }

  isChromiumAndWindows() {
    return this.isChromium() && this.isWindows();
  }
}
