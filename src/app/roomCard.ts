import { Component, inject, input } from "@angular/core";
import { Router } from "@angular/router";

@Component({

    template:`
    
    <div class="p-4 m-4 bg-white rounded-2xl flex flex-col items-center"> room title : {{title()}}


    <button (click)="goToRoom()" class="m-4 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 active:bg-red-800 focus:outline-none focus:ring-2 focus:ring-red-400 cursor-pointer transition w-fit">Join room!</button>
    </div>`
    ,
    selector:"RoomCard"
})
export class RoomCard{

title = input("room Title")
roomID = input("roomID")
router = inject(Router)

goToRoom(){
this.router.navigate([`/room/${this.roomID()}`])


}

}