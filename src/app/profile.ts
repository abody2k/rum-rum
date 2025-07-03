import { Component, signal } from "@angular/core";
    
    

@Component ({

    selector:"profile",
    template:`
    <h1>This is def a user profile</h1>
    <p> I have something to say that is {{code()}}</p>
    <button (click)="increaseBase()"> increase base  </button>
    <div>Current base system is {{base()}}</div>
    <p (mouseover)="speedUp()">Increase speed by hovering</p>
    <p (mouseover)="speedDown()">Decrease speed by hovering</p>

    @if(speed < 1 ){
    <h2>This is an enormous speed</h2>
    } @else{
     
    <h2>This is really slow</h2>
    }
    `,
    styles:`
    h1 {font-size:2em; color:blue} `


})
export class Profile{
base = signal(2)
code = signal((Math.random()*100000).toString(this.base()));
speed =1 ;
interval=0;
increaseBase(){

    this.base.update(value=>value + 1);

}
speedUp(){
    console.log("nothing");
    clearInterval(this.interval);
    this.speed*=.5;
    this.interval =setInterval(() => {
        this.code.set((Math.random()*100000).toString(this.base()));
    }, 1000*this.speed);
    console.log(this.speed);
    
    
}
speedDown(){
        clearInterval(this.interval);
    this.speed/=.5;
    this.interval =setInterval(() => {
        this.code.set((Math.random()*100000).toString(this.base()));
    }, 1000*this.speed);
    console.log(this.speed);
    
}
constructor (){

   this.interval = setInterval(() => {
         this.code.set((Math.random()*100000).toString(this.base()));
    }, 1000);
}

}