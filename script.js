// Smooth scroll and animations
document.addEventListener('DOMContentLoaded', function() {
    // Animate elements on load
    const animateOnLoad = () => {
        const elements = document.querySelectorAll('.logo, .restaurant-name, .social-icon, .nav-button, .day');
        elements.forEach((el, index) => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(20px)';
            setTimeout(() => {
                el.style.transition = 'all 0.6s ease';
                el.style.opacity = '1';
                el.style.transform = 'translateY(0)';
            }, index * 100);
        });
    };

    animateOnLoad();

    // Category selection handler
    const categoryElements = document.querySelectorAll('.day');
    categoryElements.forEach((category, index) => {
        category.addEventListener('click', function() {
            categoryElements.forEach(cat => cat.classList.remove('active'));
            this.classList.add('active');
        });
    });

    // Social icons теперь работают как обычные ссылки
    // Обработчик удален, чтобы не блокировать переходы по ссылкам

    const navButtons = document.querySelectorAll('.nav-button');
    navButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            // Если это реальная ссылка (не "#"), не блокируем переход
            if (href && href !== '#' && !href.startsWith('javascript:')) {
                return; // Позволяем браузеру обработать ссылку
            }
            // Блокируем только для кнопок без реальных ссылок
            e.preventDefault();
            const buttonText = this.querySelector('.button-text').textContent;
            console.log(`Clicked on ${buttonText}`);
        });
    });

    // Feedback Modal
    const feedbackBtn = document.getElementById('feedback-btn');
    const feedbackModal = document.getElementById('feedback-modal');
    const closeModal = document.getElementById('close-modal');
    const feedbackForm = document.getElementById('feedback-form');
    const formStatus = document.getElementById('form-status');
    const submitBtn = document.getElementById('submit-feedback');

    // Open modal
    if (feedbackBtn) {
        feedbackBtn.addEventListener('click', function(e) {
            e.preventDefault();
            feedbackModal.classList.add('active');
            document.body.style.overflow = 'hidden';
        });
    }

    // Close modal
    if (closeModal) {
        closeModal.addEventListener('click', function() {
            feedbackModal.classList.remove('active');
            document.body.style.overflow = '';
            feedbackForm.reset();
            formStatus.style.display = 'none';
        });
    }

    // Close modal on outside click
    feedbackModal.addEventListener('click', function(e) {
        if (e.target === feedbackModal) {
            feedbackModal.classList.remove('active');
            document.body.style.overflow = '';
            feedbackForm.reset();
            formStatus.style.display = 'none';
        }
    });

    // Close modal on Escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && feedbackModal.classList.contains('active')) {
            feedbackModal.classList.remove('active');
            document.body.style.overflow = '';
            feedbackForm.reset();
            formStatus.style.display = 'none';
        }
    });

    // Ограничение ввода только цифрами и знаком + в поле телефона
    const phoneInput = document.getElementById('feedback-phone');
    if (phoneInput) {
        phoneInput.addEventListener('input', function(e) {
            // Удаляем все символы, кроме цифр и знака +
            this.value = this.value.replace(/[^0-9+]/g, '');
        });

        // Предотвращаем вставку нецифровых символов (кроме +)
        phoneInput.addEventListener('paste', function(e) {
            e.preventDefault();
            const pastedText = (e.clipboardData || window.clipboardData).getData('text');
            const digitsAndPlus = pastedText.replace(/[^0-9+]/g, '');
            this.value = digitsAndPlus;
        });

        // Предотвращаем ввод нецифровых символов при нажатии клавиш (кроме +)
        phoneInput.addEventListener('keypress', function(e) {
            // Разрешаем только цифры, знак + и специальные клавиши (Backspace, Delete, Tab, Escape, Enter, стрелки)
            const char = String.fromCharCode(e.which);
            if (!/[0-9+]/.test(char) && !e.ctrlKey && !e.metaKey) {
                e.preventDefault();
            }
        });
    }

    // Submit form
    if (feedbackForm) {
        feedbackForm.addEventListener('submit', async function(e) {
            e.preventDefault();

            const name = document.getElementById('feedback-name').value;
            const phone = document.getElementById('feedback-phone').value;
            const message = document.getElementById('feedback-message').value;

            // Disable submit button
            submitBtn.disabled = true;
            showStatus('loading', 'Отправка...');

            try {
                // Отправляем данные на Vercel serverless function
                const response = await fetch('/api/send-feedback', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        name: name,
                        phone: phone,
                        message: message
                    })
                });

                // Проверяем статус ответа
                if (!response.ok && response.status === 0) {
                    throw new Error('Не удалось подключиться к серверу. Проверьте, что сайт задеплоен на Vercel.');
                }

                // Читаем ответ от сервера
                let data;
                try {
                    const text = await response.text();
                    if (!text) {
                        throw new Error(`Сервер вернул пустой ответ (статус: ${response.status}). Проверьте логи в Vercel.`);
                    }

                    // Пытаемся распарсить как JSON
                    try {
                        data = JSON.parse(text);
                    } catch (jsonError) {
                        // Если не JSON, показываем текст ответа
                        throw new Error(`Сервер вернул неверный формат: ${text.substring(0, 200)}`);
                    }
                } catch (parseError) {
                    if (parseError.message.includes('Сервер вернул')) {
                        throw parseError;
                    }
                    throw new Error(`Ошибка обработки ответа: ${parseError.message}`);
                }

                if (response.ok && data.success) {
                    showStatus('success', '✅ Сообщение успешно отправлено!');
                    feedbackForm.reset();
                    setTimeout(() => {
                        feedbackModal.classList.remove('active');
                        document.body.style.overflow = '';
                        formStatus.style.display = 'none';
                    }, 2000);
                } else {
                    const errorMsg = data.error || data.message || 'Не удалось отправить сообщение';
                    showStatus('error', `Ошибка: ${errorMsg}`);
                }
            } catch (error) {
                console.error('Ошибка отправки формы:', error);
                showStatus('error', `Ошибка отправки: ${error.message}`);
            } finally {
                submitBtn.disabled = false;
            }
        });
    }

    function showStatus(type, message) {
        formStatus.className = `form-status ${type}`;
        formStatus.textContent = message;
        formStatus.style.display = 'block';
    }

    // Parallax effect on scroll
    let lastScroll = 0;
    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;
        const navBackground = document.querySelector('.nav-background');

        if (navBackground) {
            navBackground.style.transform = `translateY(${currentScroll * 0.1}px)`;
        }

        lastScroll = currentScroll;
    });

});

