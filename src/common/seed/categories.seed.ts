import { Category } from '../entities/category.entity';
import { v4 as uuidv4 } from 'uuid';

export const categories: Partial<Category>[] = [
  { title: 'Разработка и IT', uuid: uuidv4(), slug: 'development-and-it' },
  { title: 'Дизайн и креатив', uuid: uuidv4(), slug: 'design-and-creativity' },
  { title: 'Тексты и контент', uuid: uuidv4(), slug: 'text-and-content' },

  {
    title: 'Маркетинг и реклама',
    uuid: uuidv4(),
    slug: 'marketing-and-advertising',
  },
  { title: 'Аудио/Видео/Фото', uuid: uuidv4(), slug: 'audio-video-photo' },
  { title: 'E-commerce', uuid: uuidv4(), slug: 'e-commerce' },
  {
    title: 'Бизнес и управление',
    uuid: uuidv4(),
    slug: 'business-and-management',
  },
  {
    title: 'Техподдержка и администрирование',
    uuid: uuidv4(),
    slug: 'technical-support-and-administration',
  },
  {
    title: 'Обучение и консалтинг',
    uuid: uuidv4(),
    slug: 'education-and-consulting',
  },
  {
    title: 'Юридические и финансовые услуги',
    uuid: uuidv4(),
    slug: 'legal-and-financial-services',
  },
];

