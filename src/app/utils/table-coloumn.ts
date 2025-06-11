export interface TableColumn {
    key: string;
    label: string;
    action?: boolean;
    show?: boolean;
    selected?:true
}

export const CategoryTableColumn: TableColumn[] = [
    { key: 'id', label: 'ID' },
    { key: 'name', label: 'Name',selected:true },
    { key: 'action', label: 'Action', action: true }
];

export const ProductTableColumn: TableColumn[] = [
    { key: 'id', label: 'ID' },
    { key: 'name', label: 'Name',selected:true },
    { key: 'category', label: 'Category' },
    { key: 'price', label: 'Price' },
    { key: 'description', label: 'Description' },
    { key: 'action', label: 'Action', action: true }
];

export const BillTableColumn = [
    { key: 'id', label: 'ID' },
    { key: 'customerName', label: 'Name' ,selected:true},
    { key: 'email', label: 'Email' },
    { key: 'number', label: 'Contact Number' },
    { key: 'payment_option', label: 'Payment Method' },
    { key: 'total', label: 'Total' },
    { key: 'action', label: 'Action', action: true, show:true }
]

export const UserTableColumn = [
    { key: 'id', label: 'ID',},
    { key: 'name', label: 'Name' ,selected:true},
    { key: 'email', label: 'Email' },
    // { key: 'action', label: 'Action', action: true }
]

export const ProductArrayColumn = [
    { key: 'name', label: 'Name' },
    { key: 'category', label: 'Category' },
    { key: 'price', label: 'Price' },
    { key: 'quantity', label: 'Quantity' },
    { key: 'total', label: 'Total' },
    { key: 'action', label: 'Action', action: true }
]