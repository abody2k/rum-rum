import { Component, inject } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { Router } from "@angular/router";

@Component({
    selector:"login",
    imports:[FormsModule],
    template:`
    
    <div>Please enter your username : </div>
    <input type="text" [(ngModel)]="username" placeholder="username">
        <div>Please enter your password : </div>

    <input type="password" [(ngModel)]="password" placeholder="***">
    
<button (click)="logIn()"> Sign in</button>
    


    `
})
export class Login {
    
    username = ""
    password=""
    signedIn = false


    logIn(){
        console.log([this.username,this.password]);

        if (!(this.username && this.password))
            return;

        
        localStorage.setItem("profile",({
            username:this.username,
            password:this.password
        }).toString());
            let x = new Router();
            x.navigate(["/"]);
        

    }
    isLoggedIn() : boolean{
return localStorage.getItem("profile") ? true : false;
    }
    constructor() {
        if(this.isLoggedIn()){
            let x = inject(Router);
            x.navigate(["/room/12"]);
        }
        
    }
}