export const getByParent = (
  parentCategory: Category,
): Partial<Category>[] | undefined => {
  if (parentCategory.title === 'Разработка и IT') {
    return [
      {
        uuid: uuidv4(),
        title: 'Веб-разработка (Frontend / Backend / Fullstack)',
        slug: 'web-development',
        parent: parentCategory,
      },
      {
        uuid: uuidv4(),
        title: 'Мобильная разработка (iOS / Android / Flutter)',
        slug: 'mobile-development',
        parent: parentCategory,
      },
      {
        uuid: uuidv4(),
        title: 'Разработка игр',
        slug: 'game-development',
        parent: parentCategory,
      },
      { title: 'DevOps и инфраструктура', slug: 'devops-and-infrastructure' },
      {
        uuid: uuidv4(),
        title: 'Тестирование и QA',
        slug: 'testing-and-qa',
        parent: parentCategory,
      },
      {
        title: 'Сайты на конструкторах (Tilda, Wix, Webflow)',
        uuid: uuidv4(),
        slug: 'website-builders',
        parent: parentCategory,
      },
      {
        uuid: uuidv4(),
        title: 'CMS (WordPress, Joomla, Drupal и др.)',
        slug: 'cms',
        parent: parentCategory,
      },
      {
        uuid: uuidv4(),
        title: 'Скрипты / автоматизация',
        slug: 'scripting-and-automation',
        parent: parentCategory,
      },
      {
        uuid: uuidv4(),
        title: 'Боты и парсеры',
        slug: 'bots-and-parsers',
        parent: parentCategory,
      },
      {
        uuid: uuidv4(),
        title: 'Telegram/VK/Discord боты',
        slug: 'messenger-bots',
        parent: parentCategory,
      },
      {
        uuid: uuidv4(),
        title: 'AI/ML проекты',
        slug: 'ai-ml-projects',
        parent: parentCategory,
      },
      {
        uuid: uuidv4(),
        title: 'Работа с API',
        slug: 'api-integration',
        parent: parentCategory,
      },
    ];
  }
  if (parentCategory.title === 'Дизайн и креатив') {
    return [
      {
        uuid: uuidv4(),
        title: 'Веб-дизайн',
        slug: 'web-design',
        parent: parentCategory,
      },
      {
        uuid: uuidv4(),
        title: 'UI/UX-дизайн',
        slug: 'ui-ux-design',
        parent: parentCategory,
      },
      {
        uuid: uuidv4(),
        title: 'Дизайн мобильных приложений',
        slug: 'mobile-app-design',
        parent: parentCategory,
      },
      {
        uuid: uuidv4(),
        title: 'Графический дизайн',
        slug: 'graphic-design',
        parent: parentCategory,
      },
      {
        uuid: uuidv4(),
        title: 'Логотипы и брендинг',
        slug: 'logos-and-branding',
        parent: parentCategory,
      },
      {
        uuid: uuidv4(),
        title: 'Иллюстрации',
        slug: 'illustrations',
        parent: parentCategory,
      },
      {
        uuid: uuidv4(),
        title: '3D-дизайн и моделирование',
        slug: '3d-design-and-modeling',
        parent: parentCategory,
      },
      {
        uuid: uuidv4(),
        title: 'Презентации',
        slug: 'presentations',
        parent: parentCategory,
      },
      {
        uuid: uuidv4(),
        title: 'Motion-дизайн / Анимация',
        slug: 'motion-design-and-animation',
        parent: parentCategory,
      },
      {
        uuid: uuidv4(),
        title: 'Figma-дизайн',
        slug: 'figma-design',
        parent: parentCategory,
      },
    ];
  }
  if (parentCategory.title === 'Тексты и контент') {
    return [
      {
        uuid: uuidv4(),
        title: 'Копирайтинг',
        slug: 'copywriting',
        parent: parentCategory,
      },
      {
        uuid: uuidv4(),
        title: 'Рерайтинг',
        slug: 'rewriting',
        parent: parentCategory,
      },
      {
        uuid: uuidv4(),
        title: 'SEO-тексты',
        slug: 'seo-texts',
        parent: parentCategory,
      },
      {
        uuid: uuidv4(),
        title: 'Техническая документация',
        slug: 'technical-documentation',
        parent: parentCategory,
      },
      {
        uuid: uuidv4(),
        title: 'Переводы',
        slug: 'translations',
        parent: parentCategory,
      },
      {
        uuid: uuidv4(),
        title: 'Написание статей/постов',
        slug: 'article-writing',
        parent: parentCategory,
      },
      {
        uuid: uuidv4(),
        title: 'Редактирование и корректура',
        slug: 'editing-and-proofreading',
        parent: parentCategory,
      },
    ];
  }
  if (parentCategory.title === 'Маркетинг и реклама') {
    return [
      {
        uuid: uuidv4(),
        title: 'SEO и ASO',
        slug: 'seo-and-aso',
        parent: parentCategory,
      },
      {
        uuid: uuidv4(),
        title: 'Контекстная реклама (Google Ads, Яндекс.Директ)',
        slug: 'ppc-google-ads-yandex-direct',
        parent: parentCategory,
      },
      {
        uuid: uuidv4(),
        title: 'SMM (Instagram, TikTok, Telegram и др.)',
        slug: 'smm-instagram-tiktok-telegram',
        parent: parentCategory,
      },
      {
        uuid: uuidv4(),
        title: 'Email-маркетинг',
        slug: 'email-marketing',
        parent: parentCategory,
      },
      {
        uuid: uuidv4(),
        title: 'Influencer маркетинг',
        slug: 'influencer-marketing',
        parent: parentCategory,
      },
      {
        uuid: uuidv4(),
        title: 'Аналитика и оптимизация воронок',
        slug: 'analytics-and-funnel-optimization',
        parent: parentCategory,
      },
      {
        uuid: uuidv4(),
        title: 'Создание лендингов и креативов',
        slug: 'landing-pages-and-creatives',
        parent: parentCategory,
      },
      {
        uuid: uuidv4(),
        title: 'PR и брендинг',
        slug: 'pr-and-branding',
        parent: parentCategory,
      },
    ];
  }
  if (parentCategory.title === 'Обучение и консалтинг') {
    return [
      {
        uuid: uuidv4(),
        title: 'Репетиторство (языки, программирование и т.д.)',
        slug: 'tutoring-languages-programming-etc',
        parent: parentCategory,
      },
      {
        uuid: uuidv4(),
        title: 'Обучающие курсы',
        slug: 'training-courses',
        parent: parentCategory,
      },
      {
        uuid: uuidv4(),
        title: 'Коучинг / Наставничество',
        slug: 'coaching-and-mentorship',
        parent: parentCategory,
      },
      {
        uuid: uuidv4(),
        title: 'Технические консультации',
        slug: 'technical-consulting',
        parent: parentCategory,
      },
    ];
  }
  if (parentCategory.title === 'Юридические и финансовые услуги') {
    return [
      {
        uuid: uuidv4(),
        title: 'Подготовка договоров',
        slug: 'contract-drafting',
        parent: parentCategory,
      },
      {
        uuid: uuidv4(),
        title: 'Юридическое сопровождение',
        slug: 'legal-support',
        parent: parentCategory,
      },
      {
        uuid: uuidv4(),
        title: 'Бухгалтерия',
        slug: 'accounting',
        parent: parentCategory,
      },
      {
        uuid: uuidv4(),
        title: 'Регистрация ИП/ООО',
        slug: 'business-registration',
        parent: parentCategory,
      },
      {
        uuid: uuidv4(),
        title: 'Финансовые модели',
        slug: 'financial-modeling',
        parent: parentCategory,
      },
    ];
  }
  if (parentCategory.title === 'Бизнес и управление') {
    return [
      {
        uuid: uuidv4(),
        title: 'Финансовый консалтинг',
        slug: 'financial-consulting',
        parent: parentCategory,
      },
      {
        uuid: uuidv4(),
        title: 'Бизнес-анализ',
        slug: 'business-analysis',
        parent: parentCategory,
      },
      {
        uuid: uuidv4(),
        title: 'CRM-системы',
        slug: 'crm-systems',
        parent: parentCategory,
      },
      {
        uuid: uuidv4(),
        title: 'Автоматизация процессов',
        slug: 'process-automation',
        parent: parentCategory,
      },
      {
        uuid: uuidv4(),
        title: 'Исследования рынка',
        slug: 'market-research',
        parent: parentCategory,
      },
      {
        uuid: uuidv4(),
        title: 'Виртуальный помощник',
        slug: 'virtual-assistant',
        parent: parentCategory,
      },
      {
        uuid: uuidv4(),
        title: 'Менеджмент проектов',
        slug: 'project-management',
        parent: parentCategory,
      },
      {
        uuid: uuidv4(),
        title: 'Составление отчетов, таблиц, дашбордов',
        slug: 'reports-spreadsheets-dashboards',
        parent: parentCategory,
      },
    ];
  }
  if (parentCategory.title === 'Техподдержка и администрирование') {
    return [
      {
        uuid: uuidv4(),
        title: 'Администрирование серверов',
        slug: 'server-administration',
        parent: parentCategory,
      },
      {
        uuid: uuidv4(),
        title: 'Настройка хостинга / доменов',
        slug: 'hosting-and-domain-setup',
        parent: parentCategory,
      },
      {
        uuid: uuidv4(),
        title: 'Миграция сайтов',
        slug: 'website-migration',
        parent: parentCategory,
      },
      {
        uuid: uuidv4(),
        title: 'Поддержка пользователей',
        slug: 'user-support',
        parent: parentCategory,
      },
      {
        uuid: uuidv4(),
        title: 'Внедрение CRM',
        slug: 'crm-implementation',
        parent: parentCategory,
      },
    ];
  }
  if (parentCategory.title === 'E-commerce') {
    return [
      {
        uuid: uuidv4(),
        title: 'Создание интернет-магазинов',
        slug: 'online-store-development',
        parent: parentCategory,
      },
      {
        uuid: uuidv4(),
        title: 'Интеграция с платёжными системами',
        slug: 'payment-gateway-integration',
        parent: parentCategory,
      },
      {
        uuid: uuidv4(),
        title: 'Shopify / WooCommerce / Opencart / Magento',
        slug: 'shopify-woocommerce-opencart-magento',
        parent: parentCategory,
      },
      {
        uuid: uuidv4(),
        title: 'Управление маркетплейсами (Ozon, Wildberries и др.)',
        slug: 'marketplace-management-ozon-wildberries',
        parent: parentCategory,
      },
      {
        uuid: uuidv4(),
        title: 'Настройка рекламы для e-commerce',
        slug: 'ecommerce-advertising-setup',
        parent: parentCategory,
      },
    ];
  }
  if (parentCategory.title === 'Аудио/Видео/Фото') {
    return [
      {
        uuid: uuidv4(),
        title: 'Монтаж видео',
        slug: 'video-editing',
        parent: parentCategory,
      },
      {
        uuid: uuidv4(),
        title: 'Цветокоррекция',
        slug: 'color-correction',
        parent: parentCategory,
      },
      {
        uuid: uuidv4(),
        title: 'Озвучка / Дикторы',
        slug: 'voice-over-and-announcers',
        parent: parentCategory,
      },
      {
        uuid: uuidv4(),
        title: 'Музыка / Саунд-дизайн',
        slug: 'music-and-sound-design',
        parent: parentCategory,
      },
      {
        uuid: uuidv4(),
        title: 'Подкасты',
        slug: 'podcasts',
        parent: parentCategory,
      },
      {
        uuid: uuidv4(),
        title: 'Фотообработка / Ретушь',
        slug: 'photo-editing-and-retouching',
        parent: parentCategory,
      },
    ];
  }
};
