import axios from "axios";

export const orderService = {
  async create(orderId: number, menuItemId: number, quantity: number, price: number): Promise<any> {
    const response = await axios.post("/api/orders/item", { orderId, menuItemId, quantity, price });
    return response.data.data;
  },
  async getItems(orderId: number): Promise<any> {
    const response = await axios.get(`/api/orders/${orderId}/item`);
    return response.data.data;
  },
  async getOrderItem():Promise<any>{
     const response =await axios.get('/api/service')
     return response.data.data;
     }
};
