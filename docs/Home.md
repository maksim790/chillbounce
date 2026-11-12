# Chillbounce — база знаний

Chillbounce — планируемая кастодиальная платформа для тестовых криптоактивов Ethereum Sepolia. Документация инициализирована 2026-11-12 по описанию пользователя; наличие реализации не подтверждено.

## Продукт и система

- [Описание продукта и требования](01-Product/Overview.md)
- [Текущее состояние системы](02-System/Overview.md)

## Решения и планы

- [Индекс принятых решений](03-Decisions/Decision-Index.md)
- [Запланированный объём](04-Roadmap/Overview.md)
- [Открытые вопросы](04-Roadmap/Open-Questions.md)

## Разработка и источники

- [README проекта](../README.md)
- [Definition of Done и проверки](05-Engineering/Testing-Strategy.md)
- [Инструменты monorepo и расширение конфигураций](05-Engineering/Tooling.md)
- [Исходный бриф](06-Sources/Project-Brief.md)
- [Карта покрытия источников](06-Sources/Index.md)
- [Инструкции проекта](../AGENTS.md)

## Задачи

- [Инициализация TypeScript monorepo на pnpm Workspaces — done](Tasks/initialize-monorepo.md)
- [Инициализация Git-репозитория](Tasks/initialize-git-repository.md)
- [README с навигацией по документации](Tasks/add-root-readme.md)
- [Коммиты по ходу тикетов, merge и push завершённой задачи](Tasks/auto-merge-completed-features.md)

## Ограничения

При первоначальном осмотре каталог проекта был пуст; теперь есть документация, Git и основа pnpm Workspaces с общими TypeScript/ESLint/Prettier настройками. Приложений нет. Будущий frontend — React/Vite с Module Federation; backend — NestJS. Хранилища, очереди, финансовые политики и эксплуатационная конфигурация пока не определены. Результаты и ограничения проверок находятся в тикетах.
