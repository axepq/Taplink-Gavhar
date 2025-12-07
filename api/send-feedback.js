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
    if (!name || !message || !phone) {
      res.status(400).json({ error: 'Имя, телефон и сообщение обязательны' });
      return;
    }

    // Получаем токен бота и Chat ID из переменных окружения
    const botToken = process.env.TELEGRAM_BOT_TOKEN;
    const mainChatId = process.env.TELEGRAM_CHAT_ID;

    if (!botToken) {
      res.status(500).json({
        error: 'Telegram бот не настроен. Проверьте переменные окружения.'
      });
      return;
    }

    // Список всех Chat ID для отправки сообщений
    const chatIds = [];

    // Добавляем основной Chat ID из переменных окружения (если есть)
    if (mainChatId) {
      chatIds.push(mainChatId);
    }

    // Добавляем дополнительные Chat ID
    chatIds.push('1671115929', '7991108616', '191886374');

    // Форматируем сообщение
    const telegramMessage = `📝 <b>Новый отзыв/предложение</b>\n\n` +
      `👤 <b>Имя:</b> ${name}\n` +
      (phone ? `📞 <b>Телефон:</b> ${phone}\n` : '') +
      `💬 <b>Сообщение:</b>\n${message}`;

    // Отправляем сообщение во все чаты
    const sendPromises = chatIds.map(async (chatId) => {
      try {
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

        const text = await response.text();
        if (!text) {
          return { success: false, chatId, error: 'Пустой ответ от Telegram API' };
        }

        const data = JSON.parse(text);
        if (response.ok && data.ok) {
          return { success: true, chatId };
        } else {
          return { success: false, chatId, error: data.description || 'Неизвестная ошибка' };
        }
      } catch (error) {
        return { success: false, chatId, error: error.message };
      }
    });

    // Ждем результаты отправки во все чаты
    const results = await Promise.all(sendPromises);

    // Проверяем, успешно ли отправлено хотя бы в один чат
    const successCount = results.filter(r => r.success).length;

    if (successCount > 0) {
      res.status(200).json({
        success: true,
        message: `Сообщение успешно отправлено в ${successCount} из ${chatIds.length} чатов!`
      });
      return;
    } else {
      res.status(500).json({
        error: 'Не удалось отправить сообщение ни в один чат',
        details: results
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

