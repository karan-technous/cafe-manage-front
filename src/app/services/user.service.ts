import { Injectable } from "@angular/core";
import { AxiosService } from "../utils/apiInterceptor";

@Injectable({
    providedIn: 'root'
})
export class UserService {

    constructor(private axiosService: AxiosService) {
    }

    async getUserAll(): Promise<object> {
        return this.axiosService.getAxios().get("/users?page=1&size=10&keyword=")
            .then(data => {
                console.log("data====",data.data.data)
                return data.data.data
            })
            .catch(err => {
                console.error("the error ====", err);
                throw err;
            });
    }

    async getUserFilter(page:number,size:number,keyword:string):Promise<Object> {
        return this.axiosService.getAxios().get(`/users?page=&size=10&keyword=${keyword}`)
            .then((data)=>{
                return data.data.data;
            })
            .catch(err=>{
                console.log(err)
                throw err;
            })
    }
}