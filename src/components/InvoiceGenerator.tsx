
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

  const getCurrencySymbol = (currencyCode: string) => {
    switch (currencyCode) {
      case 'USD': return '$';
      case 'EUR': return '€';
      case 'GBP': return '£';
      case 'JPY': return '¥';
      case 'CAD': return 'C$';
      case 'AUD': return 'A$';
      case 'CHF': return 'Fr';
      case 'CNY': return '¥';
      case 'INR': return '₹';
      case 'BRL': return 'R$';
      case 'MXN': return '$';
      case 'SGD': return 'S$';
      case 'HKD': return 'HK$';
      case 'KRW': return '₩';
      case 'NZD': return 'NZ$';
      default: return '$';
    }
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
    let yPosition = 20;

    // Set theme colors (simplified for PDF)
    const isColoredTheme = selectedTheme.name !== 'Classic' && selectedTheme.name !== 'Minimal';
    
    // Header
    doc.setFontSize(24);
    doc.setFont('helvetica', 'normal');
    if (isColoredTheme) {
      doc.setTextColor(70, 70, 180); // Blue-ish for colored themes
    } else {
      doc.setTextColor(0, 0, 0);
    }
    doc.text('INVOICE', 105, yPosition, { align: 'center' });
    yPosition += 15;

    // Logo
    if (logo) {
      try {
        doc.addImage(logo, 'JPEG', 20, yPosition, 40, 30);
        yPosition += 35;
      } catch (error) {
        console.error('Error adding logo to PDF:', error);
        yPosition += 10;
      }
    } else {
      yPosition += 10;
    }

    // Invoice details
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);
    doc.text(`Invoice #: ${invoiceNumber}`, 20, yPosition);
    doc.text(`Date: ${date}`, 150, yPosition);
    yPosition += 10;
    doc.text(`Due Date: ${dueDate}`, 150, yPosition);
    yPosition += 15;

    // From details
    doc.setFont('helvetica', 'bold');
    doc.text('From:', 20, yPosition);
    yPosition += 7;
    doc.setFont('helvetica', 'normal');
    const fromLines = fromDetails.split('\n');
    fromLines.forEach(line => {
      doc.text(line, 20, yPosition);
      yPosition += 5;
    });
    yPosition += 10;

    // To details
    doc.setFont('helvetica', 'bold');
    doc.text('Bill To:', 20, yPosition);
    yPosition += 7;
    doc.setFont('helvetica', 'normal');
    const toLines = toDetails.split('\n');
    toLines.forEach(line => {
      doc.text(line, 20, yPosition);
      yPosition += 5;
    });
    yPosition += 15;

    // Payment terms and PO number
    if (paymentTerms) {
      doc.text(`Payment Terms: ${paymentTerms}`, 150, yPosition);
      yPosition += 7;
    }
    if (poNumber) {
      doc.text(`PO Number: ${poNumber}`, 150, yPosition);
      yPosition += 7;
    }
    yPosition += 10;

    // Line items header
    if (isColoredTheme) {
      doc.setFillColor(240, 240, 250); // Light background for colored themes
    } else {
      doc.setFillColor(245, 245, 245); // Light gray for classic themes
    }
    doc.rect(20, yPosition - 5, 170, 10, 'F');
    
    doc.setFont('helvetica', 'bold');
    doc.text('Description', 25, yPosition);
    doc.text('Qty', 120, yPosition);
    doc.text('Rate', 140, yPosition);
    doc.text('Amount', 170, yPosition);
    yPosition += 10;

    // Line items
    doc.setFont('helvetica', 'normal');
    lineItems.forEach(item => {
      const amount = item.quantity * item.rate;
      doc.text(item.description, 25, yPosition);
      doc.text(item.quantity.toString(), 120, yPosition);
      doc.text(`${getCurrencySymbol(currency)}${item.rate.toFixed(2)}`, 140, yPosition);
      doc.text(`${getCurrencySymbol(currency)}${amount.toFixed(2)}`, 170, yPosition);
      yPosition += 7;
    });
    
    yPosition += 10;

    // Totals
    const subtotal = calculateSubtotal();
    const taxAmount = (subtotal * tax) / 100;
    const total = calculateTotal();
    const balance = calculateBalance();

    doc.text('Subtotal:', 140, yPosition);
    doc.text(`${getCurrencySymbol(currency)}${subtotal.toFixed(2)}`, 170, yPosition);
    yPosition += 7;

    if (tax > 0) {
      doc.text(`Tax (${tax}%):`, 140, yPosition);
      doc.text(`${getCurrencySymbol(currency)}${taxAmount.toFixed(2)}`, 170, yPosition);
      yPosition += 7;
    }

    doc.setFont('helvetica', 'bold');
    doc.text('Total:', 140, yPosition);
    doc.text(`${getCurrencySymbol(currency)}${total.toFixed(2)}`, 170, yPosition);
    yPosition += 7;

    if (amountPaid > 0) {
      doc.setFont('helvetica', 'normal');
      doc.text('Amount Paid:', 140, yPosition);
      doc.text(`${getCurrencySymbol(currency)}${amountPaid.toFixed(2)}`, 170, yPosition);
      yPosition += 7;

      doc.setFont('helvetica', 'bold');
      doc.text('Balance Due:', 140, yPosition);
      doc.text(`${getCurrencySymbol(currency)}${balance.toFixed(2)}`, 170, yPosition);
      yPosition += 10;
    }

    // Notes and terms
    if (notes || terms) {
      yPosition += 10;
      if (notes) {
        doc.setFont('helvetica', 'bold');
        doc.text('Notes:', 20, yPosition);
        yPosition += 7;
        doc.setFont('helvetica', 'normal');
        const notesLines = notes.split('\n');
        notesLines.forEach(line => {
          doc.text(line, 20, yPosition);
          yPosition += 5;
        });
        yPosition += 5;
      }

      if (terms) {
        doc.setFont('helvetica', 'bold');
        doc.text('Terms:', 20, yPosition);
        yPosition += 7;
        doc.setFont('helvetica', 'normal');
        const termsLines = terms.split('\n');
        termsLines.forEach(line => {
          doc.text(line, 20, yPosition);
          yPosition += 5;
        });
      }
    }
    
    doc.save(`invoice-${invoiceNumber}.pdf`);
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
