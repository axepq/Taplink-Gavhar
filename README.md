# Gavhar Restaurant - Taplink

Современная landing page для ресторана Gavhar с интеграцией Telegram бота для отзывов.

## 📦 Установка и настройка

### Локальная разработка

1. Клонируйте репозиторий:
```bash
git clone https://github.com/Alex2516439780/Taplink-Gavhar.git
cd Taplink-Gavhar
```

2. Для локальной разработки с Vercel установите Vercel CLI:
```bash
npm i -g vercel
```

3. Создайте файл `.env.local`:
```
TELEGRAM_BOT_TOKEN=your_bot_token_here
TELEGRAM_CHAT_ID=your_chat_id_here
```

4. Запустите проект:
```bash
vercel dev
```

## 🚀 Развертывание на Vercel

### 1. Подготовка Telegram бота

1. Создайте бота через [@BotFather](https://t.me/BotFather) в Telegram
2. Получите токен бота (например: `123456789:ABCdefGHIjklMNOpqrsTUVwxyz`)
3. Узнайте свой Chat ID через [@userinfobot](https://t.me/userinfobot) в Telegram

### 2. Развертывание на Vercel

1. Загрузите проект на GitHub
2. Перейдите на [vercel.com](https://vercel.com)
3. Импортируйте ваш репозиторий
4. В настройках проекта добавьте переменные окружения:
   - `TELEGRAM_BOT_TOKEN` - токен вашего Telegram бота
   - `TELEGRAM_CHAT_ID` - ваш Chat ID
5. Нажмите "Deploy"

### 3. Локальная разработка

1. Установите Vercel CLI:
   ```bash
   npm i -g vercel
   ```

2. Создайте файл `.env.local`:
   ```
   TELEGRAM_BOT_TOKEN=your_bot_token_here
   TELEGRAM_CHAT_ID=your_chat_id_here
   ```

3. Запустите проект:
   ```bash
   vercel dev
   ```

## 📁 Структура проекта

```
.
├── api/
│   └── send-feedback.js    # Serverless function для отправки в Telegram
├── img/                    # Изображения
├── index.html              # Главная страница
├── style.css               # Стили
├── script.js               # Клиентский JavaScript
├── vercel.json             # Конфигурация Vercel
└── .env.example            # Пример переменных окружения
```

## 🔒 Безопасность

Токен бота и Chat ID хранятся в переменных окружения Vercel и не видны в клиентском коде.

## 📝 Функции

- ✅ Красивый дизайн в стиле liquid glass
- ✅ Интеграция с Яндекс.Картами
- ✅ Модальное окно для отзывов и предложений
- ✅ Отправка отзывов в Telegram бота
- ✅ Адаптивный дизайн
- ✅ Анимации и эффекты

