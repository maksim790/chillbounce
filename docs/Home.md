# Chillbounce — база знаний

Chillbounce — планируемая кастодиальная платформа для тестовых криптоактивов Ethereum Sepolia. Документация инициализирована 2026-11-12; техническая основа frontend shell/wallet создана, бизнес-функции ещё не реализованы.

## Продукт и система

- [Описание продукта и требования](01-Product/Overview.md)
- [Текущее состояние системы](02-System/Overview.md)
- [Технический frontend: shell и wallet](02-System/Frontend.md)

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

Будущие обязанности общей оболочки и всех сценариев кошелька согласованы отдельно: [карта Shell/Wallet](02-System/Frontend.md#будущие-обязанности). Бизнес-экраны пока не реализованы; назначение crypto открыто.

## Задачи

- [Документировать будущие обязанности Shell и Wallet — done](Tasks/document-shell-wallet-responsibilities.md)
- [Frontend: shell и remote wallet — done](Tasks/frontend-shell-wallet.md)
- [Инициализация TypeScript monorepo на pnpm Workspaces — done](Tasks/initialize-monorepo.md)
- [Инициализация Git-репозитория](Tasks/initialize-git-repository.md)
- [README с навигацией по документации](Tasks/add-root-readme.md)
- [Коммиты по ходу тикетов, merge и push завершённой задачи](Tasks/auto-merge-completed-features.md)

## Ограничения

При первоначальном осмотре каталог проекта был пуст; теперь есть документация, Git, pnpm Workspaces, общие TypeScript/ESLint/Prettier настройки и технические приложения shell/wallet на React/Vite с Module Federation. Backend NestJS, бизнес-экраны, хранилища, очереди, финансовые политики и эксплуатационная конфигурация остаются планами. Результаты и ограничения проверок находятся в тикетах.
