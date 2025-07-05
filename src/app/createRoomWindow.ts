import { Component, input, output } from "@angular/core";
import { FormsModule } from "@angular/forms";

@Component({

 selector:"CreateRoomWindow",
 imports:[FormsModule],
 template:`
 
@if (visible()){

    <div class="fixed inset-0 bg-black/50 z-50 flex items-center justify-center ">

<div class="bg-white/85 bg-clip-padding backdrop-filter  backdrop-blur  backdrop-saturate-100 backdrop-contrast-100 rounded p-4">


<p class="font-bold text-2xl text-black text-center">Creating a room</p>


 <div class="flex flex-row justify-center items-center p-2 gap-2">
<p> Room's title</p>
 <input type="text" [(ngModel)]="title" placeholder="Room's title" class="bg-gray-100 rounded ring-1 ring-gray-100 hover:ring-black transition">

 </div>

  <div class="flex flex-row justify-center items-baseline p-2 gap-2">
    <p class="font-bold text-2xl">Locked room? :</p> <input type="checkbox" class="accent-red-400"   [(ngModel)]="locked">
  </div>
  
 <div class="flex justify-center items-center p-2 gap-2">


 <button class="p-2 rounded bg-red-500 hover:bg-red-700 text-white active:bg-red-900  transition" (click)="createARoom()"> Create a room</button>
 <button class="p-2 rounded bg-red-500 text-white hover:bg-red-700 active:bg-red-900 transition" (click)="closeWindow()"> Cancel</button>
 </div>



</div>

</div>
}


 
 `

})
export class CreateRoomWindow {

    visible= input(false);
    locked = false;
    close = output();
    create = output<{
        rt:string,
        rk:number
    }>();
    title = "";
    closeWindow(){


        this.close.emit();
    }

    createARoom(){
        console.log({
            rt:this.title,
            rk: this.locked ? 1 : 0

        });
        console.log(this.locked);
        
        
        this.create.emit({
            rt:this.title,
            rk: this.locked ? 1 : 0

        });
this.title ="";
    }

    constructor() {
        
    }
}