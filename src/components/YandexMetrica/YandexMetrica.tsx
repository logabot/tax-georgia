import React from 'react';
import { useLocation } from 'react-router-dom';
import { YMInitializer } from 'react-yandex-metrika';

// Замените YOUR_COUNTER_ID на ваш ID счетчика Яндекс Метрики
const YANDEX_METRICA_ID = '106218847';

const YandexMetrica: React.FC = () => {
  const location = useLocation();

  React.useEffect(() => {
    console.log('Yandex Metrica: инициализация с ID:', YANDEX_METRICA_ID);
  }, []);

  React.useEffect(() => {
    // Отслеживание переходов между страницами
    console.log('Yandex Metrica: отслеживание страницы', location.pathname);
    if (window.ym) {
      window.ym(YANDEX_METRICA_ID, 'hit', location.pathname);
      console.log('Yandex Metrica: hit отправлен для', location.pathname);
    } else {
      console.warn('Yandex Metrica: window.ym еще не доступен');
    }
  }, [location]);

  return (
    <YMInitializer
      accounts={[Number(YANDEX_METRICA_ID)]}
      options={{
        clickmap: true,
        trackLinks: true,
        accurateTrackBounce: true,
        webvisor: true,
      }}
      version="2"
    />
  );
};

export default YandexMetrica;
