import { Component, Output, EventEmitter, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-promotion',
  imports: [CommonModule],
  templateUrl: './promotion.html',
  styleUrl: './promotion.scss'
})
export class Promotion {
  @Input() isWhitePlayer = true;
  @Output() promotion = new EventEmitter<string>();
  onClick(promoteChar: string)
  {
    this.promotion.emit(promoteChar);
  }
}
