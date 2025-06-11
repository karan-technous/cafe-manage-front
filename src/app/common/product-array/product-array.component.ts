import { Component, EventEmitter, Input, Output, OnInit, OnChanges } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgFor } from '@angular/common';
import { ProductArrayColumn } from '../../utils/table-coloumn';
import { ProductService, Product } from '../../services/product.service';

interface ProductDetails {
  category: string;
  product: string;
  price: string;
  quantity: string;
  name:string;
  total: string;
  productId?: number;
}

interface Category {
  id: number;
  name: string;
}

@Component({
  selector: 'app-product-array',
  standalone: true,
  imports: [FormsModule, NgFor],
  template: `
    <div class="product-array-container">
      <div class="product-selection">
        <div class="form-group">
          <select name="category" [(ngModel)]="productDetails.category" (change)="onCategoryChange($event)">
            <option value="">Select Category</option>
            <option *ngFor="let category of categories" [value]="category.id">{{category.name}}</option>
          </select>
        </div>
        <div class="form-group">
          <select name="product" [(ngModel)]="productDetails.product" (change)="onProductChange($event)">
            <option value="">Select Product</option>
            <option *ngFor="let product of filteredProducts" [value]="product.id">{{product.name}}</option>
          </select>
        </div>
        <div class="form-group">
          <input type="number" min="1" name="price" placeholder="Price" [(ngModel)]="productDetails.price" (input)="onChange($event)" required>
        </div>
        <div class="form-group">
          <input type="number" min="1" name="quantity" placeholder="Quantity" [(ngModel)]="productDetails.quantity" (input)="onChange($event)" required>
        </div>
        <div class="form-group">
          <input type="number" min="1" name="total" placeholder="Total" [(ngModel)]="productDetails.total" (input)="onChange($event)" required>
        </div>
        <div class="form-group">
          <button [class.enabled]="isFormValid" [class.disabled]="!isFormValid" (click)="handleAddProduct()">
            {{ editingIndex !== -1 ? 'Update Product' : 'Add Product' }}
          </button>
        </div>
      </div>

      <div class="product-table">
        <table>
          <thead>
            <tr>
              <th *ngFor="let field of productDataField" class="font-medium text-slate-600">{{field.label}}</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let item of products; let i = index">
              <td>{{item.name}}</td>
              <td>{{getCategoryName(item.category)}}</td>
              <td>{{item.price}}</td>
              <td>{{item.quantity}}</td>
              <td>{{item.total}}</td>
              <td>
                <button (click)="handleEdit(i)">Edit</button>
                <button (click)="handleDelete(i)">Delete</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  `,
  styles: [`
    .product-array-container {
      padding: 20px;
    }
    .product-selection {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 15px;
      margin-bottom: 20px;
    }
    .form-group {
      display: flex;
      flex-direction: column;
    }
    select, input {
      padding: 8px;
      border: 1px solid #ddd;
      border-radius: 4px;
    }
    button {
      padding: 8px 16px;
      border: none;
      border-radius: 4px;
      cursor: pointer;
    }
    button.enabled {
      background-color: var(--primary-color-dark-red);
      color: var(--primary-color-red);
      font-weight: 500;
    }
    button.disabled {
      background-color: var(--primary-color-grey);
      color: var(--primary-color-white);
      cursor: not-allowed;
    }
    table {
      width: 100%;
      border-collapse: collapse;
    }
    th, td {
      padding: 12px;
      text-align: left;
      border-bottom: 1px solid #ddd;
    }
    th {
      background-color: #f5f5f5;
    }
  `]
})
export class ProductArrayComponent implements OnInit, OnChanges {
  @Input() products: ProductDetails[] = [];
  @Input() categories: Category[] = [];
  @Input() allProducts: Product[] = [];
  @Output() productsChange = new EventEmitter<ProductDetails[]>();
  
  productDetails: ProductDetails = {
    category: '',
    product: '',
    price: '',
    name:'',
    quantity: '',
    total: '',
    productId: undefined
  };
  
  productDataField = ProductArrayColumn;
  isFormValid = false;
  editingIndex = -1;
  filteredProducts: Product[] = [];

  constructor(private productService: ProductService) {}

  ngOnInit() {
  }

  ngOnChanges() {
  }

  async onCategoryChange(e: any) {
    console.log("the id=", e.target.value);
    this.productDetails = { ...this.productDetails, category: e.target.value };
    if (this.productDetails.category) {
      try {
        const products = await this.productService.getProductByCategory(Number(this.productDetails.category));
        this.filteredProducts = products;
        console.log("the filtered products????=", this.filteredProducts);
      } catch (error) {
        console.error('Error fetching products by category:', error);
        this.filteredProducts = [];
      }
    } else {
      this.filteredProducts = [];
    }
    this.validateForm();
  }

  onProductChange(e: any) {
    const selectedProduct = this.filteredProducts.find(p => p.id?.toString() == e.target.value);
    if (selectedProduct) {
      this.productDetails = {
        ...this.productDetails,
        product: e.target.value,
        name:selectedProduct.name,
        price: selectedProduct.price,
        productId: selectedProduct.id
      };
      // Calculate total if quantity is set
      console.log("the product=",selectedProduct)
      console.log("the details=",this.productDetails)
      if (this.productDetails.quantity) {
        this.productDetails.total = (parseFloat(selectedProduct.price) * parseFloat(this.productDetails.quantity)).toString();
      }
    }
    this.validateForm();
  }

  getProductName(productId: string): string {
    const product = this.allProducts.find(p => p.id?.toString() === productId);
    return product ? product.name : '';
  }

  getCategoryName(categoryId: string): string {
    const category = this.categories.find(c => c.id.toString() === categoryId);
    return category ? category.name : '';
  }

  onChange(e: any) {
    const { name, value } = e.target;
    this.productDetails = { ...this.productDetails, [name]: value };
    console.log("the new===",this.productDetails)
    // Calculate total if both price and quantity are set
    if (name === 'quantity' && this.productDetails.price) {
      this.productDetails.total = (parseFloat(this.productDetails.price) * parseFloat(value)).toString();
    } else if (name === 'price' && this.productDetails.quantity) {
      this.productDetails.total = (parseFloat(value) * parseFloat(this.productDetails.quantity)).toString();
    }
    
    this.validateForm();
  }

  validateForm() {
    this.isFormValid = Object.values(this.productDetails).every(value => value !== '');
  }

  handleAddProduct() {
    if (!this.isFormValid) return;

    if (this.editingIndex === -1) {
      // Add new product
      console.log("deta?????=====", this.productDetails)
      console.log("deta?????=====;;;;;;", this.products)
      this.products = [...this.products, {...this.productDetails }];
      console.log("data>>>>>>>",this.products)
    }
     else {
      // Update existing product
      this.products[this.editingIndex] = { ...this.productDetails };
      this.editingIndex = -1;
    }

    this.productsChange.emit(this.products);
    this.resetForm();
  }

  handleEdit(index: number) {
    this.editingIndex = index;
    this.productDetails = { ...this.products[index] };
    this.validateForm();
  }

  handleDelete(index: number) {
    this.products = this.products.filter((_, i) => i !== index);
    this.productsChange.emit(this.products);
  }

  private resetForm() {
    this.productDetails = {
      category: '',
      product: '',
      price: '',
      quantity: '',
      total: '',
      name:'',
      productId: undefined
    };
    this.filteredProducts = [];
    this.isFormValid = false;
  }
} 