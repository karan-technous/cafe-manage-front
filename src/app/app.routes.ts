import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './auth/login/login.component';
import { NotFoundComponent } from './common/not-found/not-found.component';
import { RegisterComponent } from './auth/register/register.component';
import { AdminHeaderComponent } from './common/admin-header/admin-header.component';
import { DashboardHomeComponent } from './dashboard/dashboard-home/dashboard-home.component';
import { ManageCategoryComponent } from './dashboard/manage-category/manage-category.component';
import { ManageProductComponent } from './dashboard/manage-product/manage-product.component';
import { ManageOrderComponent } from './dashboard/manage-order/manage-order.component';
import { ManageUsersComponent } from './dashboard/manage-users/manage-users.component';
import { ViewBillComponent } from './dashboard/view-bill/view-bill.component';
import { AuthGuard } from './utils/auth.routes';
import { ListineComponent } from './dashboard/listine/listine.component';

export const routes: Routes = [
    {
        path: "",
        component: HomeComponent,
        // canActivate: [AuthGuard],
        pathMatch: 'full'
    },
    {
        path: "login",
        component: LoginComponent,
        canActivate: [AuthGuard],
        pathMatch: 'full'
    },
    {
        path: "register",
        component: RegisterComponent,
        canActivate: [AuthGuard],
        pathMatch: 'full'
    },
    {
        path: "forgot-password",
        component: LoginComponent,
        pathMatch: 'full'
    },
    {
        path: "admin",
        children: [
            {
                path: "dashboard",
                canActivate: [AuthGuard],
                component: DashboardHomeComponent
            },
            {
                path: "manage-category",
                canActivate: [AuthGuard],
                component: ManageCategoryComponent
            },
            {
                path: "manage-product",
                canActivate: [AuthGuard],
                component: ManageProductComponent
            },
            {
                path: "manage-order",
                canActivate: [AuthGuard],
                component: ManageOrderComponent
            },
            {
                path: "manage-users",
                canActivate: [AuthGuard],
                component: ManageUsersComponent
            },
            {
                path: "view-bill",
                canActivate: [AuthGuard],
                component: ViewBillComponent
            },
            {
                path: "listine",
                canActivate: [AuthGuard],
                component: ListineComponent
            },
        ]
    },

    {
        path: "**",
        component: NotFoundComponent,
    },
];
