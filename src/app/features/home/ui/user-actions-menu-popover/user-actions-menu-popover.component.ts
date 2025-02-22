import {
  Component,
  computed,
  DestroyRef,
  ElementRef,
  Inject,
  Signal,
  signal,
  ViewChild,
} from '@angular/core';

import { DOCUMENT } from '@angular/common';
import { ElementPositionService } from '../../../../shared/services/dom/element-position.service';
import { ScrollDisablerService } from '../../../../shared/services/dom/scroll-disabler.service';
import { fromEvent, tap } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { UserService } from '../../../../core/user/user.service';
import { FirebaseAuthService } from '../../../../core/auth/firebase-auth.service';
import { Router } from '@angular/router';

export interface PopoverProps {
  popoverId: string;
  anchoringConfig: {
    anchorElementId: string;
    position:
      | 'bottom'
      | 'top'
      | 'left'
      | 'right'
      | 'bottom-start'
      | 'bottom-end'
      | 'top-start'
      | 'top-end'
      | 'right-start'
      | 'right-end'
      | 'left-start'
      | 'left-end';
  };
  backdrop: 'mobile-only' | 'always' | 'none';
  itemSectionsConfig: ItemsConfigSection[];
}

interface ItemsConfigSection {
  contentType: 'icon' | 'icon-and-text' | 'text';
  sectionName: string;
  items: MenuItem[];
}

export interface MenuItem {
  iconPath?: string;
  text?: string | Signal<string | null | undefined> | (() => string);
  isActive?: () => boolean; // refer to the isActiveClass() method on the end of this component's class
  isVisibleIf?: () => boolean | Signal<boolean | null | undefined>; // shows the item if true, hide otherwise // always show if this fn is not defined
  onClickCallback?: () => void;
}

@Component({
  selector: 'app-user-actions-menu-popover',
  imports: [],
  templateUrl: './user-actions-menu-popover.component.html',
  styleUrl: './user-actions-menu-popover.component.scss',
})
export class UserActionsMenuPopoverComponent {
  // Inject services
  constructor(
    private elementPositionService: ElementPositionService,
    private scrollDisablerService: ScrollDisablerService,
    @Inject(DOCUMENT) private document: Document,
    private destroyRef: DestroyRef,
    private userService: UserService,
    private firebaseAuthService: FirebaseAuthService,
    private router: Router,
  ) {}

  // Input property for popover configuration
  popoverProps: PopoverProps = {
    popoverId: 'user-actions-menu-popover',
    anchoringConfig: {
      anchorElementId: 'user-button',
      position: 'bottom-end',
    },
    itemSectionsConfig: [
      {
        contentType: 'icon-and-text',
        sectionName: 'auth',
        items: [
          {
            text: 'Create Account',
            iconPath: '/assets/icons/popover/create_account.svg',
            isVisibleIf: computed(() => {
              return this.userService.userSig() ? false : true;
            }),
            onClickCallback: () => {
              this.router.navigateByUrl('/auth/signup');
            },
          },
          {
            text: 'Log in',
            iconPath: '/assets/icons/popover/login.svg',
            isVisibleIf: computed(() => {
              return this.userService.userSig() ? false : true;
            }),
            onClickCallback: () => {
              this.router.navigateByUrl('/auth/login');
            },
          },
        ],
      },
      {
        contentType: 'icon-and-text',
        sectionName: 'section1',
        items: [
          {
            text: () => {
              const identifier =
                this.userService.userPlainStringIdentifierSig();
              const charLimit = 15;
              const trail = '...';

              return identifier.length + trail.length <= charLimit
                ? identifier
                : `${identifier.substring(0, charLimit - trail.length) + trail}`;
            },
            iconPath: '/assets/icons/popover/user.svg',
            isVisibleIf: computed(() => {
              return this.userService.userSig() ? true : false;
            }),
            // need to change ---------------------------------------------
            onClickCallback: () => {
              this.router.navigateByUrl(
                `/user/${this.userService.userDisplayNameSig()?.toLocaleLowerCase()}`,
              );
            },
          },
          {
            text: 'Notifications',
            iconPath: '/assets/icons/popover/notifications.svg',
            isVisibleIf: computed(() => {
              return this.userService.userSig() ? true : false;
            }),
            // need to change -----------------------------------------------
            onClickCallback: () => {
              this.router.navigateByUrl(`/notifications`);
            },
          },
        ],
      },
      {
        contentType: 'icon-and-text',
        sectionName: 'section2',
        items: [
          {
            text: 'Settings',
            iconPath: '/assets/icons/popover/settings.svg',
            isVisibleIf: computed(() => {
              return this.userService.userSig() ? true : false;
            }),
            // need to change -----------------------------------------------
            onClickCallback: () => {
              this.router.navigateByUrl(`/settings`);
            },
          },
          {
            text: 'Logout',
            iconPath: '/assets/icons/popover/logout.svg',
            onClickCallback: () => {
              this.firebaseAuthService.signOut();
            },
            isVisibleIf: computed(() => {
              return this.userService.userSig() ? true : false;
            }),
          },
        ],
      },
    ],
    backdrop: 'mobile-only',
  };

