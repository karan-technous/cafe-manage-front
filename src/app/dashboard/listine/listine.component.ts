import { Component } from '@angular/core';
import { ListineVirtualScrollModule } from "listine";

@Component({
  selector: 'app-listine',
  imports: [ListineVirtualScrollModule],
  templateUrl: './listine.component.html',
  styleUrl: './listine.component.css'
})
export class ListineComponent {
option= Array.from({ length: 1000000 }, (_, index) => {
  const cities = ['Chicago', 'Houston', 'New York', 'San Francisco', 'Los Angeles'];
  const cityIndex = index % cities.length;
  return {
    label: `${cities[cityIndex]}`,
    value: `${index}`,
  };
});
}
