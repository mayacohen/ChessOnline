import { Component, OnInit, Output, EventEmitter, ViewChild, ElementRef,
  ChangeDetectorRef
 } from '@angular/core';
import { FormGroup,FormsModule, FormBuilder,Validators,
   ReactiveFormsModule, AbstractControl } from '@angular/forms';
import { Client } from '../../services/client';
import { SignUpModel } from '../../models/sign-up-model';
import { IdentityError } from '../../models/identity-error';
import { IdentityResult } from '../../models/identity-result';
import { GoogleSignup } from '../google-signup/google-signup';
import { FacebookSignup } from '../facebook-signup/facebook-signup';

@Component({
  selector: 'app-signup',
  imports: [FormsModule, ReactiveFormsModule, GoogleSignup, FacebookSignup],
  templateUrl: './signup.html',
  styleUrl: './signup.scss'
})
export class Signup implements OnInit{
  @ViewChild("modal") modalElement!: ElementRef;
  @ViewChild("closeButton") closeButton!: ElementRef;
  signupForm!: FormGroup;
  isEmailTaken = false;
  isUserNameTaken = false;
  isGeneralError = false;
  @Output() closeModalEmitter = new EventEmitter<void>(); 
  constructor(private client:Client, private fb:FormBuilder, 
    private cdr: ChangeDetectorRef){}
  ngOnInit(): void {
     this.signupForm = this.fb.group({
      userName: ['', [Validators.required, Validators.minLength(3),
          this.usernameDoesntStartWithGuestValidator]],
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
  usernameDoesntStartWithGuestValidator(control:AbstractControl)
  {
    const username = control.value;
    if (username && username instanceof String && (username.startsWith("Guest-") || 
    username.startsWith('guest-')))
      return {illegalUsername: true};
    return null;
  }
  confirmPasswordValidator(control: AbstractControl) 
  {
    const password = control.value.password;
    const confirmPassword = control.value.confirmPassword;
    if (password && confirmPassword && password !== confirmPassword) {
      return { passwordMismatch: true };
    }
    return null;
  }
  onSubmit()
  {
    if (this.signupForm.valid)
    {
      const signupSubmission : SignUpModel =
      {
        userName: this.signupForm.value.userName,
        email: this.signupForm.value.email,
        password: this.signupForm.value.password,
        confirmPassword: this.signupForm.value.confirmPassword
      }
      this.client.register(signupSubmission).subscribe({
        next: () => {this.closeModalEmitter.emit();},
        error: err => {
          if (err)
          {
            this.isEmailTaken = false;
            this.isUserNameTaken = false;
            this.isGeneralError = false;
            const messages = this.getIdentityErrors(err.error);
            messages.forEach(error => {
              if (error.includes("Name") && error.includes("already taken"))
                this.isUserNameTaken = true;
              if (error.includes("Email") && error.includes("already taken")) 
                this.isEmailTaken = true;
            });
            if (!this.isEmailTaken && !this.isUserNameTaken)
              this.isGeneralError = true;
            this.cdr.detectChanges();
          }
        }
      });
    }
  }
  closeModal(event : Event)
  {
    if (event.target === this.modalElement.nativeElement || 
      event.target === this.closeButton.nativeElement)
      this.closeModalEmitter.emit();
  }
  isIdentityResult(error: any): error is IdentityResult {
    return error && typeof error.succeeded === "boolean" && Array.isArray(error.errors);
  }
 getIdentityErrors(error: any): string[] {
  if (this.isIdentityResult(error)) {
    return error.errors.map(e => e.description);
  }
  return [];
  }
}
