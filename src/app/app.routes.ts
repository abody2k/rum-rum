import { Routes } from '@angular/router';
import { Login } from './login';
import { Room } from './room';
import { Rooms } from './rooms';
import { NotReal } from './404';

export const routes: Routes = [

    {path:"",
        redirectTo:"rooms",
        pathMatch:"full"
    },

    {
        path:"login",
        component:Login
    },
    {

        path:"room/:roomID",
        component:Room
    },
    {

        path:"room/:roomID/:key",
        component:Room
    },

    {path:"rooms",
        component:Rooms
    },

    {
        path:"r404",
        component:NotReal
    }



];
