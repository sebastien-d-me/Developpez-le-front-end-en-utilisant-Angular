import { Component, Input, OnInit  } from '@angular/core';

@Component({
  selector: 'app-card',
  standalone: true,
  imports: [],
  templateUrl: './card.component.html',
  styleUrl: './card.component.scss'
})
export class CardComponent implements OnInit {
    @Input() title = "";
    @Input() values = 0;

    ngOnInit(): void {    
        
    }
}
