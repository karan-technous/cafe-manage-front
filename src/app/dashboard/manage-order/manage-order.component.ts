import { Component, OnInit } from '@angular/core';
import { ProductService } from '../../services/product.service';
import { FormsModule } from '@angular/forms';
import { ProductArrayComponent } from '../../common/product-array/product-array.component';
import { BillService } from '../../services/bill.service';

interface ProductDetails {
  category: string;
  product: string;
  price: string;
  name:string;
  quantity: string;
  total: string;
}

interface Category {
  id: number;
  name: string;
}

interface Product {
  id: number;
  name: string;
  category: string;
  price: string;
  description: string;
}

interface ApiResponse {
  content: Product[];
  totalElements: number;
  totalPages: number;
  pageNumber: number;
  hasNext: boolean;
  lastPage: boolean;
}

interface CustomerDetails {
  email: String,
  customerName: String,
  number: String,
  payment_option: String
}

@Component({
  selector: 'app-manage-order',
  imports: [FormsModule, ProductArrayComponent],
  templateUrl: './manage-order.component.html',
  styleUrl: './manage-order.component.css'
})
export class ManageOrderComponent implements OnInit {
  arrayOfProductDetails: ProductDetails[] = [];
  categories: Category[] = [];
  products: Product[] = [];
  visibleBtnBill = false;
  customerDetails: CustomerDetails = {
    email: "",
    customerName: "",
    number: "",
    payment_option: ""
  };
  constructor(private productService: ProductService, private billService: BillService) { }

  ngOnInit() {
    this.loadCategories();
    this.loadProducts();
  }
  onChnageCustomerDetails(e: any) {
    console.log("the valie==",e.target.value)
    this.customerDetails = { ...this.customerDetails, [e.target.name]: e.target.value }
    console.log("the customer details==", this.customerDetails)
    const allFieldsFilled = Object.values(this.customerDetails).every(value => value != '');
    console.log("the err=",allFieldsFilled)
   

    if (allFieldsFilled && this.arrayOfProductDetails.length > 0) {
      this.visibleBtnBill = allFieldsFilled;
    }


  }
  async loadCategories() {
    try {
      const categories = await this.productService.getCategories();
      this.categories = categories;
      console.log('Categories loaded:', this.categories);
    } catch (err) {
      console.error('Error loading categories:', err);
      this.categories = [];
    }
  }

  async loadProducts() {
    try {
      const response = await this.productService.getProductAll() as ApiResponse;
      console.log('Products data:', response);

      // Map products from API response and ensure category is a string
      this.products = response.content.map(item => ({
        id: item.id,
        name: item.name,
        category: item.category.toString(), // Ensure category is a string
        price: item.price,
        description: item.description
      }));

      console.log('Products loaded:', this.products);
    } catch (err) {
      console.error('Error loading products:', err);
      this.products = [];
    }
  }

  onProductsChange(products: ProductDetails[]) {
    console.log('Products changed:', products);
    this.arrayOfProductDetails = products;
  const allFieldsFilled = Object.values(this.customerDetails).every(value => value != '');
    if (this.arrayOfProductDetails.length > 0 && allFieldsFilled) {
      this.visibleBtnBill = true
    }
  }

  handleSubmitAndBill() {
    console.log("calledsdfsdfsdfsdf")
    const productIdsString = this.arrayOfProductDetails.map(item => item.product).join(',');
    const totalSum = this.arrayOfProductDetails.reduce((sum, item) => {
      return sum + Number(item.total);
    }, 0);

    if (this.arrayOfProductDetails.length === 0) {
      console.log("calle  sdfsdfsdfd")
      alert("please select the product")
      return;
    }
    console.log("call=", this.arrayOfProductDetails);
    console.log("and=", productIdsString);
    const data = {
      ...this.customerDetails,
      product_id: productIdsString,
      total:totalSum,
      quantity:1,
      product_category:productIdsString
    }
    console.log("the final data===", data)
    this.billService.storeBill(data)
  }
}