import { Component, ViewChild, ElementRef, Output, EventEmitter, Input } from '@angular/core';

@Component({
  selector: 'app-personal',
  imports: [],
  templateUrl: './personal.html',
  styleUrl: './personal.scss'
})
export class Personal {
  @ViewChild("modal") modalElement!: ElementRef;
  @ViewChild("closeButton") closeButton!: ElementRef;
  @Output() closeModalEmitter = new EventEmitter<void>(); 
  @Input() isGoogleFacebook = false
closeModal(event : Event)
  {
    if (event.target === this.modalElement.nativeElement || 
      event.target === this.closeButton.nativeElement)
      this.closeModalEmitter.emit();
  }
}
