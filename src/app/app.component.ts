import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NgIf } from '@angular/common';

@Component({
    selector: 'vex-root',
    templateUrl: './app.component.html',
    standalone: true,
    imports: [RouterOutlet, NgIf],
})

export class AppComponent implements OnInit {

    public isAppLoading: boolean = true;

    constructor() {} 

    ngOnInit(): void {

    }
    
}
