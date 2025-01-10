// src/components/TaxCalculator/TaxTable.jsx
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Trash2, Copy } from 'lucide-react';
import { 
  CURRENCIES, 
  groupEntriesByYear, 
  calculateYearlyTotals, 
  calculateTaxes,
  fetchExchangeRateForDate,
  calculateMonthlyTotals
} from '@/lib/taxCalculator';
import { Alert, AlertDescription } from "@/components/ui/alert";

const TaxTable = ({ entries, settings, onDelete, onEntryChange, onToggleYear }) => {
  const [loading, setLoading] = useState({});
  const [error, setError] = useState('');

  const copyToClipboard = (value) => {
    navigator.clipboard.writeText(value.toFixed(2));
  };

  const updateEntryRate = async (entry, currency = entry.currency, date = entry.date) => {
    if (currency === 'GEL') {
      return { ...entry, currency, rate: 1 };
    }

    setLoading(prev => ({ ...prev, [entry.id]: true }));
    setError('');

    try {
      const rate = await fetchExchangeRateForDate(date, currency);
      if (!rate) throw new Error('Курс не найден');

      const taxes = calculateTaxes(entry.income, currency, rate, settings.taxRate);
      return {
        ...entry,
        currency,
        date,
        rate,
        ...taxes
      };
    } catch (err) {
      setError(`Ошибка загрузки курса для ${currency} на дату ${date}`);
      return entry;
    } finally {
      setLoading(prev => ({ ...prev, [entry.id]: false }));
    }
  };

  const handleEntryChange = async (id, field, value) => {
    const entry = entries.find(e => e.id === id);
    if (!entry) return;

    let updatedEntry = { ...entry, [field]: value };

    if (field === 'currency' || field === 'date') {
      updatedEntry = await updateEntryRate(updatedEntry);
    } else if (field === 'income') {
      const taxes = calculateTaxes(value, entry.currency, entry.rate, settings.taxRate);
      updatedEntry = { ...updatedEntry, ...taxes };
    }

    onEntryChange(entries.map(e => e.id === id ? updatedEntry : e));
  };

  const renderTableRow = (entry, yearEntries) => {
    const accumulatedTotals = calculateMonthlyTotals(yearEntries, entry.date);
    
    return (
      <tr key={entry.id} className="border-b hover:bg-gray-50">
        <td className="p-4">
          <Input
            type="date"
            value={entry.date}
            onChange={(e) => handleEntryChange(entry.id, 'date', e.target.value)}
          />
        </td>
        <td className="p-4">
          <Input
            type="number"
            value={entry.income}
            onChange={(e) => handleEntryChange(entry.id, 'income', e.target.value)}
            className="text-right"
          />
        </td>
        <td className="p-4">
          <Select
            value={entry.currency}
            onChange={(e) => handleEntryChange(entry.id, 'currency', e.target.value)}
            className="w-full"
            disabled={loading[entry.id]}
          >
            {CURRENCIES.map(curr => (
              <option key={curr.code} value={curr.code}>
                {curr.code}
              </option>
            ))}
          </Select>
        </td>
        <td className="p-4 text-right">
          <div className="flex items-center justify-end gap-2">
            {loading[entry.id] ? (
              <span className="text-gray-500">Загрузка...</span>
            ) : (
              <>
                {entry.rate.toFixed(4)}
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => copyToClipboard(entry.rate)}
                >
                  <Copy className="w-4 h-4" />
                </Button>
              </>
            )}
          </div>
        </td>
        <td className="p-4 text-right">
          <div className="flex items-center justify-end gap-2">
            {entry.incomeInGEL.toFixed(2)}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => copyToClipboard(entry.incomeInGEL)}
            >
              <Copy className="w-4 h-4" />
            </Button>
          </div>
        </td>
        <td className="p-4 text-right">
          <div className="flex items-center justify-end gap-2">
            {entry.tax.toFixed(2)}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => copyToClipboard(entry.tax)}
            >
              <Copy className="w-4 h-4" />
            </Button>
          </div>
        </td>
        <td className="p-4 text-right">
          <div className="flex items-center justify-end gap-2">
            {entry.total.toFixed(2)}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => copyToClipboard(entry.total)}
            >
              <Copy className="w-4 h-4" />
            </Button>
          </div>
        </td>
        <td className="p-4 text-right font-semibold bg-gray-50">
          <div className="flex items-center justify-end gap-2">
            {accumulatedTotals.incomeInGEL.toFixed(2)}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => copyToClipboard(accumulatedTotals.incomeInGEL)}
            >
              <Copy className="w-4 h-4" />
            </Button>
          </div>
        </td>
        <td className="p-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onDelete(entry.id)}
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </td>
      </tr>
    );
  };

  return (
    <>
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      
      {Object.entries(groupEntriesByYear(entries))
        .filter(([year]) => !settings.hiddenYears?.includes(year))
        .map(([year, yearEntries]) => {
          const sortedEntries = [...yearEntries].sort((a, b) => new Date(a.date) - new Date(b.date));
          const yearlyTotals = calculateYearlyTotals(yearEntries);
          
          return (
            <div key={year} className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-xl font-bold">{year} год</h3>
                <Button
                  variant="ghost"
                  onClick={() => onToggleYear(year)}
                  className="text-sm"
                >
                  Скрыть год
                </Button>
              </div>
              <div className="relative overflow-x-auto w-full">
                <table className="w-full text-sm text-left border-collapse">
                  <thead className="bg-gray-50">
                    <tr className="border-b">
                      <th className="p-4">Дата</th>
                      <th className="p-4">Сумма</th>
                      <th className="p-4">Валюта</th>
                      <th className="p-4 text-right">Курс</th>
                      <th className="p-4 text-right">Сумма (GEL)</th>
                      <th className="p-4 text-right">Налог ({settings.taxRate}%)</th>
                      <th className="p-4 text-right">За операцию</th>
                      <th className="p-4 text-right">Годовой доход на дату</th>
                      <th className="p-4"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {sortedEntries.map(entry => renderTableRow(entry, sortedEntries))}
                    <tr className="font-bold bg-gray-100">
                      <td className="p-4" colSpan="4">Итого за {year} год:</td>
                      <td className="p-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          {yearlyTotals.incomeInGEL.toFixed(2)}
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => copyToClipboard(yearlyTotals.incomeInGEL)}
                          >
                            <Copy className="w-4 h-4" />
                          </Button>
                        </div>
                      </td>
                      <td className="p-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          {yearlyTotals.tax.toFixed(2)}
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => copyToClipboard(yearlyTotals.tax)}
                          >
                            <Copy className="w-4 h-4" />
                          </Button>
                        </div>
                      </td>
                      <td className="p-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          {yearlyTotals.total.toFixed(2)}
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => copyToClipboard(yearlyTotals.total)}
                          >
                            <Copy className="w-4 h-4" />
                          </Button>
                        </div>
                      </td>
                      <td className="p-4" colSpan="2"></td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          );
        })}
    </>
  );
};

export default TaxTable;
