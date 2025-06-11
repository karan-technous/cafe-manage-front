import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableCommonComponent } from '../../common/table-common/table-common.component';
import { CategoryDialogComponent } from '../../common/category-dialog/category-dialog.component';
import { CategoryService } from '../../services/category.service';

interface Category {
  id: number;
  name: string;
}

interface CategoryResponse {
  content: Category[];
  totalElements: number;
  totalPages: number;
  pageNumber: number;
  hasNext: boolean;
}

@Component({
  selector: 'app-manage-category',
  standalone: true,
  imports: [CommonModule, TableCommonComponent, CategoryDialogComponent],
  templateUrl: './manage-category.component.html',
  styleUrls: ['./manage-category.component.css']
})
export class ManageCategoryComponent implements OnInit {
  categoryResponse: any = {
    content: [],
    totalElements: 0,
    totalPages: 1,
    pageNumber: 1,
    hasNext: false,
    size: 10
  };

  categoryDataField = [
    { key: 'id', label: 'ID' },
    { key: 'name', label: 'Name' },
    { key: 'action', label: 'Action', action: true }
  ];

  showCategoryDialog: boolean = false;
  isEdit: boolean = false;
  selectedCategory: any = null;
  currentPage: number = 1;
  currentPageSize: number = 10;
  currentKeyword: string = '';

  constructor(private categoryService: CategoryService) {}

  ngOnInit() {
    this.getCategoryAll();
  }

  async getCategoryAll() {
    try {
      const response = await this.categoryService.getCategoryAll();
      this.categoryResponse = {
        ...response,
        size: response.size || 10
      };
      this.currentPage = response.pageNumber || 1;
      this.currentPageSize = response.size || 10;
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  }

  handleAdd() {
    this.isEdit = false;
    this.selectedCategory = null;
    this.showCategoryDialog = true;
  }

  handleEdit(category: any) {
    this.isEdit = true;
    this.selectedCategory = category;
    this.showCategoryDialog = true;
  }

  async handleDelete(id: number) {
    try {
      await this.categoryService.deleteCategory(id);
      await this.getCategoryAll();
    } catch (error) {
      console.error('Error deleting category:', error);
    }
  }

  handleDialogClose() {
    this.showCategoryDialog = false;
    this.selectedCategory = null;
  }

  async handleDialogSubmit(data: {name: string, id?: number}) {
    try {
      if (this.isEdit && data.id) {
        await this.categoryService.updateCategory(data.id, data.name);
      } else {
        await this.categoryService.addCategory(data.name);
      }
      await this.getCategoryAll();
      this.handleDialogClose();
    } catch (error) {
      console.error('Error saving category:', error);
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

      const response = await this.categoryService.getCategoryFilter(page, size, keyword);
      this.categoryResponse = {
        ...response,
        size: size
      };
      this.currentPage = page;
      this.currentPageSize = size;
      this.currentKeyword = keyword;
    } catch (error) {
      console.error('Error filtering categories:', error);
    }
  }
}
