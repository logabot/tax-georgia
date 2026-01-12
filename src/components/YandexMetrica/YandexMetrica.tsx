import React from 'react';
import { useLocation } from 'react-router-dom';
import { YMInitializer } from 'react-yandex-metrika';

// Замените YOUR_COUNTER_ID на ваш ID счетчика Яндекс Метрики
const YANDEX_METRICA_ID = '106218847';

const YandexMetrica: React.FC = () => {
  const location = useLocation();
  const [isMetricaReady, setIsMetricaReady] = React.useState(false);

  React.useEffect(() => {
    console.log('Yandex Metrica: инициализация');
    
    // Проверяем готовность метрики с несколькими попытками
    let attempts = 0;
    const maxAttempts = 10;
    
    const checkMetrica = setInterval(() => {
      attempts++;
      if (window.ym) {
        console.log('Yandex Metrica: скрипт успешно загружен');
        setIsMetricaReady(true);
        clearInterval(checkMetrica);
      } else if (attempts >= maxAttempts) {
        console.log('Yandex Metrica: достигнут лимит попыток загрузки');
        clearInterval(checkMetrica);
      }
    }, 600);

    return () => clearInterval(checkMetrica);
  }, []);

  React.useEffect(() => {
    if (!isMetricaReady) return;
    
    console.log('Yandex Metrica: отслеживание страницы', location.pathname);
    if (window.ym) {
      window.ym(YANDEX_METRICA_ID, 'hit', location.pathname);
      console.log('Yandex Metrica: hit отправлен для', location.pathname);
    }
  }, [location, isMetricaReady]);

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
