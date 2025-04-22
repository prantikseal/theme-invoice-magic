
import React from 'react';
import { Image, Palette, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { invoiceThemes, InvoiceTheme } from '@/utils/invoiceThemes';

interface InvoiceHeaderProps {
  logo: string | null;
  invoiceNumber: string;
  onLogoChange: (logo: string) => void;
  onInvoiceNumberChange: (number: string) => void;
  selectedTheme: InvoiceTheme;
  onThemeChange: (theme: InvoiceTheme) => void;
}

const InvoiceHeader = ({
  logo,
  invoiceNumber,
  onLogoChange,
  onInvoiceNumberChange,
  selectedTheme,
  onThemeChange
}: InvoiceHeaderProps) => {
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          onLogoChange(event.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSelectLogoClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <div className="flex justify-between items-start mb-8">
      <div className="w-1/3">
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleLogoUpload}
          accept="image/*"
          className="hidden"
        />
        {logo ? (
          <div className="relative group">
            <img src={logo} alt="Company Logo" className="max-h-28 mb-4" />
            <div 
              className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
              onClick={handleSelectLogoClick}
            >
              <span className="text-white text-sm">Change Logo</span>
            </div>
          </div>
        ) : (
          <div 
            className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:border-gray-400 transition-colors flex flex-col items-center justify-center"
            onClick={handleSelectLogoClick}
          >
            <Image className="h-10 w-10 text-gray-400 mb-2" />
            <span className="text-gray-500">Add Your Logo</span>
          </div>
        )}

        <div className="mt-4">
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="w-full">
                <Palette className="h-4 w-4 mr-2" />
                Change Theme
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-64">
              <div className="space-y-2">
                <h3 className="font-medium text-sm mb-2">Select Theme</h3>
                <div className="grid gap-2">
                  {invoiceThemes.map((theme) => (
                    <div
                      key={theme.name}
                      className={`flex items-center justify-between p-2 rounded-md cursor-pointer hover:bg-slate-100 ${
                        selectedTheme.name === theme.name ? 'bg-slate-100' : ''
                      }`}
                      onClick={() => onThemeChange(theme)}
                    >
                      <div className="flex items-center gap-2">
                        <div className={`h-4 w-4 rounded-full ${theme.primary}`}></div>
                        <span>{theme.name}</span>
                      </div>
                      {selectedTheme.name === theme.name && <Check className="h-4 w-4" />}
                    </div>
                  ))}
                </div>
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </div>
      <div className="text-right">
        <h1 className={`text-4xl font-light mb-4 ${
          selectedTheme.headerBackground ? selectedTheme.headerBackground + ' py-2 px-4 rounded' : selectedTheme.text
        }`}>INVOICE</h1>
        <div className="flex items-center justify-end gap-2">
          <span className="text-gray-600">#</span>
          <Input
            type="text"
            value={invoiceNumber}
            onChange={(e) => onInvoiceNumberChange(e.target.value)}
            className="w-24"
          />
        </div>
      </div>
    </div>
  );
};

export default InvoiceHeader;
