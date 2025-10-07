"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Plus, Upload, X, ArrowLeft } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import Link from "next/link";
import Image from "next/image";

type MenuItem = {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image: string;
};

const categories = [
  "Appetizers",
  "Mains",
  "Salads",
  "Desserts",
  "Beverages",
  "Soups",
  "Sides",
  "Specials",
];

export default function AddMenuPage() {
  const { toast } = useToast();
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    image: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Load existing menu items on component mount
  useState(() => {
    const storedItems = JSON.parse(localStorage.getItem("menuItems") || "[]");
    setMenuItems(storedItems);
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setFormData((prev) => ({
          ...prev,
          image: result,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !formData.name ||
      !formData.description ||
      !formData.price ||
      !formData.category
    ) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const newItem: MenuItem = {
        id: Date.now().toString(),
        name: formData.name,
        description: formData.description,
        price: parseFloat(formData.price),
        category: formData.category,
        image: formData.image || "/placeholder.svg",
      };

      const updatedItems = [...menuItems, newItem];
      setMenuItems(updatedItems);
      localStorage.setItem("menuItems", JSON.stringify(updatedItems));

      // Reset form
      setFormData({
        name: "",
        description: "",
        price: "",
        category: "",
        image: "",
      });

      toast({
        title: "Menu Item Added!",
        description: `${newItem.name} has been added to the menu`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add menu item. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const removeMenuItem = (id: string) => {
    const updatedItems = menuItems.filter((item) => item.id !== id);
    setMenuItems(updatedItems);
    localStorage.setItem("menuItems", JSON.stringify(updatedItems));

    toast({
      title: "Menu Item Removed",
      description: "Item has been removed from the menu",
    });
  };

  const clearImage = () => {
    setFormData((prev) => ({
      ...prev,
      image: "",
    }));
  };

  return (
    <div className="min-h-screen bg-muted/30">
      <header className="bg-card border-b border-border sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/">
                <Button variant="outline" size="sm">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Menu
                </Button>
              </Link>
              <div>
                <h1 className="text-xl sm:text-2xl font-bold">
                  Add Menu Items
                </h1>
                <p className="text-sm text-muted-foreground">
                  Manage your restaurant menu
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="secondary">{menuItems.length} Items</Badge>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6 max-w-4xl">
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Add Menu Form */}
          <div>
            <Card className="p-6">
              <h2 className="text-xl font-bold mb-6">Add New Menu Item</h2>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Item Name */}
                <div className="space-y-2">
                  <Label htmlFor="name">Item Name *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    placeholder="e.g., Grilled Salmon"
                    required
                  />
                </div>

                {/* Description */}
                <div className="space-y-2">
                  <Label htmlFor="description">Description *</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) =>
                      handleInputChange("description", e.target.value)
                    }
                    placeholder="Describe the dish, ingredients, and preparation..."
                    rows={3}
                    required
                  />
                </div>

                {/* Price and Category */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="price">Price ($) *</Label>
                    <Input
                      id="price"
                      type="number"
                      step="0.01"
                      min="0"
                      value={formData.price}
                      onChange={(e) =>
                        handleInputChange("price", e.target.value)
                      }
                      placeholder="0.00"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="category">Category *</Label>
                    <Select
                      value={formData.category}
                      onValueChange={(value) =>
                        handleInputChange("category", value)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((category) => (
                          <SelectItem key={category} value={category}>
                            {category}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Image Upload */}
                <div className="space-y-2">
                  <Label htmlFor="image">Item Image</Label>
                  <div className="space-y-4">
                    {formData.image ? (
                      <div className="relative">
                        <div className="relative w-full h-48 rounded-lg overflow-hidden bg-muted">
                          <Image
                            src={formData.image}
                            alt="Preview"
                            fill
                            className="object-cover"
                          />
                        </div>
                        <Button
                          type="button"
                          variant="destructive"
                          size="sm"
                          className="absolute top-2 right-2"
                          onClick={clearImage}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ) : (
                      <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center">
                        <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                        <p className="text-sm text-muted-foreground mb-2">
                          Upload an image for this item
                        </p>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageUpload}
                          className="hidden"
                          id="image-upload"
                        />
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            document.getElementById("image-upload")?.click()
                          }
                        >
                          Choose Image
                        </Button>
                      </div>
                    )}
                  </div>
                </div>

                <Separator />

                {/* Submit Button */}
                <Button
                  type="submit"
                  className="w-full"
                  disabled={isSubmitting}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  {isSubmitting ? "Adding..." : "Add Menu Item"}
                </Button>
              </form>
            </Card>
          </div>

          {/* Current Menu Items */}
          <div>
            <Card className="p-6">
              <h2 className="text-xl font-bold mb-6">Current Menu Items</h2>

              {menuItems.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <p>No menu items yet</p>
                  <p className="text-sm">Add your first item using the form</p>
                </div>
              ) : (
                <div className="space-y-4 max-h-96 overflow-y-auto">
                  {menuItems.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center gap-3 p-3 border rounded-lg"
                    >
                      <div className="relative w-12 h-12 rounded-md overflow-hidden bg-muted flex-shrink-0">
                        <Image
                          src={item.image}
                          alt={item.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-sm truncate">
                          {item.name}
                        </h3>
                        <p className="text-xs text-muted-foreground truncate">
                          {item.description}
                        </p>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant="outline" className="text-xs">
                            {item.category}
                          </Badge>
                          <span className="text-xs font-semibold">
                            ${item.price.toFixed(2)}
                          </span>
                        </div>
                      </div>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => removeMenuItem(item.id)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
