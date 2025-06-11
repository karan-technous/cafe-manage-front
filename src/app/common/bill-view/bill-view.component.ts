import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductService } from '../../services/product.service';
import { BillService } from '../../services/bill.service';

interface BillItem {
  name: string;
  category: string;
  categoryName: string;
  quantity: string;
  price: string;
  total: string;
}

interface OrderDetails {
  id: number;
  customerName: string;
  email: string;
  number: string;
  payment_option: string;
  product_id: string;
  quantity: string;
  total: string;
}

@Component({
  selector: 'app-bill-view',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="bill-dialog-overlay" (click)="handleOverlayClick($event)">
      <div class="bill-dialog">
        <div class="bill-header">
          <h2>Order Details</h2>
          <button class="close-btn" (click)="handleClose()">×</button>
        </div>
        <div class="bill-content">
          <!-- Customer Information -->
          <div class="customer-info">
            <h3>Customer Information</h3>
            <div class="info-grid">
              <div class="info-item">
                <span class="label">Name:</span>
                <span class="value">{{orderDetails?.customerName}}</span>
              </div>
              <div class="info-item">
                <span class="label">Email:</span>
                <span class="value">{{orderDetails?.email}}</span>
              </div>
              <div class="info-item">
                <span class="label">Phone:</span>
                <span class="value">{{orderDetails?.number}}</span>
              </div>
              <div class="info-item">
                <span class="label">Payment Method:</span>
                <span class="value">{{orderDetails?.payment_option}}</span>
              </div>
            </div>
          <button class="btnDownload" (click)="handleDownloadBtn(orderDetails?.id)">Download Bill</button>
          </div>

          <!-- Order Items -->
          <div class="order-items">
            <h3>Order Items</h3>
            <table class="bill-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Category</th>
                  <th>Quantity</th>
                  <th>Price</th>
                  <th>Total</th>
                </tr>
              </thead>
              <tbody>
                @for (item of billItems; track item.name) {
                  <tr>
                    <td>{{item.name}}</td>
                    <td>{{item.categoryName}}</td>
                    <td>{{item.quantity}}</td>
                    <td>{{item.price}}</td>
                    <td>{{item.total}}</td>
                  </tr>
                }
              </tbody>
              <tfoot>
                <tr>
                  <td colspan="4" class="text-right">Grand Total:</td>
                  <td>{{orderDetails?.total}}</td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .bill-dialog-overlay {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.5);
      display: flex;
      justify-content: center;
      align-items: center;
      z-index: 1000;
    }

    .bill-dialog {
      background: white;
      border-radius: 8px;
      padding: 20px;
      width: 80%;
      max-width: 800px;
      max-height: 80vh;
      overflow-y: auto;

       &&::-webkit-scrollbar {
    display: none;
    /* Hides the scrollbar */
  }
    }

    .bill-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 20px;
      border-bottom: 2px solid #eee;
      padding-bottom: 10px;
    }

    .close-btn {
      background: none;
      border: none;
      font-size: 24px;
      cursor: pointer;
      padding: 0 8px;
    }

    .btnDownload{
      margin-top: 12px;
    padding: 4px 20px;
    cursor:pointer;
    border: 1px solid var(--primary-color-red);
    background-color: var(--primary-color-dark-red);
    border-radius: 3px;
    }
    .customer-info {
      margin-bottom: 30px;
      padding: 15px;
      background: var(--primary-bg-navbar);
      border-radius: 4px;
      border:1px solid var(--primary-border-grey-color)
    }

    .info-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 15px;
      margin-top: 15px;
    }

    .info-item {
      display: flex;
      flex-direction: column;
    }

    .label {
      font-weight: 500;
      color: var(--primary-color-grey);
      font-size: 0.9em;
    }

    .value {
      color: #333;
      margin-top: 4px;
    }

    .bill-table {
      width: 100%;
      border-collapse: collapse;
      margin-top: 15px;
    }

    .bill-table th,
    .bill-table td {
      padding: 12px;
      text-align: left;
      border-bottom: 1px solid #ddd;
    }

    .bill-table th {
      font-weight: 500;
      color:var(--primary-color-grey);
    }

    .text-right {
      text-align: right;
    }

    tfoot tr {
      font-weight: 500;
      color: var(--primary-color-grey);
      background-color: #f8f9fa;
    }

    h3 {
      color: #333;
      margin-bottom: 15px;
    }
  `]
})
export class BillViewComponent implements OnInit {
  @Input() orderId: number = 0;
  @Output() onClose = new EventEmitter<void>();

  orderDetails: OrderDetails | null = null;
  billItems: BillItem[] = [];

  constructor(private productService: ProductService, private billService: BillService) { }

  ngOnInit() {
    if (this.orderId) {
      this.loadOrderDetails();
    }
  }

  handleClose() {
    this.onClose.emit();
  }

  handleOverlayClick(event: MouseEvent) {
    if (event.target === event.currentTarget) {
      this.handleClose();
    }
  }

  async loadOrderDetails() {
    try {
      this.orderDetails = await this.productService.getOrderDetails(this.orderId);
      await this.loadProductDetails();
    } catch (error) {
      console.error('Error loading order details:', error);
    }
  }

  async loadProductDetails() {
    if (!this.orderDetails) return;

    try {
      const productIds = this.orderDetails.product_id.split(',');
      const quantities = this.orderDetails.quantity.split(',');

      // Fetch all products
      const allProducts = await this.productService.getProductAllNew() as any;

      // Map products to bill items
      this.billItems = productIds.map((productId, index) => {
        console.log("the id=", productId)
        console.log("the all=", allProducts)
        const product = allProducts?.find((p: any) => p.id.toString() === productId);
        if (product) {
          return {
            name: product.name,
            category: product.category,
            categoryName: product.categoryName,
            quantity: quantities[index] || '1',
            price: product.price,
            total: (parseFloat(product.price) * parseFloat(quantities[index] || '1')).toString()
          };
        }
        return null;
      }).filter(item => item !== null) as BillItem[];
    } catch (error) {
      console.error('Error loading product details:', error);
    }
  }

  handleDownloadBtn(id: any) {
    console.log("click", id)
    this.billService.getBill(id)

  }
} 