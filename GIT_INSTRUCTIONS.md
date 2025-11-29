# Инструкция по отправке проекта в GitHub

Выполните следующие команды в терминале PowerShell или Git Bash:

```bash
# Перейдите в папку проекта
cd "C:\Users\asad0\OneDrive\Рабочий стол\gavhar taplink"

# Инициализируйте git (если еще не сделано)
git init

# Добавьте все файлы
git add .

# Создайте коммит
git commit -m "Initial commit: Gavhar Restaurant Taplink with Vercel integration"

# Переименуйте ветку в main
git branch -M main

# Добавьте remote репозиторий (если еще не добавлен)
git remote add origin https://github.com/Alex2516439780/Taplink-Gavhar.git

# Если remote уже существует, сначала удалите его:
# git remote remove origin
# git remote add origin https://github.com/Alex2516439780/Taplink-Gavhar.git

# Отправьте код в GitHub
git push -u origin main
```

**Примечание:** При первом push GitHub может запросить авторизацию. Используйте Personal Access Token вместо пароля.

## Если возникли проблемы:

1. **Ошибка авторизации:**

   - Создайте Personal Access Token в GitHub Settings → Developer settings → Personal access tokens
   - Используйте токен вместо пароля при push

2. **Remote уже существует:**

   ```bash
   git remote remove origin
   git remote add origin https://github.com/Alex2516439780/Taplink-Gavhar.git
   ```

3. **Конфликт с существующими файлами:**
   ```bash
   git pull origin main --allow-unrelated-histories
   git push -u origin main
   ```
