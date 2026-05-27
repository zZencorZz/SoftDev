from enum import StrEnum

class ProjectStatus(StrEnum):
    CREATED = 'Создан'
    UNDER_REVIEW = 'На рассмотрении'
    APPROVED = 'Одобрен'
    REJECTED = 'Отклонен'
    PLANING = 'Планирование'
    DEVELOPMENT = 'Разработка'
    TESTING = 'Тестирование'
    COMPLETED = 'Завершен'
    PAUSED = 'Приостановлен'
    PAYMENT_AWAITING = 'Ожидание оплаты'
    PAYMENT_RECEIVED = 'Оплата получена'
    ARCHIVED = 'Архивирован'

class LinkName(StrEnum):
    GITHUB = "Github"
    FIGMA = "Figma"
    NOTION = "Notion"
    YANDEX_TRACKER = "Yandex Tracker"
    YANDEX_CLOUD = "Yandex Cloud"