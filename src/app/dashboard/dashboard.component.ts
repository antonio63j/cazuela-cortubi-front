import { Component, OnInit } from '@angular/core';
import { routerTransition } from '../router.animations';

@Component({
    selector: 'app-dashboard',
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.scss'],
    animations: [routerTransition()]
})
export class DashboardComponent implements OnInit {
    public alerts: Array<any> = [];
    public sliders: Array<any> = [];
    public utilidades: Array<any> = [];

    constructor() {
        this.sliders.push(
            {
                imagePath: 'assets/images/sliders/slider1.jpg',
                label: '',
                text: 'tecv ad añslk adsñlk     adsfasñlkj '
            },
            {
                imagePath: 'assets/images/sliders/slider2.jpg',
                label: '',
                text: 'Este plato es una maravilla, lo recomiendo '
            },
            {
                imagePath: 'assets/images/sliders/slider3.jpg',
                label: '',
                text: 'Este plato es una maravilla, lo recomiendo un montón',
            }
        );

        this.utilidades.push(
            {
                imagePath: 'assets/images/utilidades/angular.png',
                label: 'Angular 9',
                text: ''
            },
            {
                imagePath: 'assets/images/utilidades/angular-material.jpg',
                label: 'Angular material',
                text: ''
            },
            {
                imagePath: 'assets/images/utilidades/bootstrap.jpg',
                label: 'Bootstrap',
                text: ''
            },
            {
                imagePath: 'assets/images/utilidades/vs-code.jpg',
                label: 'Visual Studio Code',
                text: ''
            },
            {
                imagePath: 'assets/images/utilidades/git.png',
                label: 'Git',
                text: ''
            },
            {
                imagePath: 'assets/images/utilidades/eclipse.png',
                label: 'Eclipse',
                text: ''
            },
            {
                imagePath: 'assets/images/utilidades/java.jpg',
                label: 'Java 8',
                text: ''
            },
            {
                imagePath: 'assets/images/utilidades/maven.png',
                label: 'Maven',
                text: ''
            },
            {
                imagePath: 'assets/images/utilidades/postgresql.jpg',
                label: 'PostgreSQL',
                text: ''
            },
            {
                imagePath: 'assets/images/utilidades/spring-boot.jpg',
                label: 'Spring boot',
                text: ''
            },
            {
                imagePath: 'assets/images/utilidades/spring-data.jpg',
                label: 'Spring data',
                text: ''
            },
            {
                imagePath: 'assets/images/utilidades/spring-oauth2.png',
                label: 'Spring oauth2',
                text: ''
            },
            {
                imagePath: 'assets/images/utilidades/spring-security.jpg',
                label: 'Angular security',
                text: ''
            },
            {
                imagePath: 'assets/images/utilidades/jwt.png',
                label: 'Angular security',
                text: ''
            }

        );
    }

    ngOnInit() {

    }

    public closeAlert(alert: any) {
        const index: number = this.alerts.indexOf(alert);
        this.alerts.splice(index, 1);
    }
}
