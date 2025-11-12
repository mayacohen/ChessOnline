import { Routes } from '@angular/router';
import { Main } from './pages/main/main';
import { Page404 } from './pages/page404/page404';

export const routes: Routes = [
    {path:'', component:Main},
    {path:'**', component:Page404}
];
