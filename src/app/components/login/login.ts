import { Component, Output, EventEmitter, OnInit } from '@angular/core';
import { FormGroup,FormBuilder,ReactiveFormsModule,Validators } from '@angular/forms';
import { Client } from '../../services/client';
import { LoginModel } from '../../models/login-model';
@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule],
  templateUrl: './login.html',
  styleUrl: './login.scss'
})
export class Login implements OnInit{
  loginForm!: FormGroup;
  @Output() closeModalEmitter = new EventEmitter<void>(); 
  constructor(private client:Client, private fb:FormBuilder){}
  ngOnInit(): void {
     this.loginForm = this.fb.group({
      userName: ['', [Validators.required]],
      password: ['', [Validators.required]]
    });
  }
  closeModal()
  {
    this.closeModalEmitter.emit();
  }
  unexpectedEventsHandler(event:Event)
  {
    event.stopPropagation();
    event.preventDefault();
  }
  onSubmit()
  {
    if (this.loginForm.valid)
    {
      const signupSubmission : LoginModel =
      {
        userName: this.loginForm.value.userName,
        password: this.loginForm.value.password,
      }
      console.log(signupSubmission);
      this.closeModal();
    }
  }
}
