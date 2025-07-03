import { Injectable } from "@angular/core";
import { io } from "socket.io-client";


@Injectable({
    providedIn:"root"
})
export class SocketController{

    socket = io("http://localhost:3000")
    constructor(){
        console.log("we are connecting ...");
        
        console.log(this.socket);

        this.socket.on("lv",(e)=>{

            this.leaveRoom();

        });

    }

    leaveRoom(){
        this.socket.off("nou");
        this.socket.off("offer");
        this.socket.off("ans");
        this.socket.off("can");
        this.socket.off("message");

    }


}