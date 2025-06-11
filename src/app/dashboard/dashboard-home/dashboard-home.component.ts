import { Component } from '@angular/core';
import { AdminDashboardService } from '../../services/admin-dashboard.service';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-dashboard-home',
  imports: [RouterLink],
  templateUrl: './dashboard-home.component.html',
  styleUrl: './dashboard-home.component.css'
})
export class DashboardHomeComponent {
  categoryResponse: string = "0";
  productResponse: string = "0";
  billResponse: string = "0";

  constructor(private adminDashboardService: AdminDashboardService) {
    this.getCategoryCount();
    this.getBillCount();
    this.getProductCount();
  }
  getCategoryCount() {
    this.adminDashboardService.getCategoryCount()
      .then((response: string) => {
        console.log("res=", response);
        this.categoryResponse = response;
      })
      .catch((err) => {
        console.error("Error getting category count:", err);
      });
  }

  getProductCount() {
    this.adminDashboardService.getProductCount()
      .then((response: string) => {
        console.log("res=", response);
        this.productResponse = response;
      })
      .catch((err) => {
        console.error("Error getting category count:", err);
      });
  }

  getBillCount() {
    this.adminDashboardService.getBillCount()
      .then((response: string) => {
        console.log("res=", response);
        this.billResponse = response;
      })
      .catch((err) => {
        console.error("Error getting category count:", err);
      });
  }


}
