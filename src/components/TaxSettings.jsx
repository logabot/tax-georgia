// src/components/TaxCalculator/TaxSettings.jsx
import React from 'react';
import { CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { CURRENCIES } from '@/lib/taxCalculator';

const TaxSettings = ({ settings, onSettingsChange }) => {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-between items-center">
        <CardTitle className="text-2xl font-bold">
          Калькулятор налогов Грузии
        </CardTitle>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span>Валюта по умолчанию:</span>
            <Select
              value={settings.defaultCurrency}
              onChange={(e) => onSettingsChange({...settings, defaultCurrency: e.target.value})}
              className="w-24"
            >
              {CURRENCIES.map(curr => (
                <option key={curr.code} value={curr.code}>
                  {curr.code}
                </option>
              ))}
            </Select>
          </div>
          <div className="flex items-center gap-2">
            <span>Налоговая ставка (%):</span>
            <Input
              type="number"
              value={settings.taxRate}
              onChange={(e) => onSettingsChange({...settings, taxRate: parseFloat(e.target.value) || 0})}
              className="w-20"
            />
          </div>
          <div className="flex items-center gap-2">
            <span>Сумма по умолчанию:</span>
            <Input
              type="number"
              value={settings.defaultAmount}
              onChange={(e) => onSettingsChange({...settings, defaultAmount: parseFloat(e.target.value) || 0})}
              className="w-28"
            />
          </div>
        </div>
      </div>
      <div className="flex gap-2">
        <span>Скрытые года:</span>
        <div className="flex gap-2">
          {settings.hiddenYears?.map(year => (
            <span 
              key={year}
              className="px-2 py-1 bg-gray-100 rounded-md flex items-center gap-1 cursor-pointer"
              onClick={() => {
                onSettingsChange({
                  ...settings, 
                  hiddenYears: settings.hiddenYears.filter(y => y !== year)
                });
              }}
            >
              {year}
              <span className="text-gray-500">×</span>
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TaxSettings;
