
import React from 'react';
import { Textarea } from "@/components/ui/textarea";
import { Input } from '@/components/ui/input';

interface InvoiceFooterProps {
  notes: string;
  terms: string;
  tax: number;
  amountPaid: number;
  currency: string;
  subtotal: number;
  onNotesChange: (notes: string) => void;
  onTermsChange: (terms: string) => void;
  onTaxChange: (tax: number) => void;
  onAmountPaidChange: (amount: number) => void;
}

const InvoiceFooter = ({
  notes,
  terms,
  tax,
  amountPaid,
  currency,
  subtotal,
  onNotesChange,
  onTermsChange,
  onTaxChange,
  onAmountPaidChange,
}: InvoiceFooterProps) => {
  const getCurrencySymbol = (currencyCode: string) => {
    switch (currencyCode) {
      case 'USD': return '$';
      case 'EUR': return '€';
      case 'GBP': return '£';
      default: return '$';
    }
  };

  const calculateTotal = () => {
    const taxAmount = (subtotal * tax) / 100;
    return subtotal + taxAmount;
  };

  const calculateBalance = () => {
    return calculateTotal() - amountPaid;
  };

  return (
    <div className="grid grid-cols-2 gap-8">
      <div className="space-y-4">
        <div>
          <label className="block text-gray-600 mb-2">Notes:</label>
          <Textarea
            placeholder="Notes - any relevant information not already covered"
            value={notes}
            onChange={(e) => onNotesChange(e.target.value)}
            className="min-h-[100px]"
          />
        </div>
        <div>
          <label className="block text-gray-600 mb-2">Terms:</label>
          <Textarea
            placeholder="Terms and conditions - late fees, payment methods, delivery schedule"
            value={terms}
            onChange={(e) => onTermsChange(e.target.value)}
            className="min-h-[100px]"
          />
        </div>
      </div>
      <div className="space-y-4">
        <div className="flex justify-between">
          <span className="text-gray-600">Subtotal:</span>
          <span>{getCurrencySymbol(currency)} {subtotal.toFixed(2)}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-gray-600">Tax:</span>
          <div className="flex items-center gap-2">
            <Input
              type="number"
              value={tax}
              onChange={(e) => onTaxChange(parseFloat(e.target.value) || 0)}
              className="w-20 text-right"
            />
            <span>%</span>
          </div>
        </div>
        <div className="flex justify-between">
          <span className="font-medium">Total:</span>
          <span className="font-medium">{getCurrencySymbol(currency)} {calculateTotal().toFixed(2)}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-gray-600">Amount Paid:</span>
          <div className="flex items-center gap-2">
            <span>{getCurrencySymbol(currency)}</span>
            <Input
              type="number"
              value={amountPaid}
              onChange={(e) => onAmountPaidChange(parseFloat(e.target.value) || 0)}
              className="w-32 text-right"
            />
          </div>
        </div>
        <div className="flex justify-between font-medium">
          <span>Balance Due:</span>
          <span>{getCurrencySymbol(currency)} {calculateBalance().toFixed(2)}</span>
        </div>
      </div>
    </div>
  );
};

export default InvoiceFooter;