  // View child references
  @ViewChild('popoverSectionsContainer')
  popoverSectionsContainer!: ElementRef;

  // Signal to track popover open/close state
  isOpenSig = signal(false);

  ngAfterViewInit() {
    this.setupEventListeners();
  }

  ngOnDestroy() {
    this.cleanupSubscriptionsAndClosePopover();
  }

  private closePopover() {
    this.scrollDisablerService.enableBodyScroll(this.popoverProps.popoverId);
    this.isOpenSig.set(false);
  }

  private openPopover() {
    this.trackAnchorElement();
    this.scrollDisablerService.disableBodyScroll(this.popoverProps.popoverId);
  }

  // --- Helper Methods ---

  private setupEventListeners() {
    const popoverElement = this.popoverSectionsContainer.nativeElement;
    const anchorElement = this.getAnchorElement();

    if (!anchorElement) {
      return;
    }

    this.subscribeToAnchorClick(anchorElement);
    this.subscribeToOutsideClick(popoverElement, anchorElement);
  }

  private cleanupSubscriptionsAndClosePopover() {
    this.closePopover();
    this.untrackAnchorElement();
  }

  // --- Element Tracking ---

  private trackAnchorElement() {
    const anchorElementId = this.popoverProps.anchoringConfig.anchorElementId;
    const anchorElementRef =
      this.elementPositionService.getElementRefById(anchorElementId);

    if (!anchorElementRef) {
      return;
    }

    this.subscribeToAnchorPositionChanges(anchorElementId, anchorElementRef);
  }

  private untrackAnchorElement() {
    this.elementPositionService.untrackElementPosition(
      this.popoverProps.anchoringConfig.anchorElementId,
    );
  }

  // --- Event Subscription Logic ---

  private subscribeToAnchorClick(anchorElement: HTMLElement) {
    fromEvent(anchorElement, 'click')
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        tap(() => {
          this.isOpenSig.set(!this.isOpenSig());
          this.isOpenSig() ? this.openPopover() : this.closePopover();
        }),
      )
      .subscribe();
  }

  private subscribeToOutsideClick(
    popoverElement: HTMLElement,
    anchorElement: HTMLElement,
  ) {
    fromEvent(this.document, 'click')
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        tap((e) => {
          if (
            this.isOpenSig() &&
            e.target !== popoverElement &&
            e.target !== anchorElement
          ) {
            this.closePopover();
          }
        }),
      )
      .subscribe();
  }

  private subscribeToAnchorPositionChanges(
    anchorElementId: string,
    anchorElementRef: ElementRef,
  ) {
    const popover = this.popoverSectionsContainer
      .nativeElement as HTMLDivElement;
    const popoverWidth = popover.offsetWidth;
    const popoverHeight = popover.offsetHeight;

    this.elementPositionService
      .trackElementPosition$(anchorElementId, anchorElementRef)
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        tap((domrect) => {
          const popoverPositioning = this.popoverProps.anchoringConfig.position;
          this.updatePopoverPosition(
            popoverPositioning,
            domrect,
            popoverWidth,
            popoverHeight,
          );
        }),
      )
      .subscribe();
  }

  // --- Utility Methods ---

  private getAnchorElement(): HTMLElement | undefined {
    return this.elementPositionService.getElementRefById(
      this.popoverProps.anchoringConfig.anchorElementId,
    )?.nativeElement as HTMLElement;
  }

  private updatePopoverPosition(
    popoverPositioning: string,
    domrect: DOMRect,
    popoverWidth: number,
    popoverHeight: number,
  ): void {
    if (popoverPositioning !== 'bottom-end') {
      console.log(
        `Popover position of ${popoverPositioning} is not handled yet!`,
      );
      return;
    }

    const popover = this.popoverSectionsContainer
      .nativeElement as HTMLDivElement;
    popover.style.left = domrect.left - popoverWidth + domrect.width + 'px';
    popover.style.top = domrect.top + domrect.height + 8 + 'px';
  }

  getItemText(
    text:
      | undefined
      | string
      | Signal<string | null | undefined>
      | (() => string),
  ): string | null | undefined {
    return !text ? undefined : typeof text === 'string' ? text : text();
  }

  // Checks if a popover item should be visible based on its 'isVisibleIf' condition
  itemIsVisible(item: MenuItem): boolean {
    return !item.isVisibleIf || item.isVisibleIf() ? true : false;
  }

  // Determines the active class for a popover item based on its 'isActive' condition
  isActiveClass(isActiveCallback: (() => boolean) | undefined): string {
    return !isActiveCallback || isActiveCallback() ? 'active' : '';
  }
}
