import { Injectable } from "@angular/core";
import { AxiosService } from "../utils/apiInterceptor";

@Injectable({
    providedIn: 'root'
})
export class BillService {

    constructor(private axiosService: AxiosService) {
    }

    getBillFilter(page: number, size: number, keyword: string): Promise<Object> {
        return this.axiosService.getAxios().get(`/order/orders?page=${page}&size=${size}&keyword=${keyword}`)
            .then((data) => {
                return data.data.data;
            })
            .catch(err => {
                console.log(err)
                throw err;
            })
    }

    storeBill(data: any): Promise<void> {
        return this.axiosService.getAxios().post("/order/store", data, {
            responseType: 'blob'
        }).then((data) => {
            console.log("store===", data);
            const blob = new Blob([data.data], { type: 'application/pdf' });

            // Create a link to download it
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = 'invoice.pdf'; // You can change the filename here
            link.click();

            // Cleanup
            window.URL.revokeObjectURL(url);
        })
            .catch(err => {
                console.log(err)
                throw err;
            })
    }

    getBill(data: any): Promise<void> {
        return this.axiosService.getAxios().get(`/pdf/generate/${data}`, {
            responseType: 'blob'
        }).then((data) => {
            console.log("store===", data);
            const blob = new Blob([data.data], { type: 'application/pdf' });

            // Create a link to download it
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = 'invoice.pdf'; // You can change the filename here
            link.click();

            // Cleanup
            window.URL.revokeObjectURL(url);
        })
            .catch(err => {
                console.log(err)
                throw err;
            })
    }

    deleteBill(id:number){
        return this.axiosService.getAxios().delete(`/order/delete/${id}`).then((data)=>{
            console.log("the data=////",data);
            return data;
        }).catch((err)=>{
            console.log(err);
            throw err;
        })
    }
}

