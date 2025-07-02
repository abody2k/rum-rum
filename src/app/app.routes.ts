import { Routes } from '@angular/router';
import { Secret } from './secret';
import { Profile } from './profile';
import { NoSecret } from './nosecret';

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
    }



];
