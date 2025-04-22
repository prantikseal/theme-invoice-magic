
import React from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from "@/components/ui/sonner";

interface LineItem {
  description: string;
  quantity: number;
  rate: number;
}

interface LineItemsProps {
  items: LineItem[];
  currency: string;
  selectedThemeAccent: string;
  onItemsChange: (items: LineItem[]) => void;
}

const LineItems = ({ items, currency, selectedThemeAccent, onItemsChange }: LineItemsProps) => {
  const handleAddLineItem = () => {
    onItemsChange([...items, { description: '', quantity: 1, rate: 0 }]);
  };

  const handleDeleteLineItem = (index: number) => {
    if (items.length === 1) {
      toast.error("You can't remove the last line item");
      return;
    }
    
    const newItems = [...items];
    newItems.splice(index, 1);
    onItemsChange(newItems);
    toast.success("Line item removed");
  };

  const updateLineItem = (index: number, field: keyof LineItem, value: string | number) => {
    const newItems = [...items];
    newItems[index] = { ...newItems[index], [field]: value };
    onItemsChange(newItems);
  };

  const getCurrencySymbol = (currencyCode: string) => {
    switch (currencyCode) {
      case 'USD': return '$';
      case 'EUR': return '€';
      case 'GBP': return '£';
      default: return '$';
    }
  };

  return (
    <div className="mb-8">
      <div className={`p-4 rounded-t-lg grid grid-cols-12 gap-4 ${selectedThemeAccent}`}>
        <div className="col-span-6 font-medium">Item</div>
        <div className="col-span-2 font-medium text-right">Quantity</div>
        <div className="col-span-2 font-medium text-right">Rate</div>
        <div className="col-span-2 font-medium text-right">Amount</div>
      </div>
      
      {items.map((item, index) => (
        <div key={index} className="grid grid-cols-12 gap-4 p-4 border-b">
          <div className="col-span-6 flex items-center gap-2">
            <Button 
              type="button" 
              variant="ghost" 
              size="icon" 
              className="h-7 w-7 text-gray-500 hover:text-red-500"
              onClick={() => handleDeleteLineItem(index)}
              title="Delete line item"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
            <Input
              value={item.description}
              onChange={(e) => updateLineItem(index, 'description', e.target.value)}
              placeholder="Description of item/service..."
            />
          </div>
          <div className="col-span-2">
            <Input
              type="number"
              value={item.quantity}
              onChange={(e) => updateLineItem(index, 'quantity', parseFloat(e.target.value) || 0)}
              className="text-right"
            />
          </div>
          <div className="col-span-2">
            <Input
              type="number"
              value={item.rate}
              onChange={(e) => updateLineItem(index, 'rate', parseFloat(e.target.value) || 0)}
              className="text-right"
            />
          </div>
          <div className="col-span-2 flex items-center justify-end">
            {getCurrencySymbol(currency)} {(item.quantity * item.rate).toFixed(2)}
          </div>
        </div>
      ))}
      
      <Button
        variant="outline"
        size="sm"
        onClick={handleAddLineItem}
        className="mt-4"
      >
        <Plus className="w-4 h-4 mr-2" /> Line Item
      </Button>
    </div>
  );
};

export default LineItems;
