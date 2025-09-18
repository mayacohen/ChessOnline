import { Component, Output, EventEmitter, OnInit, ViewChild, 
  ElementRef, ChangeDetectorRef } from '@angular/core';
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
  isGeneralError = false;
  loginForm!: FormGroup;
  @Output() closeModalEmitter = new EventEmitter<void>(); 
  constructor(private client:Client, private fb:FormBuilder,
    private cdr: ChangeDetectorRef){}
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
        next: loggedDTO => {
          this.client.setLoggedInStatus(true),
          this.client.setUserName(loginSubmission.userName);
          this.client.setUserPic(loggedDTO.userPic);
          sessionStorage.setItem("accessToken", loggedDTO.token);
          this.closeModalEmitter.emit();
        },
        error: err => 
          {
            this.isGeneralError = true;
            this.cdr.detectChanges();
          }
      });
    }
  }
}
