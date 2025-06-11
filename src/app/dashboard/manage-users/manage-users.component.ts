import { Component } from '@angular/core';
import { UserTableColumn } from '../../utils/table-coloumn';
import { TableCommonComponent } from '../../common/table-common/table-common.component';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-manage-users',
  imports: [TableCommonComponent],
  templateUrl: './manage-users.component.html',
  styleUrl: './manage-users.component.css'
})
export class ManageUsersComponent {
  userResponse: any = [];
  userDataField = UserTableColumn;
  currentPage: number = 1;
  currentPageSize: number = 10;
  currentFilter: string = '';

  constructor(private userService: UserService) {
    this.getUserAll()
  }

  onChangeFilter(text: any) {
    switch (text.key) {
      case "size":
        this.currentPageSize = +text.value;
        this.currentPage = 1; // Reset to first page when changing page size
        this.loadUsers(this.currentPage, this.currentPageSize, this.currentFilter);
        break;
      case "next":
        this.currentPage = text.value;
        this.loadUsers(this.currentPage, this.currentPageSize, this.currentFilter);
        break;
      case "prev":
        this.currentPage = text.value;
        this.loadUsers(this.currentPage, this.currentPageSize, this.currentFilter);
        break;
      case "filter":
        this.currentFilter = text.value;
        this.currentPage = 1; // Reset to first page when filtering
        this.loadUsers(this.currentPage, this.currentPageSize, this.currentFilter);
        break;
    }
  }

  private loadUsers(page: number, size: number, filter: string) {
    this.userService.getUserFilter(page, size, filter)
      .then((data) => {
        this.userResponse = data;
      })
      .catch(err => {
        console.error(err);
      });
  }

  async getUserAll() {
    this.loadUsers(1, 10, '');
  }
}
