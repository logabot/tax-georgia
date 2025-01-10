// src/components/TaxCalculator/TaxControls.jsx
import React from 'react';
import { Button } from "@/components/ui/button";
import { Save, Upload, Plus, RefreshCw } from 'lucide-react';
import { saveToFile } from '@/lib/taxCalculator';

const TaxControls = ({ onAdd, onLoad, onRefreshRates, loading, entries, settings }) => {
  const handleSave = () => {
    saveToFile(entries, settings);
  };

  return (
    <>
      <div className="flex gap-2 justify-between items-center">
        <div className="flex gap-2">
          <Button onClick={handleSave} className="flex items-center">
            <Save className="w-4 h-4 mr-2" />
            Сохранить
          </Button>
          <Button 
            onClick={() => document.getElementById('file-upload').click()}
            className="flex items-center"
          >
            <Upload className="w-4 h-4 mr-2" />
            Загрузить
          </Button>
          <input
            id="file-upload"
            type="file"
            accept=".json"
            onChange={onLoad}
            className="hidden"
          />
        </div>

        <Button onClick={onAdd} className="flex items-center">
          <Plus className="w-4 h-4 mr-2" />
          Добавить запись
        </Button>
      </div>

      <div className="flex justify-between items-center">
        <Button 
          onClick={onRefreshRates}
          disabled={loading}
          className="flex items-center"
        >
          <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
          Обновить курсы валют
        </Button>
      </div>
    </>
  );
};

export default TaxControls;
