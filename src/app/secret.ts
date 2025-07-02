import { Component, inject } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";

@Component({


    template:`
    
    <p (click)="notify()">This is where you get the secrets of the world</p>`
    ,selector:"secret"
})
export class Secret{
    route = inject(ActivatedRoute)
    router = new Router()

    notify(){
        console.log("ding ding");
        this.router.navigate(["/"])
        
        
    }
    constructor(){
        console.log("giving you my secrets"); 
        
        console.log(this.route.snapshot.paramMap.get("something"));
        
    }

}