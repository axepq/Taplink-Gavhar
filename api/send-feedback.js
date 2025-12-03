export default async function handler(req, res) {
  // Устанавливаем CORS заголовки
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Content-Type', 'application/json');

  // Обрабатываем OPTIONS запрос для CORS
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // Разрешаем только POST запросы
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  try {
    // Получаем данные из запроса
    let name, phone, message;

    try {
      const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
      name = body.name;
      phone = body.phone;
      message = body.message;
    } catch (parseError) {
      res.status(400).json({ error: 'Неверный формат данных' });
      return;
    }

    // Проверяем обязательные поля
    if (!name || !message) {
      res.status(400).json({ error: 'Имя и сообщение обязательны' });
      return;
    }

    // Получаем токен бота и Chat ID из переменных окружения
    const botToken = process.env.TELEGRAM_BOT_TOKEN;
    const chatId = process.env.TELEGRAM_CHAT_ID;

    if (!botToken || !chatId) {
      res.status(500).json({
        error: 'Telegram бот не настроен. Проверьте переменные окружения.'
      });
      return;
    }

    // Форматируем сообщение
    const telegramMessage = `📝 <b>Новый отзыв/предложение</b>\n\n` +
      `👤 <b>Имя:</b> ${name}\n` +
      (phone ? `📞 <b>Телефон:</b> ${phone}\n` : '') +
      `💬 <b>Сообщение:</b>\n${message}`;

    // Отправляем сообщение в Telegram
    const response = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        chat_id: chatId,
        text: telegramMessage,
        parse_mode: 'HTML'
      })
    });

    // Читаем ответ от Telegram API
    let data;
    try {
      const text = await response.text();
      if (!text) {
        res.status(500).json({
          error: 'Telegram API вернул пустой ответ'
        });
        return;
      }
      data = JSON.parse(text);
    } catch (parseError) {
      res.status(500).json({
        error: 'Ошибка при обработке ответа от Telegram API'
      });
      return;
    }

    if (response.ok && data.ok) {
      res.status(200).json({
        success: true,
        message: 'Сообщение успешно отправлено!'
      });
      return;
    } else {
      res.status(500).json({
        error: data.description || 'Не удалось отправить сообщение'
      });
      return;
    }
  } catch (error) {
    console.error('Ошибка в send-feedback:', error);
    res.status(500).json({
      error: `Ошибка отправки: ${error.message || 'Неизвестная ошибка'}`
    });
    return;
  }
}

