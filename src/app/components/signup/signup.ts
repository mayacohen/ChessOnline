import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormGroup,FormsModule, FormBuilder,Validators,
   ReactiveFormsModule, AbstractControl } from '@angular/forms';
import { Client } from '../../services/client';
import { SignUpModel } from '../../models/sign-up-model';
import * as bcrypt from 'bcryptjs';

@Component({
  selector: 'app-signup',
  imports: [FormsModule, ReactiveFormsModule],
  templateUrl: './signup.html',
  styleUrl: './signup.scss'
})
export class Signup implements OnInit{
  signupForm!: FormGroup;
  @Output() closeModalEmitter = new EventEmitter<void>(); 
  constructor(private client:Client, private fb:FormBuilder){}
  ngOnInit(): void {
     this.signupForm = this.fb.group({
      userName: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, this.passwordStrengthValidator]],
      confirmPassword: ['', [Validators.required]]
    }, { validators: this.confirmPasswordValidator });
  }
  passwordStrengthValidator(control: AbstractControl) 
  {
    const password = control.value;
    const regex = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>])[A-Za-z\d!@#$%^&*(),.?":{}|<>]{8,}$/;
    
    if (password && !regex.test(password)) {
      return { passwordStrength: true };
    }
    return null;
  }

  confirmPasswordValidator(control: AbstractControl) 
  {
    const password = control.value.password;
    const confirmPassword = control.value.confirmPassword;
    //const password = formGroup.get('password')?.value;
    //const confirmPassword = formGroup.get('confirmPassword')?.value;

    if (password && confirmPassword && password !== confirmPassword) {
      return { passwordMismatch: true };
    }
    return null;
  }
  onSubmit()
  {
    if (this.signupForm.valid)
    {
      const salt = bcrypt.genSaltSync(10);
      const now = new Date();
      const hours = String(now.getHours()).padStart(2, "0");
      const minutes = String(now.getMinutes()).padStart(2, "0");
      const day = String(now.getDate()).padStart(2, "0");
      const month = String(now.getMonth() + 1).padStart(2, "0");
      const year = now.getFullYear();
      const formatted = `${hours}:${minutes} ${day}:${month}:${year}`;
      const signupSubmission : SignUpModel =
      {
        userName: this.signupForm.value.userName,
        email: this.signupForm.value.email,
        password: bcrypt.hashSync(this.signupForm.value.password, salt),
        confirmPassword: bcrypt.hashSync(this.signupForm.value.confirmPassword, salt),
        signedupDate: formatted
      }
      console.log(signupSubmission);
      this.closeModal();
    }
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
}
