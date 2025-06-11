import { NgFor } from '@angular/common';
import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core';
import { FormsModule, NumberValueAccessor } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { BillViewComponent } from '../bill-view/bill-view.component';

interface FilterData {
  key: string;
  value: string | number;
}

export interface DeleteData {
  id: number;
  type: string;
}

interface TableColumn {
  key: string;
  label: string;
  action?: boolean;
  show?: boolean;
}

interface BillItem {
  name: string;
  category: string;
  quantity: string;
  price: string;
  total: string;
}

@Component({
  selector: 'app-table-common',
  standalone: true,
  imports: [CommonModule, FormsModule, BillViewComponent],
  templateUrl: './table-common.component.html',
  styleUrls: ['./table-common.component.css']
})
export class TableCommonComponent implements OnInit {
  @Input() data: any = {}; // array passed to the table
  @Output() filterChanged = new EventEmitter<FilterData>(); // event emitted when filter changes
  @Output() deleteItem = new EventEmitter<number>(); // event emitted when delete is confirmed
  @Input() dataField: TableColumn[] = [];
  @Output() onDelete = new EventEmitter<number>();
  @Output() onEdit = new EventEmitter<any>();
  @Output() onView = new EventEmitter<any>();
  visibleFilterMenu = false
  pageSize: number = 10;
  pageNumber: number = 1;
  currentFilter: string = '';
  showDeleteConfirm: boolean = false;
  showBillView: boolean = false;
  selectedRow: any = null;
  itemToDelete: number | null = null;

  texts: string[] = this.dataField.filter(v => v.label != 'ID' && v.label != 'action')
  .map(v => v.label);

  // Color objects
  colorPalette = [
    { color: 'rgb(251 0 0)', back: 'rgb(255 0 0 / 14%)' },
    { color: 'rgb(136 0 255)', back: 'rgb(25 0 255 / 13%)' },
    { color: 'rgb(242 0 255)', back: 'rgb(255 0 179 / 13%)' },
    { color: 'rgb(242 0 255)', back: 'rgb(255 0 179 / 13%)' },
    { color: '#000000', back: 'rgb(213 213 213)' },
  ];
  shuffleArray(array: any[]) {
    return array
      .map(value => ({ value, sort: Math.random() }))
      .sort((a, b) => a.sort - b.sort)
      .map(({ value }) => value);
  }
  // Final merged data
  styledTexts: { text: string; color: string; back: string, selected:boolean }[] = [];


  ngOnInit() {
    this.texts= this.dataField.filter(v => v.label != 'ID' && v.label != 'Action')
  .map(v => v.label);
  console.log("the text==",this.texts)

    // Initialize page number from data if available
    if (this.data && this.data.pageNumber) {
      this.pageNumber = this.data.pageNumber;
    }

    // for color pellete
    const shuffledColors = this.shuffleArray([...this.colorPalette]); // clone & shuffle

    this.styledTexts = this.texts.map((text, index) => {
      const colorSet = shuffledColors[index] || {
        color: '#000000',
        back: '#ffffff',
        selected:text == "Name" ? true : false
      }; // fallback in case texts > colorPalette

      return {
        text,
        color: colorSet.color,
        back: colorSet.back,
        selected: text == "Name" ? true : false
      };
    });

    console.log("the style==",this.styledTexts)
  }

  onInputChange(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.currentFilter = value;
    const data: FilterData = {
      key: "filter",
      value: value
    }
    this.filterChanged.emit(data);
  }

  onPageSizeChange(event: Event) {
    const value = (event.target as HTMLInputElement).value;
    this.pageSize = +value;
    const data = {
      key: "size",
      value: value
    }
    this.filterChanged.emit(data);
  }

  handleNextbtn() {
    if (this.data.hasNext) {
      const nextPage = this.pageNumber + 1;
      const data = {
        key: "next",
        value: nextPage
      }
      this.pageNumber = nextPage;
      this.filterChanged.emit(data);
    }
  }

  handlePrevbtn() {
    if (this.pageNumber > 1) {
      const prevPage = this.pageNumber - 1;
      const data = {
        key: "prev",
        value: prevPage
      }
      this.pageNumber = prevPage;
      this.filterChanged.emit(data);
    }
  }

  onDeleteClick(id: number, type: string) {
    this.itemToDelete = id;
    this.showDeleteConfirm = true;
  }

  confirmDelete() {
    if (this.itemToDelete) {
      this.deleteItem.emit(this.itemToDelete);
      this.showDeleteConfirm = false;
      this.itemToDelete = null;
    }
  }

  cancelDelete() {
    this.showDeleteConfirm = false;
    this.itemToDelete = null;
  }

  onViewClick(row: any) {
    this.selectedRow = row;
    this.showBillView = true;
  }

  closeBillView() {
    this.showBillView = false;
    this.selectedRow = null;
  }


  mouseEnterForFilter() {
    console.log("called")
    this.visibleFilterMenu = true
  }

  mouseLeaveForFilter() {
    this.visibleFilterMenu = false
  }

  mouseUpForFilter(){
    this.visibleFilterMenu = false;
  }
}
