import { Injectable } from '@angular/core';
import { AxiosService } from '../utils/apiInterceptor';

@Injectable({
    providedIn: 'root'
})
export class CategoryService {
    constructor(private axiosService: AxiosService) {}

    getCategoryAll(): Promise<any> {
        return this.axiosService.getAxios().get("/category/categories")
            .then(data => {
                return data.data.data;
            })
            .catch(err => {
                console.error("Error fetching categories:", err);
                throw err;
            });
    }
    getCategoryAllWithoutPagi(): Promise<any> {
        return this.axiosService.getAxios().get("/category/all")
            .then(data => {
                console.log("categoruData=",data.data.data)
                return data.data.data;
            })
            .catch(err => {
                console.error("Error fetching categories:", err);
                throw err;
            });
    }

    getCategoryFilter(page: number, size: number, keyword: string): Promise<any> {
        return this.axiosService.getAxios().get(`/category/categories?page=${page}&size=${size}&keyword=${keyword}`)
            .then(data => {
                return data.data.data;
            })
            .catch(err => {
                console.error("Error filtering categories:", err);
                throw err;
            });
    }

    addCategory(name: string): Promise<any> {
        return this.axiosService.getAxios().post("/category/create", { name })
            .then(data => {
                return data.data;
            })
            .catch(err => {
                console.error("Error adding category:", err);
                throw err;
            });
    }

    updateCategory(id: number, name: string): Promise<any> {
        return this.axiosService.getAxios().post(`/category/update/${id}`, { name })
            .then(data => {
                return data.data;
            })
            .catch(err => {
                console.error("Error updating category:", err);
                throw err;
            });
    }

    deleteCategory(id: number): Promise<any> {
        return this.axiosService.getAxios().delete(`/category/delete/${id}`)
            .then(data => {
                return data.data;
            })
            .catch(err => {
                console.error("Error deleting category:", err);
                throw err;
            });
    }
}