import axios from "axios";

export interface MenuItem {
    id: number;
  name: string;
  description: string;
  price: number;
  category: string;
  image?: string | null;
}

export const menuItemService = {
  // Fetch all menu items
  async getAll(): Promise<any> {
    try {
      const response = await axios.get("/api/menu-items");
        return response.data.data;
      
    } catch (error: any) {
      console.error("menuItemService.getAll error:", error);
      throw new Error(error.message || "Failed to fetch menu items");
    }
  },
  async create(tableId: number): Promise<any> {
    const response = await axios.post("/api/orders", { tableId });
    return response.data.data;
  }
};
