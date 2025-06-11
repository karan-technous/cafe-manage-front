import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';

@Component({
  selector: 'app-category-dialog',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="dialog-overlay" (click)="handleOverlayClick($event)">
      <div class="dialog">
        <div class="dialog-header">
          <h2>{{ isEdit ? 'Edit Category' : 'Add Category' }}</h2>
          <button class="close-btn" (click)="handleClose()">×</button>
        </div>
        <div class="dialog-content">
          <form #categoryForm="ngForm" (ngSubmit)="handleSubmit(categoryForm)">
            <div class="form-group">
              <label for="name">Category Name <span class="required">*</span></label>
              <input 
                type="text" 
                id="name" 
                name="name" 
                [(ngModel)]="categoryName" 
                required
                minlength="2"
                maxlength="50"
                #nameInput="ngModel"
                [class.is-invalid]="nameInput.invalid && (nameInput.dirty || nameInput.touched)"
                placeholder="Enter category name">
              
              <div class="error-message" *ngIf="nameInput.invalid && (nameInput.dirty || nameInput.touched)">
                <span *ngIf="nameInput.errors?.['required']">Category name is required</span>
                <span *ngIf="nameInput.errors?.['minlength']">Category name must be at least 2 characters</span>
                <span *ngIf="nameInput.errors?.['maxlength']">Category name cannot exceed 50 characters</span>
              </div>
            </div>

            <div class="dialog-actions">
              <button type="button" class="cancel-btn" (click)="handleClose()">Cancel</button>
              <button 
                type="submit" 
                class="submit-btn"
                [disabled]="categoryForm.invalid || isLoading">
                {{ isLoading ? 'Processing...' : (isEdit ? 'Update' : 'Add') }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .dialog-overlay {
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

    .dialog {
      background: white;
      border-radius: 8px;
      padding: 20px;
      width: 90%;
      max-width: 500px;
      box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    }

    .dialog-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 20px;
      padding-bottom: 10px;
      border-bottom: 1px solid #eee;
    }

    .dialog-header h2 {
      margin: 0;
      color: #333;
      font-size: 1.5rem;
    }

    .close-btn {
      background: none;
      border: none;
      font-size: 24px;
      cursor: pointer;
      padding: 0 8px;
      color: #666;
    }

    .form-group {
      margin-bottom: 20px;
    }

    .form-group label {
      display: block;
      margin-bottom: 8px;
      color: #333;
      font-weight: 500;
    }

    .required {
      color: var(--primary-color-red);
      margin-left: 4px;
    }

    .form-group input {
      width: 100%;
      padding: 8px 12px;
      border: 1px solid #ddd;
      border-radius: 4px;
      font-size: 1rem;
      transition: all 0.3s ease;
    }

    .form-group input:focus {
      outline: none;
      border-color: var(--primary-color-red);
      box-shadow: 0 0 0 2px rgba(255, 20, 20, 0.1);
    }

    .form-group input.is-invalid {
      border-color: var(--primary-color-red);
    }

    .error-message {
      color: var(--primary-color-red);
      font-size: 0.875rem;
      margin-top: 4px;
      display: block;
    }

    .dialog-actions {
      display: flex;
      justify-content: flex-end;
      gap: 12px;
      margin-top: 20px;
    }

    .dialog-actions button {
      padding: 8px 16px;
      border-radius: 4px;
      font-size: 0.875rem;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.2s ease;
    }

    .dialog-actions button:disabled {
      opacity: 0.7;
      cursor: not-allowed;
    }

    .cancel-btn {
      background-color: var(--primary-color-grey);
      color: var(--primary-color-white);
      border: 1px solid var(--primary-border-grey-color);
    }

    .cancel-btn:hover:not(:disabled) {
      background-color: var(--primary-bg-grey-color);
      color: var(--primary-color-red);
    }

    .submit-btn {
      background-color: var(--primary-color-dark-red);
      color: var(--primary-color-red);
      border: none;
    }

    .submit-btn:hover:not(:disabled) {
      background-color: var(--primary-bg-grey-color);
    }
  `]
})
export class CategoryDialogComponent {
  @Input() isEdit: boolean = false;
  @Input() categoryData: any = null;
  @Output() onClose = new EventEmitter<void>();
  @Output() onSubmit = new EventEmitter<{name: string, id?: number}>();

  categoryName: string = '';
  isLoading: boolean = false;

  ngOnInit() {
    if (this.isEdit && this.categoryData) {
      this.categoryName = this.categoryData.name;
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

  handleSubmit(form: NgForm) {
    if (form.invalid) {
      // Mark all fields as touched to trigger validation messages
      Object.keys(form.controls).forEach(key => {
        const control = form.controls[key];
        control.markAsTouched();
      });
      return;
    }

    this.isLoading = true;
    const data = {
      name: this.categoryName.trim(),
      ...(this.isEdit && this.categoryData ? { id: this.categoryData.id } : {})
    };

    try {
      this.onSubmit.emit(data);
    } finally {
      this.isLoading = false;
    }
  }
} 