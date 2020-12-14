import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { AuthService } from '../../usuarios/auth.service';

import { HttpParams } from '@angular/common/http';
import { Subscription, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

    public pushRightClass: string;

    // public dropdownList = [];
    // public selectedItems = [];
    // public dropdownSettings: IDropdownSettings = {};

    private observ$: Subscription = null;
    private unsubscribe$ = new Subject();
    // public dropdownSettings: any = {};

    constructor(
        private translate: TranslateService,
        public router: Router,
        public authService: AuthService,
    ) {
        this.router.events.subscribe((val) => {
            // console.log('en gestion router.events');
            // console.log(val);
            // console.log(window.innerWidth);
            // console.log(this.isToggled());

            if (val instanceof NavigationEnd && window.innerWidth <= 992 && this.isToggled()) {
                console.log('se invoca toggleSidebar()');
                this.toggleSidebar();
            }
        });
    }

    ngOnInit() {
        this.pushRightClass = 'push-right';
    }

    onItemSelect(item: any) {
        console.log(item);
    }
    onSelectAll(items: any) {
        console.log(items);
    }


    isToggled(): boolean {
        const dom: Element = document.querySelector('body');
        return dom.classList.contains(this.pushRightClass);
    }

    toggleSidebar() {
        
        const dom: any = document.querySelector('body');
        dom.classList.toggle(this.pushRightClass);
    }

    rltAndLtr() {
        const dom: any = document.querySelector('body');
        dom.classList.toggle('rtl');
    }

    onLoggedout() {
        // localStorage.removeItem('isLoggedin');
        this.authService.logout();
        this.router.navigate(['\dashboard']);
    }

    changeLang(language: string) {
        this.translate.use(language);
    }

}