// ===== ПЕРЕКЛЮЧЕНИЕ ТЕМЫ =====
document.addEventListener('DOMContentLoaded', function() {
    const themeToggle = document.getElementById('theme-toggle');
    
    if (themeToggle) {
        const themeIcon = themeToggle.querySelector('i');
        const themeText = themeToggle.querySelector('span');
        
        // Проверяем сохраненную тему в localStorage
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme === 'dark') {
            document.body.classList.add('dark');
            if (themeIcon) themeIcon.className = 'fas fa-moon';
            if (themeText) themeText.textContent = 'Тёмная';
        }
        
        // Обработчик переключения темы
        themeToggle.addEventListener('click', () => {
            document.body.classList.toggle('dark');
            
            if (document.body.classList.contains('dark')) {
                if (themeIcon) themeIcon.className = 'fas fa-moon';
                if (themeText) themeText.textContent = 'Тёмная';
                localStorage.setItem('theme', 'dark');
            } else {
                if (themeIcon) themeIcon.className = 'fas fa-sun';
                if (themeText) themeText.textContent = 'Светлая';
                localStorage.setItem('theme', 'light');
            }
        });
    }
    
    // ===== АНИМАЦИЯ ПОЯВЛЕНИЯ ЭЛЕМЕНТОВ =====
    const fadeElements = document.querySelectorAll('.fade-in');
    
    const fadeInOnScroll = () => {
        fadeElements.forEach(element => {
            const elementTop = element.getBoundingClientRect().top;
            const windowHeight = window.innerHeight;
            
            if (elementTop < windowHeight - 100) {
                element.classList.add('visible');
            }
        });
    };
    
    window.addEventListener('load', fadeInOnScroll);
    window.addEventListener('scroll', fadeInOnScroll);
    
    // ===== ПЛАВНЫЙ СКРОЛЛ =====
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
    
    // ===== ЭФФЕКТ ПАРАЛЛАКСА =====
    const hero = document.querySelector('.hero');
    if (hero) {
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            hero.style.backgroundPositionY = scrolled * 0.5 + 'px';
        });
    }
    
    // ===== АНИМАЦИЯ ДЛЯ КАРТОЧЕК СОВЕТОВ =====
    const tipCards = document.querySelectorAll('.tip-card');
    tipCards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            const icon = card.querySelector('.tip-icon');
            if (icon) {
                icon.style.transform = 'scale(1.1)';
                icon.style.transition = 'transform 0.3s';
            }
        });
        
        card.addEventListener('mouseleave', () => {
            const icon = card.querySelector('.tip-icon');
            if (icon) {
                icon.style.transform = 'scale(1)';
            }
        });
    });
    
    // ===== ФИЛЬТРЫ ДЛЯ ИГР И ПРИЛОЖЕНИЙ =====
    console.log('Инициализация фильтров...');
    
    const gamesGrid = document.querySelector('.games-grid');
    const gameCards = document.querySelectorAll('.game-card');
    const filterToggle = document.getElementById('filtersToggle');
    const filtersPanel = document.getElementById('filtersPanel');
    const filterBtns = document.querySelectorAll('.filter-btn');
    const filterTags = document.querySelectorAll('.filter-tag');
    const resetBtn = document.getElementById('resetFilters');
    
    console.log('Найдено карточек:', gameCards.length);
    console.log('Найдено кнопок фильтров:', filterBtns.length);
    
    // Проверяем, есть ли карточки
    if (gameCards.length > 0) {
        // Проверяем и добавляем data-атрибуты если их нет
        gameCards.forEach((card, index) => {
            if (!card.dataset.type) {
                const title = card.querySelector('h3')?.textContent || '';
                if (title.includes('Tack') || title.includes('Приложение')) {
                    card.dataset.type = 'app';
                } else {
                    card.dataset.type = 'game';
                }
            }
            
            if (!card.dataset.tags) {
                const tags = [];
                card.querySelectorAll('.game-tags span').forEach(span => {
                    tags.push(span.textContent.toLowerCase());
                });
                card.dataset.tags = tags.join(' ');
            }
            
            console.log(`Карточка ${index}:`, {
                type: card.dataset.type,
                tags: card.dataset.tags,
                title: card.querySelector('h3')?.textContent
            });
        });
        
        // Функция обновления счетчиков
        function updateCounts() {
            const totalGames = document.querySelectorAll('[data-type="game"]').length;
            const totalApps = document.querySelectorAll('[data-type="app"]').length;
            const totalAll = gameCards.length;
            
            filterBtns.forEach(btn => {
                const filter = btn.dataset.filter;
                const countSpan = btn.querySelector('.filter-count');
                
                if (countSpan) {
                    if (filter === 'all') countSpan.textContent = totalAll;
                    if (filter === 'game') countSpan.textContent = totalGames;
                    if (filter === 'app') countSpan.textContent = totalApps;
                }
            });
            
            console.log('Счетчики обновлены:', { totalAll, totalGames, totalApps });
        }
        
        // Переменные для активных фильтров
        let activeFilter = 'all';
        let activeTags = [];
        
        // Функция фильтрации
        function filterCards() {
            console.log('Фильтрация:', { activeFilter, activeTags });
            
            let visibleCount = 0;
            
            gameCards.forEach(card => {
                const cardType = card.dataset.type;
                const cardTags = card.dataset.tags ? card.dataset.tags.split(' ') : [];
                
                let typeMatch = activeFilter === 'all' || cardType === activeFilter;
                
                let tagMatch = activeTags.length === 0;
                if (!tagMatch) {
                    tagMatch = activeTags.some(tag => cardTags.includes(tag));
                }
                
                if (typeMatch && tagMatch) {
                    card.classList.remove('hidden');
                    visibleCount++;
                } else {
                    card.classList.add('hidden');
                }
            });
            
            console.log('Видимых карточек:', visibleCount);
            
            showResultsMessage(visibleCount);
            animateVisibleCards();
        }
        
        // Сообщение о результатах
        function showResultsMessage(count) {
            const oldMessage = document.querySelector('.filter-results');
            if (oldMessage) oldMessage.remove();
            
            if (count === gameCards.length) return;
            
            const message = document.createElement('div');
            message.className = 'filter-results fade-in';
            
            if (count === 0) {
                message.innerHTML = '😕 Ничего не найдено. <button class="reset-inline" style="background:none; border:none; color:var(--accent); text-decoration:underline; cursor:pointer;">Сбросить фильтры</button>';
                message.querySelector('.reset-inline').addEventListener('click', resetAllFilters);
            } else {
                const word = getWordForm(count, ['проект', 'проекта', 'проектов']);
                message.innerHTML = `Найдено <span>${count}</span> ${word}`;
            }
            
            if (gamesGrid) {
                gamesGrid.parentNode.insertBefore(message, gamesGrid.nextSibling);
            }
        }
        
        // Склонение слов
        function getWordForm(number, words) {
            const cases = [2, 0, 1, 1, 1, 2];
            return words[(number % 100 > 4 && number % 100 < 20) ? 2 : cases[Math.min(number % 10, 5)]];
        }
        
        // Анимация видимых карточек
        function animateVisibleCards() {
            const visibleCards = document.querySelectorAll('.game-card:not(.hidden)');
            
            visibleCards.forEach((card, index) => {
                card.style.animation = 'none';
                card.offsetHeight;
                card.style.animation = `fadeInUp 0.5s ease forwards ${index * 0.1}s`;
            });
        }
        
        // Сброс всех фильтров
        function resetAllFilters() {
            console.log('Сброс фильтров');
            
            filterBtns.forEach(btn => {
                if (btn.dataset.filter === 'all') {
                    btn.classList.add('active');
                } else {
                    btn.classList.remove('active');
                }
            });
            
            filterTags.forEach(tag => tag.classList.remove('active'));
            
            activeFilter = 'all';
            activeTags = [];
            
            filterCards();
        }
        
        // Обработчики для кнопок фильтров
        filterBtns.forEach(btn => {
            btn.addEventListener('click', function(e) {
                e.preventDefault();
                console.log('Клик по фильтру:', this.dataset.filter);
                
                filterBtns.forEach(b => b.classList.remove('active'));
                this.classList.add('active');
                
                activeFilter = this.dataset.filter;
                filterCards();
            });
        });
        
        // Обработчики для тегов
        filterTags.forEach(tag => {
            tag.addEventListener('click', function(e) {
                e.preventDefault();
                const tagValue = this.dataset.tag;
                console.log('Клик по тегу:', tagValue);
                
                if (this.classList.contains('active')) {
                    this.classList.remove('active');
                    activeTags = activeTags.filter(t => t !== tagValue);
                } else {
                    this.classList.add('active');
                    activeTags.push(tagValue);
                }
                
                filterCards();
            });
        });
        
        // Обработчик для кнопки сброса
        if (resetBtn) {
            resetBtn.addEventListener('click', function(e) {
                e.preventDefault();
                resetAllFilters();
            });
        }
        
        // Обработчик для сворачивания панели фильтров
        if (filterToggle && filtersPanel) {
            filterToggle.addEventListener('click', function(e) {
                e.preventDefault();
                filtersPanel.classList.toggle('collapsed');
                const icon = this.querySelector('i');
                
                if (filtersPanel.classList.contains('collapsed')) {
                    icon.className = 'fas fa-chevron-down';
                } else {
                    icon.className = 'fas fa-chevron-up';
                }
            });
        }
        
        // Инициализация
        updateCounts();
        
        setTimeout(() => {
            filterCards();
            console.log('Фильтры инициализированы');
        }, 100);
    }
});

