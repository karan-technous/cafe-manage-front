import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableCommonComponent } from '../../common/table-common/table-common.component';
import { ProductDialogComponent } from '../../common/product-dialog/product-dialog.component';
import { ProductService } from '../../services/product.service';
import { CategoryService } from '../../services/category.service';
import { TableColumn } from '../../utils/table-coloumn';

interface Product {
  id?: number;
  name: string;
  description: string;
  price: string;
  category: string;
  categoryId: number;
}

interface ProductResponse {
  content: Product[];
  totalElements: number;
  totalPages: number;
  pageNumber: number;
  hasNext: boolean;
  size: number;
}

@Component({
  selector: 'app-manage-product',
  standalone: true,
  imports: [CommonModule, TableCommonComponent, ProductDialogComponent],
  templateUrl: './manage-product.component.html',
  styleUrls: ['./manage-product.component.css']
})
export class ManageProductComponent implements OnInit {
  productResponse: ProductResponse = {
    content: [],
    totalElements: 0,
    totalPages: 1,
    pageNumber: 1,
    hasNext: false,
    size: 10
  };
  
  productDataField: TableColumn[] = [
    { key: 'id', label: 'ID' },
    { key: 'name', label: 'Name' },
    { key: 'description', label: 'Description' },
    { key: 'price', label: 'Price' },
    { key: 'categoryName', label: 'Category' },
    { key: 'action', label: 'Action', action: true }
  ];

  showProductDialog: boolean = false;
  isEdit: boolean = false;
  selectedProduct: Product | null = null;
  categories: any[] = [];
  currentPage: number = 1;
  currentPageSize: number = 10;
  currentKeyword: string = '';

  constructor(
    private productService: ProductService,
    private categoryService: CategoryService
  ) {}

  ngOnInit() {
    this.getProductAll();
    this.getCategories();
  }

  async getProductAll() {
    try {
      const response = await this.productService.getProductAll() as ProductResponse;
      this.productResponse = {
        content: response.content || [],
        totalElements: response.totalElements || 0,
        totalPages: response.totalPages || 1,
        pageNumber: response.pageNumber || 1,
        hasNext: response.hasNext || false,
        size: response.size || 10
      };
      this.currentPage = response.pageNumber || 1;
      this.currentPageSize = response.size || 10;
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  }

  async getCategories() {
    try {
      const response = await this.categoryService.getCategoryAllWithoutPagi();
      this.categories = response || [];
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  }

  handleAdd() {
    this.isEdit = false;
    this.selectedProduct = {
      name: '',
      description: '',
      price: '0',
      category: '',
      categoryId: 0
    };
    this.showProductDialog = true;
  }

  handleEdit(product: Product) {
    this.isEdit = true;
    this.selectedProduct = { ...product };
    this.showProductDialog = true;
  }

  async handleDelete(id: number) {
    try {
      await this.productService.deleteProduct(id);
      await this.getProductAll();
    } catch (error) {
      console.error('Error deleting product:', error);
    }
  }

  handleDialogClose() {
    this.showProductDialog = false;
    this.selectedProduct = null;
  }

  async handleDialogSubmit(data: Product) {
    try {
      if (this.isEdit && data.id) {
        await this.productService.updateProduct(data.id, data);
      } else {
        await this.productService.addProduct(data);
      }
      await this.getProductAll();
      this.handleDialogClose();
    } catch (error) {
      console.error('Error saving product:', error);
    }
  }

  async onChangeFilter(data: any) {
    try {
      let page = this.currentPage;
      let size = this.currentPageSize;
      let keyword = this.currentKeyword;

      switch (data.key) {
        case "size":
          size = Number(data.value) || 10;
          page = 1;
          break;
        case "next":
          page = Number(data.value) || 1;
          break;
        case "prev":
          page = Number(data.value) || 1;
          break;
        case "filter":
          keyword = data.value || '';
          page = 1;
          break;
      }

      const response = await this.productService.getProductFilter(page, size, keyword) as ProductResponse;
      this.productResponse = {
        content: response.content || [],
        totalElements: response.totalElements || 0,
        totalPages: response.totalPages || 1,
        pageNumber: response.pageNumber || 1,
        hasNext: response.hasNext || false,
        size: size
      };
      this.currentPage = page;
      this.currentPageSize = size;
      this.currentKeyword = keyword;
    } catch (error) {
      console.error('Error filtering products:', error);
    }
  }
}
