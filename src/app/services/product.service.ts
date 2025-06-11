import { Injectable } from "@angular/core";
import { AxiosService } from "../utils/apiInterceptor";

interface Category {
    id: number;
    name: string;
}

export interface Product {
    id?: number;
    name: string;
    category: string;
    price: string;
    description: string;
    categoryId?: number;
}

interface OrderDetails {
    id: number;
    customerName: string;
    email: string;
    number: string;
    payment_option: string;
    product_id: string;
    quantity: string;
    total: string;
}

interface OrderResponse {
    timestamp: string;
    data: OrderDetails;
    error: any;
}

@Injectable({
    providedIn: 'root'
})
export class ProductService {

    constructor(private axiosService: AxiosService) {
    }

    async getCategories(): Promise<Category[]> {
        console.log('Fetching categories...');
        return this.axiosService.getAxios().get("/category/all")
            .then(data => {
                console.log("Categories response:", data.data);
                return data.data.data as Category[];
            })
            .catch(err => {
                console.error("Error fetching categories:", err);
                throw err;
            });
    }

    async getProductAll(): Promise<object> {
        return this.axiosService.getAxios().get("/product/products")
            .then(data => {
                console.log("data====", data.data.data)
                return data.data.data
            })
            .catch(err => {
                console.error("the error ====", err);
                throw err;
            });
    }
      async getProductAllNew(): Promise<object> {
        return this.axiosService.getAxios().get("/product/all")
            .then(data => {
                console.log("data====", data.data.data)
                return data.data.data
            })
            .catch(err => {
                console.error("the error ====", err);
                throw err;
            });
    }

    async getProductFilter(page: number, size: number, keyword: string): Promise<Object> {
        return this.axiosService.getAxios().get(`/product/products?page=${page}&size=${size}&keyword=${keyword}`)
            .then((data) => {
                console.log("first=", data)
                return data.data.data;
            })
            .catch(err => {
                console.log(err)
                throw err;
            })
    }

    async deleteProduct(id: number): Promise<Object> {
        return this.axiosService.getAxios().delete(`/product/delete/${id}`)
            .then((data) => {
                return data.data;
            })
            .catch(err => {
                console.error("Error deleting product:", err);
                throw err;
            });
    }

    async deleteCategory(id: number): Promise<Object> {
        return this.axiosService.getAxios().delete(`/category/delete/${id}`)
            .then((data) => {
                return data.data;
            })
            .catch(err => {
                console.error("Error deleting category:", err);
                throw err;
            });
    }

    async getOrderDetails(orderId: number): Promise<OrderDetails> {
        return this.axiosService.getAxios().get(`/order/${orderId}`)
            .then(response => {
                console.log("Order details response:", response.data);
                return response.data.data as OrderDetails;
            })
            .catch(err => {
                console.error("Error fetching order details:", err);
                throw err;
            });
    }

    async addProduct(product: Product): Promise<Object> {
        return this.axiosService.getAxios().post("/product/create", product)
            .then((data) => {
                console.log("the data======",data)
                return data.data;
            })
            .catch(err => {
                console.error("Error adding product:", err);
                throw err;
            });
    }

    async updateProduct(id: number, product: Product): Promise<Object> {
        return this.axiosService.getAxios().post(`/product/update/${id}`, product)
            .then((data) => {
                return data.data;
            })
            .catch(err => {
                console.error("Error updating product:", err);
                throw err;
            });
    }

    async getProductByCategory(categoryId: number): Promise<Product[]> {
        return this.axiosService.getAxios().get(`/product/getByCategory/${categoryId}`)
            .then((data) => {
                console.log("Products by category:", data);
                return data.data.data.map((item: any) => ({
                    id: item.id,
                    name: item.name,
                    category: item.category,
                    price: item.price,
                    description: item.description,
                    categoryId: Number(item.category)
                }));
            })
            .catch(err => {
                console.error("Error fetching products by category:", err);
                throw err;
            });
    }
}