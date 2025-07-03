import { Routes } from '@angular/router';
import { Secret } from './secret';
import { Profile } from './profile';
import { NoSecret } from './nosecret';
import { Login } from './login';
import { Room } from './room';
import { Rooms } from './rooms';

export const routes: Routes = [
    {path:"",
        component:Profile
    },
    {
        path:"secret",
        component:NoSecret
    },

    {path:"secret/:something",
        component:Secret
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
    }



];
