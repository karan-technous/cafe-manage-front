import { Component, Output, EventEmitter } from '@angular/core';
import { BillTableColumn } from '../../utils/table-coloumn';
import { TableCommonComponent } from '../../common/table-common/table-common.component';
import { BillService } from '../../services/bill.service';
import { CommonModule } from '@angular/common';

interface Bill {
  id: number;
  customerName: string;
  email: string;
  number: string;
  payment_option: string;
  product_id: string;
  quantity: string;
  total: string;
}

interface BillResponse {
  content: Bill[];
  totalElements: number;
  totalPages: number;
  pageNumber: number;
  hasNext: boolean;
}

@Component({
  selector: 'app-view-bill',
  standalone: true,
  imports: [TableCommonComponent, CommonModule],
  templateUrl: './view-bill.component.html',
  styleUrl: './view-bill.component.css'
})
export class ViewBillComponent {
  @Output() onClose = new EventEmitter<void>();
  
  billResponse: BillResponse = {
    content: [],
    totalElements: 0,
    totalPages: 1,
    pageNumber: 1,
    hasNext: false
  };
  
  billDataField = BillTableColumn;
  showBillView: boolean = false;
  selectedBill: Bill | null = null;
  currentPage: number = 1;
  currentPageSize: number = 10;
  currentFilter: string = '';

  constructor(private billService: BillService) {
    this.getBillAll();
  }

  onFilterChange(data: any) {
    this.onChangeFilter(data);
  }

  onViewClick(event: any) {
    if (event && event.id) {
      this.selectedBill = event;
      this.showBillView = true;
    }
  }

  closeBillView() {
    this.showBillView = false;
    this.selectedBill = null;
    this.onClose.emit();
  }

  onChangeFilter(text: any) {
    switch (text.key) {
      case "size":
        this.currentPageSize = +text.value;
        this.currentPage = 1; // Reset to first page when changing page size
        this.loadBills(this.currentPage, this.currentPageSize, this.currentFilter);
        break;
      case "next":
        this.currentPage = text.value;
        this.loadBills(this.currentPage, this.currentPageSize, this.currentFilter);
        break;
      case "prev":
        this.currentPage = text.value;
        this.loadBills(this.currentPage, this.currentPageSize, this.currentFilter);
        break;
      case "filter":
        this.currentFilter = text.value;
        this.currentPage = 1; // Reset to first page when filtering
        this.loadBills(this.currentPage, this.currentPageSize, this.currentFilter);
        break;
    }
  }

  async handleDelete(e: any) {
    try {
      await this.billService.deleteBill(e);
      this.getBillAll();
    } catch (error) {
      console.error('Error deleting bill:', error);
    }
  }

  private loadBills(page: number, size: number, filter: string) {
    this.billService.getBillFilter(page, size, filter)
      .then((response: any) => {
        this.billResponse = {
          content: response.content || [],
          totalElements: response.totalElements || 0,
          totalPages: response.totalPages || 1,
          pageNumber: response.pageNumber || 1,
          hasNext: response.hasNext || false
        };
      })
      .catch(err => {
        console.error(err);
      });
  }

  async getBillAll() {
    this.loadBills(1, 10, '');
  }
}
