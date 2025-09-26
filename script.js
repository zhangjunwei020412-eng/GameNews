// 游戏新闻网站交互功能

document.addEventListener('DOMContentLoaded', function() {
    // 初始化所有功能
    initNavigation();
    initGameCards();
    initSearch();
    initScrollEffects();
    initAnimations();
});

// 导航功能
function initNavigation() {
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('.game-category, .hero-section');
    
    // 平滑滚动到对应部分
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            const targetSection = document.getElementById(targetId);
            
            if (targetSection) {
                targetSection.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
            
            // 更新活动状态
            navLinks.forEach(l => l.classList.remove('active'));
            this.classList.add('active');
        });
    });
    
    // 滚动时更新导航状态
    window.addEventListener('scroll', function() {
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (scrollY >= (sectionTop - 200)) {
                current = section.getAttribute('id');
            }
        });
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === '#' + current) {
                link.classList.add('active');
            }
        });
    });
}

// 游戏卡片功能
function initGameCards() {
    const gameCards = document.querySelectorAll('.game-card[data-url]');
    
    gameCards.forEach(card => {
        // 点击卡片跳转到官网
        card.addEventListener('click', function() {
            const gameUrl = this.getAttribute('data-url');
            if (gameUrl) {
                // 添加点击动画
                this.style.transform = 'scale(0.95)';
                setTimeout(() => {
                    this.style.transform = '';
                    window.open(gameUrl, '_blank');
                }, 150);
            }
        });
        
        // 悬停效果增强
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-8px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });
    
    // 浮动卡片的交互
    const floatingCards = document.querySelectorAll('.game-card.floating');
    floatingCards.forEach(card => {
        card.addEventListener('click', function() {
            const gameType = this.getAttribute('data-game');
            const targetSection = getTargetSection(gameType);
            if (targetSection) {
                targetSection.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// 根据游戏类型获取目标部分
function getTargetSection(gameType) {
    const gameCategoryMap = {
        'cf': 'fps',
        'apex': 'fps',
        'valorant': 'fps',
        'yanyun': 'mmo',
        'blade3': 'mmo',
        'tianlong': 'mmo',
        'tft': 'strategy',
        'clash': 'strategy',
        'hearthstone': 'strategy'
    };
    
    const category = gameCategoryMap[gameType];
    return category ? document.getElementById(category) : null;
}

// 搜索功能
function initSearch() {
    const searchInput = document.querySelector('.search-input');
    const searchBtn = document.querySelector('.search-btn');
    const gameCards = document.querySelectorAll('.game-card[data-game]');
    
    // 搜索功能
    function performSearch(query) {
        const searchTerm = query.toLowerCase().trim();
        
        gameCards.forEach(card => {
            const gameName = card.querySelector('h3').textContent.toLowerCase();
            const gameDescription = card.querySelector('p').textContent.toLowerCase();
            const gameTags = Array.from(card.querySelectorAll('.tag')).map(tag => tag.textContent.toLowerCase());
            
            const isMatch = gameName.includes(searchTerm) || 
                          gameDescription.includes(searchTerm) || 
                          gameTags.some(tag => tag.includes(searchTerm));
            
            if (isMatch) {
                card.style.display = 'block';
                card.style.animation = 'fadeInUp 0.5s ease-out';
            } else {
                card.style.display = 'none';
            }
        });
        
        // 显示搜索结果统计
        const visibleCards = Array.from(gameCards).filter(card => card.style.display !== 'none');
        showSearchResults(visibleCards.length, searchTerm);
    }
    
    // 搜索按钮点击
    searchBtn.addEventListener('click', function() {
        performSearch(searchInput.value);
    });
    
    // 输入框回车搜索
    searchInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            performSearch(this.value);
        }
    });
    
    // 实时搜索
    searchInput.addEventListener('input', function() {
        if (this.value.length > 2) {
            performSearch(this.value);
        } else if (this.value.length === 0) {
            // 清空搜索，显示所有卡片
            gameCards.forEach(card => {
                card.style.display = 'block';
                card.style.animation = 'fadeInUp 0.5s ease-out';
            });
            hideSearchResults();
        }
    });
}

// 显示搜索结果
function showSearchResults(count, searchTerm) {
    let resultsDiv = document.getElementById('search-results');
    if (!resultsDiv) {
        resultsDiv = document.createElement('div');
        resultsDiv.id = 'search-results';
        resultsDiv.style.cssText = `
            position: fixed;
            top: 80px;
            left: 50%;
            transform: translateX(-50%);
            background: white;
            padding: 12px 24px;
            border-radius: 25px;
            box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
            z-index: 1000;
            font-size: 14px;
            color: #6e6e73;
        `;
        document.body.appendChild(resultsDiv);
    }
    
    resultsDiv.textContent = `找到 ${count} 个关于 "${searchTerm}" 的结果`;
    resultsDiv.style.display = 'block';
    
    // 3秒后自动隐藏
    setTimeout(() => {
        resultsDiv.style.display = 'none';
    }, 3000);
}

// 隐藏搜索结果
function hideSearchResults() {
    const resultsDiv = document.getElementById('search-results');
    if (resultsDiv) {
        resultsDiv.style.display = 'none';
    }
}

// 滚动效果
function initScrollEffects() {
    // 导航栏背景透明度
    const navbar = document.querySelector('.navbar');
    
    window.addEventListener('scroll', function() {
        const scrolled = window.pageYOffset;
        const opacity = Math.min(scrolled / 100, 1);
        
        navbar.style.background = `rgba(255, 255, 255, ${0.95 - opacity * 0.1})`;
    });
    
    // 视差滚动效果
    const heroVisual = document.querySelector('.hero-visual');
    if (heroVisual) {
        window.addEventListener('scroll', function() {
            const scrolled = window.pageYOffset;
            const rate = scrolled * -0.5;
            heroVisual.style.transform = `translateY(${rate}px)`;
        });
    }
}

// 动画效果
function initAnimations() {
    // 观察器用于滚动动画
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.animation = 'fadeInUp 0.8s ease-out';
                entry.target.style.opacity = '1';
            }
        });
    }, observerOptions);
    
    // 观察所有游戏卡片
    const gameCards = document.querySelectorAll('.game-card');
    gameCards.forEach(card => {
        card.style.opacity = '0';
        observer.observe(card);
    });
    
    // CTA按钮点击效果
    const ctaButton = document.querySelector('.cta-button');
    if (ctaButton) {
        ctaButton.addEventListener('click', function() {
            // 滚动到第一个游戏分类
            const firstCategory = document.querySelector('.game-category');
            if (firstCategory) {
                firstCategory.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    }
}

// 工具函数：防抖
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// 工具函数：节流
function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// 添加键盘导航支持
document.addEventListener('keydown', function(e) {
    // ESC键清空搜索
    if (e.key === 'Escape') {
        const searchInput = document.querySelector('.search-input');
        if (searchInput) {
            searchInput.value = '';
            searchInput.blur();
            // 显示所有卡片
            const gameCards = document.querySelectorAll('.game-card[data-game]');
            gameCards.forEach(card => {
                card.style.display = 'block';
                card.style.animation = 'fadeInUp 0.5s ease-out';
            });
            hideSearchResults();
        }
    }
});

// 添加触摸设备支持
if ('ontouchstart' in window) {
    // 为触摸设备添加特殊样式
    document.body.classList.add('touch-device');
    
    // 优化触摸交互
    const gameCards = document.querySelectorAll('.game-card');
    gameCards.forEach(card => {
        card.addEventListener('touchstart', function() {
            this.style.transform = 'scale(0.98)';
        });
        
        card.addEventListener('touchend', function() {
            this.style.transform = '';
        });
    });
}

// 性能优化：图片懒加载
function initLazyLoading() {
    const images = document.querySelectorAll('img[data-src]');
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('lazy');
                imageObserver.unobserve(img);
            }
        });
    });
    
    images.forEach(img => imageObserver.observe(img));
}

