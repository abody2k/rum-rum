import { Component, inject, signal } from "@angular/core";
import { RoomCard } from "./roomCard";
import { HttpClient } from "@angular/common/http";
import { CreateRoomWindow } from "./createRoomWindow";
import { Router } from "@angular/router";

@Component({

    template:`

    
    
  <div class="bg-red-50 w-screen h-screen"> 

  <h1>Rooms, welcome to Rum rum</h1>

    <CreateRoomWindow [visible]="roomCreationWindowVisible" (close)="roomCreationWindowVisible = false" (create)="createARoom($event)"/>
    <button class=" bg-red-400 p-2 m-4 rounded hover:bg-red-600 active:bg-red-800 text-red-50" (click)="roomCreationWindowVisible = true">Create a room</button>
    <div class=" w-full h-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4" >
        

      @for (room of rooms(); track $index){
        <RoomCard [title]="room.title" [roomID]="room.ID" [ppl]="room.ppl"/>

    } @empty {

        <div> There are no rooms :/ How about you make one ?</div>
    }
    </div>


  </div>

    `,

    
        imports:[RoomCard,CreateRoomWindow],

    
    
    
})



export class Rooms{

    roomCreationWindowVisible=false
    rooms = signal<{title:string, ID:string, ppl:number}[]>([])
    httpClient = inject(HttpClient)
    router = inject(Router)


    createARoom(data : {
        rt:string,
        rk:number
    }){

    this.httpClient.post<{
        id:string
    }>("http://localhost:3000/nr",data).subscribe((data)=>{
        this.roomCreationWindowVisible=false;
        this.router.navigate([`/room/${data.id}`]);
        
        

    });


    }
    constructor(){


        //fetch data
        this.httpClient.post<unknown>("http://localhost:3000/gr",{}).subscribe((d)=>{
            console.log(d);
            
            if(d && Array.isArray(d)){
                
                this.rooms.set((d as []).map((data)=>{return {title:data[0],ID:data[1],ppl:data[2]}}))
                // this.rooms.set(d);
            }

        })
    }


    


}