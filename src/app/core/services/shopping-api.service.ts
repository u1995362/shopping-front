import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {
  CreateShoppingItemInput,
  ShoppingItem,
} from '../../shared/models/shopping-item.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ShoppingApiService {
  private readonly http = inject(HttpClient);

  private readonly baseUrl = environment.apiUrl;

  getItems(): Observable<ShoppingItem[]> {
    return this.http.get<ShoppingItem[]>(`${this.baseUrl}/items`);
  }

  createItem(input: CreateShoppingItemInput): Observable<ShoppingItem> {
    return this.http.post<ShoppingItem>(`${this.baseUrl}/items`, input);
  }

  toggleItem(id: string): Observable<ShoppingItem> {
    return this.http.patch<ShoppingItem>(`${this.baseUrl}/items/${id}/toggle`, {});
  }

  deleteItem(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/items/${id}`);
  }
}