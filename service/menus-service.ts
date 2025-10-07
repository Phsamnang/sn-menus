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
  async getAll(): Promise<MenuItem[]> {
    try {
      const response = await axios.get("/api/menu-items");
      if (response.data.status) {
        return response.data.data as MenuItem[];
      } else {
        throw new Error(response.data.message || "Failed to fetch menu items");
      }
    } catch (error: any) {
      console.error("menuItemService.getAll error:", error);
      throw new Error(error.message || "Failed to fetch menu items");
    }
  },
};
