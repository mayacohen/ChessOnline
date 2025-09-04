import { Component, Output, EventEmitter, OnInit, ViewChild, ElementRef } from '@angular/core';
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
  @ViewChild("modal") modalElement!: ElementRef;
  @ViewChild("closeButton") closeButton!: ElementRef;
  loginForm!: FormGroup;
  @Output() closeModalEmitter = new EventEmitter<void>(); 
  constructor(private client:Client, private fb:FormBuilder){}
  ngOnInit(): void {
     this.loginForm = this.fb.group({
      userName: ['', [Validators.required]],
      password: ['', [Validators.required]]
    });
  }
  closeModal(event : Event)
  {
    if (event.target === this.modalElement.nativeElement || 
      event.target === this.closeButton.nativeElement)
      this.closeModalEmitter.emit();
  }
  onSubmit()
  {
    if (this.loginForm.valid)
    {
      const loginSubmission : LoginModel =
      {
        userName: this.loginForm.value.userName,
        password: this.loginForm.value.password,
      }
      this.client.login(loginSubmission).subscribe({
        next: token => {
          this.client.setLoggedInStatus(true),
          this.client.setUserName(loginSubmission.userName);
          sessionStorage.setItem("accessToken", token);
          this.closeModalEmitter.emit();
        },
        error: err => console.log(err)
      });
    }
  }
}
