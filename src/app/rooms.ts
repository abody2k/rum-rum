import { Component, inject, signal } from "@angular/core";
import { RoomCard } from "./roomCard";
import { HttpClient } from "@angular/common/http";

@Component({

    template:`

    
    
  <div class="bg-red-50 w-screen h-screen"> 

  <h1>Rooms, welcome to Rum rum</h1>


    <div class=" w-full h-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4" >
        

      @for (room of rooms(); track $index){
        <RoomCard [title]="room.title" [roomID]="room.ID"/>

    } @empty {

        <div> There are no rooms :/ How about you make one ?</div>
    }
    </div>


  </div>

    `,

    
        imports:[RoomCard],

    
    
    
})



export class Rooms{


    rooms = signal<{title:string, ID:string}[]>([])
    httpClient = inject(HttpClient)
    constructor(){


        //fetch data
        this.httpClient.post<unknown>("http://localhost:3000/gr",{}).subscribe((d)=>{

            if(d){
                console.log(d);
                this.rooms.set((d as []).map((data)=>{return {title:data[0],ID:data[1]}}))
                // this.rooms.set(d);
            }

        })
    }


    


}