// ===== КОПИРОВАНИЕ EMAIL =====
function copyEmail() {
    const email = 'ottodenis702@gmail.com';
    navigator.clipboard.writeText(email).then(() => {
        const badge = document.getElementById('copyBadge');
        if (badge) {
            badge.classList.add('show');
            setTimeout(() => badge.classList.remove('show'), 2000);
        } else {
            alert('Email скопирован: ' + email);
        }
    }).catch(() => {
        alert('Email: ' + email);
    });
}


// ===== КАСТОМНЫЙ КУРСОР =====
if (window.innerWidth > 768) {
    // Создаем элементы курсора
    const cursor = document.createElement('div');
    cursor.className = 'custom-cursor';
    document.body.appendChild(cursor);
    
    const follower = document.createElement('div');
    follower.className = 'cursor-follower';
    document.body.appendChild(follower);
    
    let mouseX = 0, mouseY = 0;
    let cursorX = 0, cursorY = 0;
    let followerX = 0, followerY = 0;
    
    // Обновляем позицию мыши
    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });
    
    // Плавное движение курсора
    function animateCursor() {
        // Основной курсор двигается мгновенно
        cursorX += (mouseX - cursorX) * 0.5;
        cursorY += (mouseY - cursorY) * 0.5;
        
        // Внешнее кольцо двигается с задержкой
        followerX += (mouseX - followerX) * 0.2;
        followerY += (mouseY - followerY) * 0.2;
        
        cursor.style.left = cursorX + 'px';
        cursor.style.top = cursorY + 'px';
        
        follower.style.left = followerX + 'px';
        follower.style.top = followerY + 'px';
        
        requestAnimationFrame(animateCursor);
    }
    
    animateCursor();
    
    // Скрываем курсор при уходе с окна
    document.addEventListener('mouseleave', () => {
        cursor.style.opacity = '0';
        follower.style.opacity = '0';
    });
    
    document.addEventListener('mouseenter', () => {
        cursor.style.opacity = '1';
        follower.style.opacity = '1';
    });
}


// Консольное приветствие
console.log('🍕 Сайт HoseGame создан с любовью к играм и JavaScript!');
console.log('👨‍💻 Разработчик: Денис');