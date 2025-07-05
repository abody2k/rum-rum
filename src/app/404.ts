import { Component, inject } from "@angular/core";
import { Router } from "@angular/router";

@Component({


    selector:"NotReal",
    template:`
    
    <div class="text-4xl font-bold"> The place you tried to reach does not exist or you are unauthorized to reach it</div>
    <button (click)="goHome()" class="m-4 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 active:bg-red-800 focus:outline-none focus:ring-2 focus:ring-red-400 cursor-pointer transition w-fit">Go back home</button>
    
    `
})
export class NotReal {

    router = inject(Router);
    goHome(){

        this.router.navigate(['/rooms'])

    }
    
}