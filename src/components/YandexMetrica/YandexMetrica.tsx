import React from 'react';
import { useLocation } from 'react-router-dom';
import { YMInitializer } from 'react-yandex-metrika';

// Замените YOUR_COUNTER_ID на ваш ID счетчика Яндекс Метрики
const YANDEX_METRICA_ID = '106218847';

const YandexMetrica: React.FC = () => {
  const location = useLocation();
  const [isMetricaReady, setIsMetricaReady] = React.useState(false);

  React.useEffect(() => {
    console.log('========== YANDEX METRICA DEBUG ==========');
    console.log('window.ym сразу:', window.ym);
    console.log('window.Ya:', (window as any).Ya);
    console.log('window.Ya.Metrika:', (window as any).Ya?.Metrika);
    console.log('Все скрипты на странице:', Array.from(document.scripts).map(s => s.src));
    
    // Проверяем готовность метрики с несколькими попытками
    let attempts = 0;
    const maxAttempts = 30;
    
    const checkMetrica = setInterval(() => {
      attempts++;
      console.log(`[Попытка ${attempts}/${maxAttempts}] Проверка window.ym и Ya.Metrika...`);
      console.log('window.ym:', window.ym);
      console.log('window.Ya?.Metrika:', (window as any).Ya?.Metrika);
      console.log('window.Ya?.Metrika2:', (window as any).Ya?.Metrika2);
      
      // Проверяем и window.ym и Ya.Metrika
      const hasYm = !!window.ym;
      const hasYaMetrika = !!(window as any).Ya?.Metrika || !!(window as any).Ya?.Metrika2;
      
      if (hasYm || hasYaMetrika) {
        console.log('✅ Yandex Metrica: скрипт обнаружен после', attempts, 'попыток');
        console.log('window.ym доступен:', hasYm);
        console.log('Ya.Metrika доступен:', hasYaMetrika);
        setIsMetricaReady(true);
        clearInterval(checkMetrica);
      } else if (attempts >= maxAttempts) {
        console.error('❌ Yandex Metrica: достигнут лимит попыток загрузки');
        console.log('Проверьте:');
        console.log('3. Отключите блокировщики рекламы (AdBlock, uBlock и т.д.)');
        console.log('4. Проверьте доступность mc.yandex.ru в DevTools → Network');
        clearInterval(checkMetrica);
      }
    }, 500);

    return () => clearInterval(checkMetrica);
  }, []);

  React.useEffect(() => {
    if (!isMetricaReady) return;
    
    console.log('Yandex Metrica: отслеживание страницы', location.pathname);
    
    // Пробуем использовать window.ym
    if (window.ym) {
      window.ym(YANDEX_METRICA_ID, 'hit', location.pathname);
      console.log('✅ Yandex Metrica: hit отправлен через window.ym для', location.pathname);
    } 
    // Если window.ym нет, используем Ya.Metrika напрямую
    else if ((window as any).Ya?.Metrika2) {
      const metrikaInstance = new (window as any).Ya.Metrika2(Number(YANDEX_METRICA_ID), {
        clickmap: true,
        trackLinks: true,
        accurateTrackBounce: true,
        webvisor: true
      });
      metrikaInstance.hit(location.pathname);
      console.log('✅ Yandex Metrica: hit отправлен через Ya.Metrika2 для', location.pathname);
    }
    else {
      console.warn('⚠️ Yandex Metrica: ни window.ym, ни Ya.Metrika2 не доступны');
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
