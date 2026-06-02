export interface ShoppingItem {
  id: string;
  name: string;
  quantity: number;
  checked: boolean;
  createdAt?: string;
}

export interface CreateShoppingItemInput {
  name: string;
  quantity: number;
}