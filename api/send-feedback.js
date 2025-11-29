export default async function handler(req, res) {
  // Разрешаем только POST запросы
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Получаем данные из запроса
  const { name, phone, message } = req.body;

  // Проверяем обязательные поля
  if (!name || !message) {
    return res.status(400).json({ error: 'Имя и сообщение обязательны' });
  }

  // Получаем токен бота и Chat ID из переменных окружения
  const botToken = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  if (!botToken || !chatId) {
    return res.status(500).json({
      error: 'Telegram бот не настроен. Проверьте переменные окружения.'
    });
  }

  // Форматируем сообщение
  const telegramMessage = `📝 <b>Новый отзыв/предложение</b>\n\n` +
    `👤 <b>Имя:</b> ${name}\n` +
    (phone ? `📞 <b>Телефон:</b> ${phone}\n` : '') +
    `💬 <b>Сообщение:</b>\n${message}`;

  try {
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

    const data = await response.json();

    if (response.ok && data.ok) {
      return res.status(200).json({
        success: true,
        message: 'Сообщение успешно отправлено!'
      });
    } else {
      return res.status(500).json({
        error: data.description || 'Не удалось отправить сообщение'
      });
    }
  } catch (error) {
    return res.status(500).json({
      error: `Ошибка отправки: ${error.message}`
    });
  }
}