// 初始化懒加载
initLazyLoading();

// 图片加载优化和错误处理
function initImageOptimization() {
    const images = document.querySelectorAll('img');
    
    images.forEach(img => {
        // 添加加载状态
        img.addEventListener('load', function() {
            this.style.opacity = '1';
            this.classList.add('loaded');
        });
        
        // 处理加载错误
        img.addEventListener('error', function() {
            this.style.background = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
            this.style.display = 'flex';
            this.style.alignItems = 'center';
            this.style.justifyContent = 'center';
            this.style.color = 'white';
            this.style.fontSize = '14px';
            this.style.fontWeight = '500';
            
            // 创建占位符文本
            const placeholder = document.createElement('div');
            placeholder.textContent = '游戏图片';
            placeholder.style.position = 'absolute';
            placeholder.style.top = '50%';
            placeholder.style.left = '50%';
            placeholder.style.transform = 'translate(-50%, -50%)';
            placeholder.style.color = 'white';
            placeholder.style.fontSize = '14px';
            placeholder.style.fontWeight = '500';
            
            this.parentNode.appendChild(placeholder);
            this.style.display = 'none';
        });
        
        // 预加载图片
        if (img.src && !img.complete) {
            const preloadImg = new Image();
            preloadImg.src = img.src;
        }
    });
}

// 初始化图片优化
initImageOptimization();
