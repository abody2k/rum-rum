import { HttpClient } from "@angular/common/http";
import { AfterViewInit, Component, effect, ElementRef, inject, OnDestroy, signal, ViewChild } from "@angular/core";
import { of, single } from "rxjs";
import { SocketController } from "./socket";
import { ActivatedRoute, Router } from "@angular/router";
import { FormsModule } from "@angular/forms";

@Component({

    imports:[FormsModule],
template:`
    <div class="bg-red-50 w-screen h-screen">


    <button class="fixed  bg-red-400 p-2 right-0 m-1 rounded hover:bg-red-600 active:bg-red-800 text-red-50" (click)="goHome()">Go back home</button>
@if (status === 0) {
<h5 class="flex items-center justify-center h-screen w-screen">You are joining the room {{dots}}</h5>

}@else { 


    <div > No. of ppl in the room : {{numberOfPplInTheRoom()}}</div>
    <button></button>





}


    @if (!streaming){
<div>There is no stream</div>
    }
       <div class="flex flex-row w-screen max-h-96">

 <video #remoteVideo autoplay class=" w-2/3 h-auto rounded transition"> </video>
 
<div class="flex flex-col w-1/3">
    <div class="flex flex-col  h-80 overflow-scroll bg-white justify-end items-start">

    @for(message of messages(); track $index){

        @if (message.fromMe){
        <div class="p-4 m-4 bg-amber-200 font-bold rounded "> {{message.msg}}</div>

        }@else {
        <div class="p-4 m-4 bg-red-200 font-bold rounded ml-auto"> {{message.msg}}</div>

        }
    }
    </div>
       <input  type="text" (keydown)="send($event)" [(ngModel)]="message" class="w-auto bg-white rounded h-20 ring-1 ring-red-300">

</div>

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
    myIndex=0

    httpClient = inject(HttpClient);
    socket = inject(SocketController);
    route = inject(ActivatedRoute);
    router = inject(Router);
    readonly ICE_SERVERS = [{ urls: 'stun:stun.l.google.com:19302' }];
    peerConnection = new RTCPeerConnection({iceServers:this.ICE_SERVERS});
    roomID = "";
    roomKey="";
    localStream = new MediaStream();
    remoteStream = new MediaStream();
    dataChannel! : RTCDataChannel
    message=""
    messages = signal<{msg:string , fromMe:boolean}[]>([] as Array<{msg:string , fromMe:boolean}>)


    goHome(){

        this.router.navigate(['/rooms'])
    }
    send(event : KeyboardEvent){

        if(event.key != "Enter")
        return;
        
        console.log("Sent a message");
        
        this.dataChannel.send(this.message)
        
        this.messages().push({msg:this.message,fromMe:true})
        this.message=""
    }




        ngAfterViewInit(): void {

        


                navigator.mediaDevices.getUserMedia({
            video:true,
            audio:true
        }).then((e)=>{

            this.localStream = e;

        
            e.getTracks().forEach((track)=>{


                this.peerConnection.addTrack(track,this.localStream);
                
            })

            this.peerConnection.ondatachannel= (e)=>{


                let dataChannel = e.channel
            }
            this.peerConnection.ontrack=(e)=>{

   
                 e.streams[0].getTracks().forEach((track)=>{
                    this.remoteStream.addTrack(track);

                })
// 
                this.remotevid.nativeElement.srcObject= this.remoteStream
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
        this.roomKey = this.route.snapshot.paramMap.get("key") as string || "";
        this.socket.socket.on("nou",async(data)=>{
        this.numberOfPplInTheRoom.set ( (data as number) );

            if(this.myIndex==2){ // I'm the one who intiates the call
                this.dataChannel = this.peerConnection.createDataChannel("messages");
                this.dataChannel.onmessage=(e)=>{

                    console.log("got a new message and I'm the caller");
                    console.log(e);
                    this.messages().push({
                    msg:e.data,fromMe:false
                });
                    
                    
                }

                const offer = await( this.peerConnection).createOffer();
                await this.peerConnection.setLocalDescription(offer);
                
                this.socket.socket.emit("offer",this.route.snapshot.paramMap.get("roomID")+"،"+JSON.stringify(offer));
                
            }else{

                this.peerConnection.ondatachannel = (e)=>{
                    this.dataChannel = e.channel
                    

            this.dataChannel.onmessage=(ee)=>{

                console.log("got a message and I'm the callee");
                console.log(ee);
                
                console.log(ee.data);
                console.log("bal?");
                

                this.messages().push({
                    msg:ee.data,fromMe:false
                });
                
                


            }


                }
            }
            
            this.status = 1;

            

            
        })

        this.socket.socket.on("offer",async(data)=>{
            
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

               
            } catch (error) {
               
                
            }

        })


        this.socket.socket.on("lft",(data)=>{


            this.numberOfPplInTheRoom.update((value)=>value-1);
            this.myIndex=0;
            this.remoteStream = new MediaStream();
            // this.peerConnection.close()
            this.peerConnection = new RTCPeerConnection({iceServers:this.ICE_SERVERS});
            this.peerConnection.ondatachannel= (e)=>{

                this.dataChannel = e.channel;

                this.dataChannel.onmessage =(d)=>{

                    console.log("got a new message and I'm the callee");
                    console.log(d);
                    this.messages().push({
                    msg:d.data,fromMe:false
                });
                    
                    
                }
            }
            this.peerConnection.onicecandidate=(e)=>{
            if (e.candidate){

                this.socket.socket.emit("can",this.roomID+"،"+JSON.stringify(e.candidate));
            }
        }
                 e.getTracks().forEach((track)=>{


                this.peerConnection.addTrack(track,this.localStream);
                
            })
            
                        this.peerConnection.ontrack=(e)=>{

   
                 e.streams[0].getTracks().forEach((track)=>{
                    this.remoteStream.addTrack(track);

                })
// 
                this.remotevid.nativeElement.srcObject= this.remoteStream
                this.streaming= true;
                
                
                
                
            }
            
        })
        
        this.socket.socket.on("message",(value)=>{

            
            
        })

        this.socket.socket.emitWithAck("jr",this.roomID+(this.roomKey ? (","+this.roomKey): "")).then((e)=>{
   
            
            if (e== "lv"){ // the room you tried to enter does not exist
                this.router.navigate(['/r404']);

            }else{
                this.myIndex = Number(e);
            }
            
        })


        // this.httpClient.post("/jr",{})

        });

    }

    

    ngOnDestroy(): void {
        this.socket.socket.emitWithAck("lv").then(()=>{

        this.socket.leaveRoom();
        });
        
    }
}

