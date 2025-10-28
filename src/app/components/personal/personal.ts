import { Component, ViewChild, ElementRef, Output, EventEmitter, 
  Input, OnInit, ChangeDetectorRef } from '@angular/core';
import { Client } from '../../services/client';
import { CommonModule } from '@angular/common';
import { FormGroup,FormsModule, FormBuilder,Validators,
   ReactiveFormsModule, AbstractControl } from '@angular/forms';
import { EmailChangeModel } from '../../models/email-change-model';
import { PasswordChangeModel } from '../../models/password-change-model';
import { UsernameChangeModel } from '../../models/username-change-model';
import { PersonalDetails } from '../../models/personal-details';
@Component({
  selector: 'app-personal',
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './personal.html',
  styleUrl: './personal.scss'
})
export class Personal implements OnInit{
  @ViewChild("modal") modalElement!: ElementRef;
  @ViewChild("closeButton") closeButton!: ElementRef;
  @Output() closeModalEmitter = new EventEmitter<void>(); 
  @Input() isGoogleFacebook = false;
  tempUserPic = "example.png"; 
  emailForm!: FormGroup;
  passwordForm!: FormGroup;
  userNameForm!: FormGroup;
  showEmailForm = false;
  showUsernameForm = false;
  showPasswordForm = false;
  isEmailTaken = false;
  isUserNameTaken = false;
  user : PersonalDetails = {username:"", userPic:"example.pmg", score:null,
    gamesDraw:0, gamesLost:0, gamesWon:0, dateJoined:"",email:""};
  constructor(private client:Client, private cdr:ChangeDetectorRef,
    private fb:FormBuilder){}
  ngOnInit(): void {
    this.client.getPersonalInfo().subscribe({
      next: info => {this.user = info;
        this.cdr.detectChanges();
      },
      error : err => console.log(err)
    });
    this.emailForm = this.fb.group({
      email:['', Validators.required, Validators.email]      
    });
    this.userNameForm = this.fb.group({
      userName: ['', [Validators.required, Validators.minLength(3),
          this.usernameDoesntStartWithGuestValidator]]     
    });
    this.passwordForm = this.fb.group({
      oldPassword: ['', [Validators.required, this.passwordStrengthValidator]],
      newPassword: ['', [Validators.required, this.passwordStrengthValidator]]
    }, { validators: this.passwordsAreNotEqalValidator });
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
  passwordsAreNotEqalValidator(control: AbstractControl) 
  {
    const password = control.value.password;
    const confirmPassword = control.value.confirmPassword;
    if (password && confirmPassword && password === confirmPassword) {
      return { passwordMismatch: true };
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
  closeModal(event : Event)
  {
    if (event.target === this.modalElement.nativeElement || 
      event.target === this.closeButton.nativeElement)
      this.closeModalEmitter.emit();
  }
  switchAvatar(avatarNum:number)
  {
    if (avatarNum >= 1 && avatarNum <= 6)
    {
      const newImg = "icon"+avatarNum.toString() +".png";
      this.client.changePicture(newImg).subscribe({
        next: () => 
          {
            this.user.userPic = newImg;
            this.client.setUserPic(newImg);
            this.cdr.detectChanges();
          },
        error: err => console.log(err)
      });
    }
  }
  toggleEmailForm() { this.showEmailForm = !this.showEmailForm; }
  toggleUsernameForm() { this.showUsernameForm = !this.showUsernameForm; }
  togglePasswordForm() { this.showPasswordForm = !this.showPasswordForm; }
  //edit
  onChangeEmail() 
  { 
    const emailModel : EmailChangeModel ={
      email: this.emailForm.value.email
    };
    this.client.changeEmail(emailModel).subscribe({
      next: () =>
      {
        this.isEmailTaken = false;
        this.user.email = emailModel.email;
        this.showEmailForm= false;
        this.cdr.detectChanges();
      },
      error: () => this.isEmailTaken = true
    }); 
  }
  onChangeUsername() 
  { 
    const usernameModel : UsernameChangeModel ={
      userName: this.userNameForm.value.userName
    };
    this.client.changeUserName(usernameModel).subscribe({
      next: () =>
      {
        this.isUserNameTaken = false;
        this.user.username = usernameModel.userName;
        this.showUsernameForm= false;
        this.cdr.detectChanges();
      },
      error: () => this.isUserNameTaken = true
    }); 
  }
  onChangePassword() 
  { 
    const passwordModel : PasswordChangeModel ={
      oldPassword: this.passwordForm.value.oldPassword,
      newPassword: this.passwordForm.value.newPassword
    };
    this.client.changePassword(passwordModel).subscribe({
      next: () =>
      {
        this.showPasswordForm = false;
        this.cdr.detectChanges();
      },
      error: err => console.log(err)
    }); 
  }
}
//add detais from get user info or som.