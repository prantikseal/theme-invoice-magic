
import React, { useState } from 'react';
import { jsPDF } from 'jspdf';
import { Download, Plus, Currency } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface LineItem {
  description: string;
  quantity: number;
  rate: number;
}

const InvoiceGenerator = () => {
  const [fromDetails, setFromDetails] = useState('');
  const [toDetails, setToDetails] = useState('');
  const [invoiceNumber, setInvoiceNumber] = useState('1');
  const [date, setDate] = useState('');
  const [paymentTerms, setPaymentTerms] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [poNumber, setPoNumber] = useState('');
  const [lineItems, setLineItems] = useState<LineItem[]>([{ description: '', quantity: 1, rate: 0 }]);
  const [notes, setNotes] = useState('');
  const [terms, setTerms] = useState('');
  const [currency, setCurrency] = useState('USD');
  const [tax, setTax] = useState(0);
  const [amountPaid, setAmountPaid] = useState(0);

  const handleAddLineItem = () => {
    setLineItems([...lineItems, { description: '', quantity: 1, rate: 0 }]);
  };

  const updateLineItem = (index: number, field: keyof LineItem, value: string | number) => {
    const newItems = [...lineItems];
    newItems[index] = { ...newItems[index], [field]: value };
    setLineItems(newItems);
  };

  const calculateSubtotal = () => {
    return lineItems.reduce((sum, item) => sum + (item.quantity * item.rate), 0);
  };

  const calculateTotal = () => {
    const subtotal = calculateSubtotal();
    const taxAmount = (subtotal * tax) / 100;
    return subtotal + taxAmount;
  };

  const calculateBalance = () => {
    return calculateTotal() - amountPaid;
  };

  const handleExportPDF = () => {
    const doc = new jsPDF();
    doc.text('INVOICE', 105, 15, { align: 'center' });
    doc.text(`Invoice #: ${invoiceNumber}`, 20, 30);
    doc.text(`Date: ${date}`, 20, 40);
    doc.text(`From:`, 20, 55);
    doc.text(fromDetails, 20, 65);
    doc.text(`To:`, 20, 85);
    doc.text(toDetails, 20, 95);
    doc.save('invoice.pdf');
  };

  return (
    <div className="container mx-auto p-6 max-w-5xl">
      <div className="bg-white rounded-lg shadow-lg p-8">
        <div className="flex justify-between items-start mb-8">
          <div className="w-1/3">
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center cursor-pointer hover:border-gray-400 transition-colors">
              + Add Your Logo
            </div>
          </div>
          <div className="text-right">
            <h1 className="text-4xl font-light mb-4">INVOICE</h1>
            <div className="flex items-center justify-end gap-2">
              <span className="text-gray-600">#</span>
              <Input
                type="text"
                value={invoiceNumber}
                onChange={(e) => setInvoiceNumber(e.target.value)}
                className="w-24"
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-8 mb-8">
          <div>
            <h2 className="font-medium mb-2">From:</h2>
            <Input
              placeholder="Who is this from?"
              value={fromDetails}
              onChange={(e) => setFromDetails(e.target.value)}
              className="mb-4"
            />
            <h2 className="font-medium mb-2">Bill To:</h2>
            <Input
              placeholder="Who is this to?"
              value={toDetails}
              onChange={(e) => setToDetails(e.target.value)}
            />
          </div>
          <div className="space-y-4">
            <div className="flex justify-end items-center gap-4">
              <label className="text-gray-600">Currency:</label>
              <Select value={currency} onValueChange={setCurrency}>
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
                <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
              </div>
              <div>
                <label className="text-gray-600">Due Date:</label>
                <Input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} />
              </div>
            </div>
            <div>
              <label className="text-gray-600">Payment Terms:</label>
              <Input
                value={paymentTerms}
                onChange={(e) => setPaymentTerms(e.target.value)}
                placeholder="Net 30"
              />
            </div>
            <div>
              <label className="text-gray-600">PO Number:</label>
              <Input value={poNumber} onChange={(e) => setPoNumber(e.target.value)} />
            </div>
          </div>
        </div>

        <div className="mb-8">
          <div className="bg-gray-100 p-4 rounded-t-lg grid grid-cols-12 gap-4">
            <div className="col-span-6 font-medium">Item</div>
            <div className="col-span-2 font-medium text-right">Quantity</div>
            <div className="col-span-2 font-medium text-right">Rate</div>
            <div className="col-span-2 font-medium text-right">Amount</div>
          </div>
          
          {lineItems.map((item, index) => (
            <div key={index} className="grid grid-cols-12 gap-4 p-4 border-b">
              <div className="col-span-6">
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
                {currency} {(item.quantity * item.rate).toFixed(2)}
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

        <div className="grid grid-cols-2 gap-8">
          <div className="space-y-4">
            <div>
              <label className="block text-gray-600 mb-2">Notes:</label>
              <Input
                placeholder="Notes - any relevant information not already covered"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-gray-600 mb-2">Terms:</label>
              <Input
                placeholder="Terms and conditions - late fees, payment methods, delivery schedule"
                value={terms}
                onChange={(e) => setTerms(e.target.value)}
              />
            </div>
          </div>
          <div className="space-y-4">
            <div className="flex justify-between">
              <span className="text-gray-600">Subtotal:</span>
              <span>{currency} {calculateSubtotal().toFixed(2)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Tax:</span>
              <div className="flex items-center gap-2">
                <Input
                  type="number"
                  value={tax}
                  onChange={(e) => setTax(parseFloat(e.target.value) || 0)}
                  className="w-20 text-right"
                />
                <span>%</span>
              </div>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">Total:</span>
              <span className="font-medium">{currency} {calculateTotal().toFixed(2)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Amount Paid:</span>
              <div className="flex items-center gap-2">
                <span>{currency}</span>
                <Input
                  type="number"
                  value={amountPaid}
                  onChange={(e) => setAmountPaid(parseFloat(e.target.value) || 0)}
                  className="w-32 text-right"
                />
              </div>
            </div>
            <div className="flex justify-between font-medium">
              <span>Balance Due:</span>
              <span>{currency} {calculateBalance().toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-8 flex justify-end">
        <Button onClick={handleExportPDF} className="bg-green-500 hover:bg-green-600">
          <Download className="w-4 h-4 mr-2" /> Download PDF
        </Button>
      </div>
    </div>
  );
};

export default InvoiceGenerator;
