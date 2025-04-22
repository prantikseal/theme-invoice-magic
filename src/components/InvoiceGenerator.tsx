
import React, { useState } from 'react';
import { jsPDF } from 'jspdf';
import { Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { invoiceThemes, InvoiceTheme } from '@/utils/invoiceThemes';
import InvoiceHeader from './invoice/InvoiceHeader';
import BillingDetails from './invoice/BillingDetails';
import LineItems from './invoice/LineItems';
import InvoiceFooter from './invoice/InvoiceFooter';

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
  const [logo, setLogo] = useState<string | null>(null);
  const [selectedTheme, setSelectedTheme] = useState<InvoiceTheme>(invoiceThemes[0]);

  const calculateSubtotal = () => {
    return lineItems.reduce((sum, item) => sum + (item.quantity * item.rate), 0);
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
    
    if (logo) {
      try {
        doc.addImage(logo, 'JPEG', 20, 15, 40, 30);
      } catch (error) {
        console.error('Error adding logo to PDF:', error);
      }
    }
    
    doc.save('invoice.pdf');
  };

  return (
    <div className="container mx-auto p-6 max-w-5xl">
      <div className={`rounded-lg shadow-lg p-8 ${selectedTheme.background}`}>
        <InvoiceHeader
          logo={logo}
          invoiceNumber={invoiceNumber}
          onLogoChange={setLogo}
          onInvoiceNumberChange={setInvoiceNumber}
          selectedTheme={selectedTheme}
          onThemeChange={setSelectedTheme}
        />

        <BillingDetails
          fromDetails={fromDetails}
          toDetails={toDetails}
          date={date}
          dueDate={dueDate}
          paymentTerms={paymentTerms}
          poNumber={poNumber}
          currency={currency}
          onFromDetailsChange={setFromDetails}
          onToDetailsChange={setToDetails}
          onDateChange={setDate}
          onDueDateChange={setDueDate}
          onPaymentTermsChange={setPaymentTerms}
          onPoNumberChange={setPoNumber}
          onCurrencyChange={setCurrency}
        />

        <LineItems
          items={lineItems}
          currency={currency}
          selectedThemeAccent={selectedTheme.accent}
          onItemsChange={setLineItems}
        />

        <InvoiceFooter
          notes={notes}
          terms={terms}
          tax={tax}
          amountPaid={amountPaid}
          currency={currency}
          subtotal={calculateSubtotal()}
          onNotesChange={setNotes}
          onTermsChange={setTerms}
          onTaxChange={setTax}
          onAmountPaidChange={setAmountPaid}
        />
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
