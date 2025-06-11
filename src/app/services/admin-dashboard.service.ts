import { Injectable } from "@angular/core";
import { AxiosService } from "../utils/apiInterceptor";


@Injectable({
    providedIn: 'root'
})

export class AdminDashboardService {

    constructor(private axiosService: AxiosService) {
    }

    async getCategoryCount(): Promise<string> {
        return this.axiosService.getAxios().get("/category/count")
            .then(data => {
                return data.data.data.count; // ✅ This value will be passed to the component
            })
            .catch(err => {
                console.error("the error ====", err);
                throw err;
            });
    }

    async getProductCount(): Promise<string> {
        return this.axiosService.getAxios().get("/product/count")
            .then(data => {
                return data.data.data.count; // ✅ This value will be passed to the component
            })
            .catch(err => {
                console.error("the error ====", err);
                throw err;
            });
    }
    async getBillCount(): Promise<string> {
        return this.axiosService.getAxios().get("/order/count")
            .then(data => {
                return data.data.data.count; // ✅ This value will be passed to the component
            })
            .catch(err => {
                console.error("the error ====", err);
                throw err;
            });
    }

}