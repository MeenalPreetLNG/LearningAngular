import { Component, Input, OnChanges, Output, EventEmitter } from "@angular/core";


@Component({
    selector: 'pm-star',
    templateUrl: './star.component.html',
    styleUrls: ['./star.component.css']
})


export class StarComponent implements OnChanges{
  @Input() rating: number = 4;
  cropwidth: number = 75;

  @Output() ratingClicked: EventEmitter<string> = 
  new EventEmitter<string>();

  ngOnChanges(): void{
      this.cropwidth = this.rating *  75/5;
  }

  onClick(): void{
    console.log(`The rating ${this.rating} was clicked! `);
  }
}
