// src/utils/taxCalculator.js

export const CURRENCIES = [
  { code: 'GEL', name: 'Грузинский лари' },
  { code: 'USD', name: 'Доллар США' },
  { code: 'EUR', name: 'Евро' },
  { code: 'RUB', name: 'Российский рубль' }
];

export const fetchExchangeRateForDate = async (date, currency) => {
  if (currency === 'GEL') return 1;
  
  const formattedDate = new Date(date).toISOString().split('T')[0];
  
  try {
    const response = await fetch(`https://nbg.gov.ge/gw/api/ct/monetarypolicy/currencies/ka/json?date=${formattedDate}`);
    const data = await response.json();
    
    const currencyData = data[0].currencies.find(curr => curr.code === currency);
    return currencyData ? currencyData.rate : null;
  } catch (error) {
    console.error('Error fetching exchange rate:', error);
    throw error;
  }
};

export const convertToGEL = (amount, currency, rate) => {
  if (currency === 'GEL') return amount;
  return amount * rate;
};

export const calculateTaxes = (income, currency, rate, taxRate) => {
  const incomeInGEL = convertToGEL(parseFloat(income) || 0, currency, rate);
  const tax = incomeInGEL * (taxRate / 100);
  return {
    incomeInGEL,
    tax,
    total: incomeInGEL - tax
  };
};

export const groupEntriesByYear = (entries) => {
  return entries.reduce((acc, entry) => {
    const year = new Date(entry.date).getFullYear();
    if (!acc[year]) acc[year] = [];
    acc[year].push(entry);
    return acc;
  }, {});
};

export const calculateYearlyTotals = (yearEntries) => {
  return yearEntries.reduce((acc, curr) => ({
    incomeInGEL: acc.incomeInGEL + curr.incomeInGEL,
    tax: acc.tax + curr.tax,
    total: acc.total + curr.total
  }), { incomeInGEL: 0, tax: 0, total: 0 });
};

export const createNewEntry = (entries, defaultCurrency, date = new Date().toISOString().split('T')[0]) => {
  const newId = entries.length > 0 ? Math.max(...entries.map(e => e.id)) + 1 : 1;
  
  return {
    id: newId,
    date,
    description: 'Новая запись',
    income: 0,
    currency: defaultCurrency,
    rate: defaultCurrency === 'GEL' ? 1 : 0,
    incomeInGEL: 0,
    tax: 0,
    total: 0
  };
};

export const saveToFile = (entries, settings) => {
  const data = JSON.stringify({
    entries,
    settings,
    savedAt: new Date().toISOString()
  }, null, 2);
  
  const blob = new Blob([data], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  
  const link = document.createElement('a');
  link.href = url;
  link.download = 'tax-calculations.json';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

export const calculateMonthlyTotals = (entries, targetDate) => {
  // Сортируем записи по дате
  const sortedEntries = [...entries].sort((a, b) => new Date(a.date) - new Date(b.date));
  
  // Находим индекс текущей записи
  const currentIndex = sortedEntries.findIndex(entry => entry.date === targetDate);
  
  // Берем все записи до текущей включительно
  const relevantEntries = sortedEntries.slice(0, currentIndex + 1);
  
  // Суммируем значения
  return relevantEntries.reduce((acc, curr) => ({
    income: acc.income + parseFloat(curr.income) || 0,
    incomeInGEL: acc.incomeInGEL + curr.incomeInGEL,
    tax: acc.tax + curr.tax,
    total: acc.total + curr.total
  }), { income: 0, incomeInGEL: 0, tax: 0, total: 0 });
};
