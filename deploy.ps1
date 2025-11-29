# Скрипт для отправки проекта в GitHub репозиторий

Write-Host "Инициализация git репозитория..." -ForegroundColor Green
git init

Write-Host "Добавление всех файлов..." -ForegroundColor Green
git add .

Write-Host "Создание коммита..." -ForegroundColor Green
git commit -m "Initial commit: Gavhar Restaurant Taplink with Vercel integration"

Write-Host "Переименование ветки в main..." -ForegroundColor Green
git branch -M main

Write-Host "Добавление remote репозитория..." -ForegroundColor Green
git remote add origin https://github.com/Alex2516439780/Taplink-Gavhar.git

Write-Host "Отправка в GitHub..." -ForegroundColor Green
git push -u origin main

Write-Host "Готово! Проект успешно отправлен в репозиторий." -ForegroundColor Green

