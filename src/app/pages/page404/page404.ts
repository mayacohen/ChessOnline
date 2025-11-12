import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-page404',
  imports: [],
  templateUrl: './page404.html',
  styleUrl: './page404.scss'
})
export class Page404 {
  constructor(private router:Router){}
  getBack()
  {
    this.router.navigate(['']);
  }
}
