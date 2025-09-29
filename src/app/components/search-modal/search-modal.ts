import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-search-modal',
  imports: [CommonModule],
  templateUrl: './search-modal.html',
  styleUrl: './search-modal.scss'
})
export class SearchModal {
  @Input() userList: (string | null)[] = [];
}
