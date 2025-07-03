import { HttpClient } from "@angular/common/http";
import { AfterViewInit, Component, effect, ElementRef, inject, OnDestroy, signal, ViewChild } from "@angular/core";
import { of, single } from "rxjs";
import { SocketController } from "./socket";
import { ActivatedRoute } from "@angular/router";
import { FormsModule } from "@angular/forms";

@Component({

    imports:[FormsModule],
template:`
    <div class="bg-red-50 w-screen h-screen">


@if (status === 0) {
<h5 class="flex items-center justify-center h-screen w-screen">You are joining the room {{dots}}</h5>

}@else { 


    <div> No. of ppl in the room : {{numberOfPplInTheRoom()}}</div>
    <button></button>





}


    @if (!streaming){
<div>There is no stream</div>
    }
        <video #remoteVideo autoplay class=" w-screen h-screen"> </video>
   
   
   <input type="text" (keydown)="send($event)" [(ngModel)]="message" class="w-screen h-4">
    <div class="flex flex-col justify-center items-center scroll-auto">

    @for(message of messages; track $index){
        <div class="p-4 m-4 bg-amber-200 font-bold "> {{message}}</div>

    }
    </div>


    </div>
    
    

    `
})

export class Room implements OnDestroy,AfterViewInit{

    @ViewChild("remoteVideo") remotevid!: ElementRef<HTMLVideoElement>


    points = 0
    interval= 0
    dots=""
    status = 0
    microphoneOpened = false
    numberOfPplInTheRoom = signal(0);
    src = signal({})
    streaming = false

    httpClient = inject(HttpClient)
    socket = inject(SocketController)
    route = inject(ActivatedRoute)
    readonly ICE_SERVERS = [{ urls: 'stun:stun.l.google.com:19302' }];
    peerConnection = new RTCPeerConnection({iceServers:this.ICE_SERVERS});
    roomID = "";
    localStream = new MediaStream();
    remoteStream = new MediaStream();
    dataChannel = this.peerConnection.createDataChannel("messages");
    message=""
    messages: string[]=[]
    send(event : KeyboardEvent){

        if(event.key != "Enter")
        return;
        
        console.log("Sent a message");
        
        this.dataChannel.send(this.message)
        
        this.messages.push(this.message)
        this.message=""
    }
    constructor() {


        
    }



        ngAfterViewInit(): void {

        


                navigator.mediaDevices.getUserMedia({
            video:true,
            audio:true
        }).then((e)=>{

            this.localStream = e;

            this.dataChannel.onopen=(e)=>{




            }


            this.dataChannel.onmessage=(e)=>{

                console.log("got a message");
                console.log(e);
                
                console.log(e.data);
                


            }
        
            e.getTracks().forEach((track)=>{


                this.peerConnection.addTrack(track,this.localStream);
                console.log(track);
                
            })

            this.peerConnection.ondatachannel= (e)=>{


                let dataChannel = e.channel
            }
            this.peerConnection.ontrack=(e)=>{

                console.log("got this track just right now");
                
                console.log(e.streams);
                 e.streams[0].getTracks().forEach((track)=>{
                    this.remoteStream.addTrack(track);

                })
// 
                this.remotevid.nativeElement.srcObject= this.remoteStream
                console.log(this.remotevid);
                this.streaming= true;
                
                
                
                
            }


        this.peerConnection.onicecandidate=(e)=>{
            if (e.candidate){

                this.socket.socket.emit("can",this.roomID+"،"+JSON.stringify(e.candidate));
            }
        }
        this.interval= setInterval(() => {
            this.points++
            this.points %= 3;
            this.dots="";
            for (let i = 0; i <=this.points; i++) {
                this.dots+=".";
                
            }

        }, 500);
        this.roomID = this.route.snapshot.paramMap.get("roomID") as string;

        this.socket.socket.on("nou",async(data)=>{

            if(this.numberOfPplInTheRoom()==1){

                const offer = await( this.peerConnection).createOffer();
                await this.peerConnection.setLocalDescription(offer);
                console.log(this.route.snapshot.paramMap.get("roomID")+"،"+JSON.stringify(offer));
                
                this.socket.socket.emit("offer",this.route.snapshot.paramMap.get("roomID")+"،"+JSON.stringify(offer));
                
            }
            this.numberOfPplInTheRoom.set ( (data as number) + 1);
            this.status = 1;
            console.log(this.numberOfPplInTheRoom);
            

            
        })

        this.socket.socket.on("offer",async(data)=>{
            console.log("new offer");
            
            const offer = JSON.parse(data);
            await this.peerConnection.setRemoteDescription(new RTCSessionDescription(offer));
            const answer = await this.peerConnection.createAnswer();
            await this.peerConnection.setLocalDescription(answer);
            this.socket.socket.emit("ans",this.roomID+"،"+JSON.stringify(answer))
            
        })

        this.socket.socket.on("ans",async(data)=>{

            const answer = JSON.parse(data);
            await this.peerConnection.setRemoteDescription(new RTCSessionDescription(answer));


        })
        this.socket.socket.on("can",async(data)=>{

            const candidate = JSON.parse(data);
            try {
               await this.peerConnection.addIceCandidate(new RTCIceCandidate(candidate));
               console.log(candidate);
               
               console.log("done done and finished");
               
            } catch (error) {
                console.log(error);
                
            }

        })
        
        this.socket.socket.on("message",(value)=>{

            console.log("new msg");
            console.log(value);
            
            
        })

        this.socket.socket.emit("jr",this.route.snapshot.paramMap.get("roomID"));


        // this.httpClient.post("/jr",{})

        });

    }

    

    ngOnDestroy(): void {
        this.socket.socket.emitWithAck("lv").then(()=>{

        this.socket.leaveRoom();
        });
        
    }
}

