import { Component, Input } from '@angular/core';
import { ActiveUserModel } from '../../models/active-user-model';

@Component({
  selector: 'app-request-confirmation',
  imports: [],
  templateUrl: './request-confirmation.html',
  styleUrl: './request-confirmation.scss'
})
export class RequestConfirmation {
  @Input() requestUser: ActiveUserModel =  {username: 'Guest', userImg: 'example.png', score: null, id: ''}; 
}
