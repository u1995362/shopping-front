import { CommonModule } from '@angular/common';
import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { firstValueFrom } from 'rxjs';

import { ShoppingApiService } from '../../core/services/shopping-api.service';
import {
  CreateShoppingItemInput,
  ShoppingItem,
} from '../../shared/models/shopping-item.model';

@Component({
  selector: 'app-shopping-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './shopping-list.component.html',
  styleUrl: './shopping-list.component.css',
})
export class ShoppingListComponent implements OnInit {
  private readonly api = inject(ShoppingApiService);

  readonly items = signal<ShoppingItem[]>([]);
  readonly boughtCount = computed(() =>
    this.items().filter((item) => item.checked).length
  );

  newName = '';
  newQuantity = 1;

  ngOnInit(): void {
    void this.loadItems();
  }

  async loadItems(): Promise<void> {
    const items = await firstValueFrom(this.api.getItems());
    this.items.set(items);
  }

  async addItem(): Promise<void> {
    const name = this.newName.trim();

    if (!name) {
      return;
    }

    const payload: CreateShoppingItemInput = {
      name,
      quantity: this.newQuantity,
    };

    await firstValueFrom(this.api.createItem(payload));

    this.newName = '';
    this.newQuantity = 1;

    await this.loadItems();
  }

  async toggleBought(id: string): Promise<void> {
    await firstValueFrom(this.api.toggleItem(id));
    await this.loadItems();
  }

  async removeItem(id: string): Promise<void> {
    await firstValueFrom(this.api.deleteItem(id));
    await this.loadItems();
  }

  async clearBought(): Promise<void> {
    const boughtItems = this.items().filter((item) => item.checked);

    await Promise.all(
      boughtItems.map((item) => firstValueFrom(this.api.deleteItem(item.id)))
    );

    await this.loadItems();
  }

  async clearAll(): Promise<void> {
    const allItems = this.items();

    await Promise.all(
      allItems.map((item) => firstValueFrom(this.api.deleteItem(item.id)))
    );

    await this.loadItems();
  }

  trackById(_: number, item: ShoppingItem): string {
    return item.id;
  }
}