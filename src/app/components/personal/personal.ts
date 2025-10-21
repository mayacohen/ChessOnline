import { Component, ViewChild, ElementRef, Output, EventEmitter, 
  Input, OnInit, ChangeDetectorRef } from '@angular/core';
import { Client } from '../../services/client';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-personal',
  imports: [CommonModule],
  templateUrl: './personal.html',
  styleUrl: './personal.scss'
})
export class Personal implements OnInit{
  @ViewChild("modal") modalElement!: ElementRef;
  @ViewChild("closeButton") closeButton!: ElementRef;
  @Output() closeModalEmitter = new EventEmitter<void>(); 
  @Input() isGoogleFacebook = false;
  tempUserPic = "example.png"; 
  constructor(private client:Client, private cdr:ChangeDetectorRef){}
  ngOnInit(): void {
    this.tempUserPic = this.client.getUserPic();
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
            this.tempUserPic = newImg;
            this.cdr.detectChanges();
          },
        error: err => console.log(err)
      });
    }
  }
}
