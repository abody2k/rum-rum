import { Component, inject, input } from "@angular/core";
import { Router } from "@angular/router";

@Component({

    template:`
    
    <div class="p-4 m-4 bg-white rounded-2xl flex flex-col items-center"> room title : {{title()}}

    <p> {{ppl()}}/2</p>
    @if (ppl() <2){

        @if (locked()) {
            <div class="font-bold text-sm">You need to be invited in order to join this room :/</div>
        }@else {
                    <button (click)="goToRoom()" class="m-4 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 active:bg-red-800 focus:outline-none focus:ring-2 focus:ring-red-400 cursor-pointer transition w-fit">Join room!</button>

        }
    }@else{
        Sorry, this room is full!
    }
    
    </div>`
    ,
    selector:"RoomCard"
})
export class RoomCard{

title = input("room Title")
roomID = input("roomID")
ppl = input(0)
router = inject(Router)
locked= input(false)

goToRoom(){
this.router.navigate([`/room/${this.roomID()}`])


}

}