
import React from 'react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface BillingDetailsProps {
  fromDetails: string;
  toDetails: string;
  date: string;
  dueDate: string;
  paymentTerms: string;
  poNumber: string;
  currency: string;
  onFromDetailsChange: (value: string) => void;
  onToDetailsChange: (value: string) => void;
  onDateChange: (value: string) => void;
  onDueDateChange: (value: string) => void;
  onPaymentTermsChange: (value: string) => void;
  onPoNumberChange: (value: string) => void;
  onCurrencyChange: (value: string) => void;
}

const BillingDetails = ({
  fromDetails,
  toDetails,
  date,
  dueDate,
  paymentTerms,
  poNumber,
  currency,
  onFromDetailsChange,
  onToDetailsChange,
  onDateChange,
  onDueDateChange,
  onPaymentTermsChange,
  onPoNumberChange,
  onCurrencyChange,
}: BillingDetailsProps) => {
  return (
    <div className="grid grid-cols-2 gap-8 mb-8">
      <div>
        <h2 className="font-medium mb-2">From:</h2>
        <Input
          placeholder="Who is this from?"
          value={fromDetails}
          onChange={(e) => onFromDetailsChange(e.target.value)}
          className="mb-4"
        />
        <h2 className="font-medium mb-2">Bill To:</h2>
        <Input
          placeholder="Who is this to?"
          value={toDetails}
          onChange={(e) => onToDetailsChange(e.target.value)}
        />
      </div>
      <div className="space-y-4">
        <div className="flex justify-end items-center gap-4">
          <label className="text-gray-600">Currency:</label>
          <Select value={currency} onValueChange={onCurrencyChange}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="USD">USD ($)</SelectItem>
              <SelectItem value="EUR">EUR (€)</SelectItem>
              <SelectItem value="GBP">GBP (£)</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-gray-600">Date:</label>
            <Input type="date" value={date} onChange={(e) => onDateChange(e.target.value)} />
          </div>
          <div>
            <label className="text-gray-600">Due Date:</label>
            <Input type="date" value={dueDate} onChange={(e) => onDueDateChange(e.target.value)} />
          </div>
        </div>
        <div>
          <label className="text-gray-600">Payment Terms:</label>
          <Input
            value={paymentTerms}
            onChange={(e) => onPaymentTermsChange(e.target.value)}
            placeholder="Net 30"
          />
        </div>
        <div>
          <label className="text-gray-600">PO Number:</label>
          <Input value={poNumber} onChange={(e) => onPoNumberChange(e.target.value)} />
        </div>
      </div>
    </div>
  );
};

export default BillingDetails;
