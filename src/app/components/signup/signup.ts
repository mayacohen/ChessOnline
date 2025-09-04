import { Component, OnInit, Output, EventEmitter, ViewChild, ElementRef } from '@angular/core';
import { FormGroup,FormsModule, FormBuilder,Validators,
   ReactiveFormsModule, AbstractControl } from '@angular/forms';
import { Client } from '../../services/client';
import { SignUpModel } from '../../models/sign-up-model';

@Component({
  selector: 'app-signup',
  imports: [FormsModule, ReactiveFormsModule],
  templateUrl: './signup.html',
  styleUrl: './signup.scss'
})
export class Signup implements OnInit{
  @ViewChild("modal") modalElement!: ElementRef;
  @ViewChild("closeButton") closeButton!: ElementRef;
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
        password: this.signupForm.value.password,
        confirmPassword: this.signupForm.value.confirmPassword,
        signedupDate: formatted
      }
      this.client.register(signupSubmission).subscribe({
        next: () => console.log('works'),
        error: err => console.log(err)
      });
      this.closeModalEmitter.emit();
    }
  }
  closeModal(event : Event)
  {
    if (event.target === this.modalElement.nativeElement || 
      event.target === this.closeButton.nativeElement)
      this.closeModalEmitter.emit();
  }
}
