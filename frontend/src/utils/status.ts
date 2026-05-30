export const getStatusStyles = (status: string) => {
  switch (status) {
    case 'Создан':
    case 'Планирование':
      return 'bg-blue-500/5 border-blue-500/20 text-blue-400';
    
    case 'На рассмотрении':
    case 'Тестирование':
    case 'Ожидание оплаты':
      return 'bg-amber-500/5 border-amber-500/20 text-amber-400 animate-pulse';
    
    case 'Одобрен':
    case 'Разработка':
    case 'Оплата получена':
      return 'bg-emerald-500/5 border-emerald-500/20 text-emerald-400';
    
    case 'Завершен':
      return 'bg-purple-500/10 border-purple-500/30 text-purple-400 font-bold';
    
    case 'Отклонен':
      return 'bg-red-500/5 border-red-500/20 text-red-400';
    
    case 'Приостановлен':
    case 'Архивирован':
    default:
      return 'bg-white/5 border-white/10 text-slate-500';
  }
};