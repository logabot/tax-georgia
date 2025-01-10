// src/components/TaxCalculator/TaxCalculator.jsx
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import TaxSettings from './TaxSettings';
import TaxTable from './TaxTable';
import TaxControls from './TaxControls';
import { createNewEntry, fetchExchangeRateForDate, calculateTaxes } from '@/lib/taxCalculator';

const STORAGE_KEY = 'taxCalculatorData';

const TaxCalculator = () => {
  const [entries, setEntries] = useState(() => {
    const savedData = localStorage.getItem(STORAGE_KEY);
    if (savedData) {
      const { entries } = JSON.parse(savedData);
      return entries || [];
    }
    return [];
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [settings, setSettings] = useState(() => {
    const savedData = localStorage.getItem(STORAGE_KEY);
    if (savedData) {
      const { settings } = JSON.parse(savedData);
      return settings || {
        defaultCurrency: 'USD',
        taxRate: 1,
        defaultAmount: 0,
        hiddenYears: []
      };
    }
    return {
      defaultCurrency: 'USD',
      taxRate: 1,
      defaultAmount: 0,
      hiddenYears: []
    };
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ entries, settings }));
  }, [entries, settings]);

  const addNewEntry = async () => {
    const date = new Date().toISOString().split('T')[0];
    const newEntry = createNewEntry(entries, settings.defaultCurrency, date);
    
    // Устанавливаем сумму по умолчанию
    newEntry.income = settings.defaultAmount;

    setLoading(true);
    try {
      if (settings.defaultCurrency !== 'GEL') {
        const rate = await fetchExchangeRateForDate(date, settings.defaultCurrency);
        if (!rate) throw new Error('Курс не найден');

        const taxes = calculateTaxes(newEntry.income, settings.defaultCurrency, rate, settings.taxRate);
        newEntry.rate = rate;
        Object.assign(newEntry, taxes);
      } else {
        newEntry.rate = 1;
        const taxes = calculateTaxes(newEntry.income, 'GEL', 1, settings.taxRate);
        Object.assign(newEntry, taxes);
      }

      setEntries([...entries, newEntry]);
      setError('');
    } catch (err) {
      setError(`Ошибка загрузки курса: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleLoadFile = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const loadedData = JSON.parse(e.target.result);
        if (loadedData.entries) {
          setEntries(loadedData.entries);
        }
        if (loadedData.settings) {
          setSettings(loadedData.settings);
        }
        setError('');
      } catch (error) {
        setError('Ошибка чтения файла');
        console.error('Error parsing file:', error);
      }
    };
    reader.readAsText(file);
  };

  const toggleYearVisibility = (year) => {
    const yearStr = year.toString();
    setSettings(prev => ({
      ...prev,
      hiddenYears: prev.hiddenYears.includes(yearStr)
        ? prev.hiddenYears.filter(y => y !== yearStr)
        : [...prev.hiddenYears, yearStr]
    }));
  };

  const handleDelete = (id) => {
    setEntries(entries.filter(entry => entry.id !== id));
  };

  return (
    <div className="w-full p-4">
      <Card className="w-full">
        <CardHeader>
          <TaxSettings 
            settings={settings} 
            onSettingsChange={setSettings} 
          />
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <TaxControls 
              onAdd={addNewEntry}
              onLoad={handleLoadFile}
              loading={loading}
              entries={entries}
              settings={settings}
              onToggleYear={toggleYearVisibility}
            />

            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <TaxTable 
              entries={entries}
              settings={settings}
              onDelete={handleDelete}
              onEntryChange={setEntries}
              onToggleYear={toggleYearVisibility}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TaxCalculator;
