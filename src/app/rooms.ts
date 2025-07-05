import { Component, inject, OnDestroy, OnInit, signal } from "@angular/core";
import { RoomCard } from "./roomCard";
import { HttpClient } from "@angular/common/http";
import { CreateRoomWindow } from "./createRoomWindow";
import { NavigationEnd, Router } from "@angular/router";
import { filter } from "rxjs";
import { SocketController } from "./socket";

@Component({

    template:`

    
    
  <div class="bg-red-50 w-screen h-screen"> 

  <h1>Rooms, welcome to Rum rum</h1>

    <CreateRoomWindow [visible]="roomCreationWindowVisible" (close)="roomCreationWindowVisible = false" (create)="createARoom($event)"/>
    <button class=" bg-red-400 p-2 m-4 rounded hover:bg-red-600 active:bg-red-800 text-red-50" (click)="roomCreationWindowVisible = true">Create a room</button>
    <div class=" w-full h-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4" >
        

      @for (room of rooms(); track $index){
        <RoomCard [title]="room.title" [roomID]="room.ID" [ppl]="room.ppl" [locked]="room.locked"/>

    } @empty {

        <div> There are no rooms :/ How about you make one ?</div>
    }
    </div>


  </div>

    `,

    
        imports:[RoomCard,CreateRoomWindow],

    
    
    
})



export class Rooms implements OnInit,OnDestroy{

    socket = inject(SocketController)
    ngOnInit(): void {
        this.router.events.pipe(filter((e)=>e instanceof NavigationEnd)).subscribe(()=>{
            console.log("you came back");
            
            this.fetchRooms();


            // listen to new updates of rooms including how many ppl in rooms
            this.socket.socket.emit("jrms");
            this.socket.socket.on("rms",(d)=>{

                console.log("got new rooms");
                
            this.rooms.set([]);
            
            if(d && Array.isArray(d)){
                
                this.rooms.set((d as []).map((data)=>{return {title:data[0],ID:data[1],ppl:data[2],locked:data[3]}}))
                // this.rooms.set(d);
            }
            })



        })
    }
    

    ngOnDestroy(): void {
        this.socket.socket.off("rms");
    }
    roomCreationWindowVisible=false
    rooms = signal<{title:string, ID:string, ppl:number,locked:boolean}[]>([])
    httpClient = inject(HttpClient)
    router = inject(Router)


    createARoom(data : {
        rt:string,
        rk:number
    }){

    this.httpClient.post<{
        id:string,
        k:string // key
    }>("/nr",data).subscribe((data)=>{
        console.log(data);
        
        this.roomCreationWindowVisible=false;
        if(data.k){
        this.router.navigate([`/room/${data.id}/${data.k}`]);

        }else{
        this.router.navigate([`/room/${data.id}`]);

        }
        
        

    });


    }
    constructor(){


        //fetch data
        this.fetchRooms();
        this.socket.socket.emit("jrms");
        this.socket.socket.on("rms",(d)=>{

                console.log("got new rooms");
                
            this.rooms.set([]);
            
            if(d && Array.isArray(d)){
                
                this.rooms.set((d as []).map((data)=>{return {title:data[0],ID:data[1],ppl:data[2],locked:data[3]}}))
                // this.rooms.set(d);
            }
            })

    }

    fetchRooms(){

                this.httpClient.post<unknown>("/gr",{}).subscribe((d)=>{
            console.log(d);
            this.rooms.set([]);
            
            if(d && Array.isArray(d)){
                
                this.rooms.set((d as []).map((data)=>{return {title:data[0],ID:data[1],ppl:data[2],locked:data[3]}}))
                // this.rooms.set(d);
            }

        })
    }
    


}