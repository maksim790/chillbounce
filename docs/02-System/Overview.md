# Текущее состояние системы

Проверено 2026-11-12 до создания документации: рабочий каталог `C:/Users/maksimbell/lifetime/projects/chillbounce` пуст. `Get-ChildItem -Force` и `rg --files --hidden` не обнаружили файлов. `git status --short` сообщил, что каталог не является Git-репозиторием.

## Реализация

При первоначальном осмотре не найдены приложения, пакеты, backend-модули, frontend-модули, API-схемы, схема данных, миграции, хранилища, очереди, механизмы безопасности, тесты, CI или конфигурация развёртывания. Это результат локального осмотра, а не утверждение об отсутствии внешних репозиториев или документов.

Настроены pnpm Workspaces, общий lockfile, TypeScript base config, ESLint Flat Config и Prettier. Nx не используется. Добавлены технические React/Vite приложения shell и wallet с Module Federation; пользователь подтвердил standalone wallet и работу remote/счётчика внутри shell в dev и production preview. Приёмка и ограничения записаны в [тикете frontend](../Tasks/frontend-shell-wallet.md). Root typecheck проверяет оба приложения и их Vite-конфигурации; команды — в [руководстве](../05-Engineering/Tooling.md). Backend, общие библиотеки, API и финансовые механизмы ещё не созданы. Исторические результаты настройки пустого workspace сохранены в [тикете monorepo](../Tasks/initialize-monorepo.md).

## Планируемая архитектура

Контракты и команды shell/wallet описаны в [Frontend](Frontend.md), состояние приёмки — в [тикете](../Tasks/frontend-shell-wallet.md). Остальные приложения остаются планами.

Shell host и wallet remote созданы на React/Vite с @module-federation/vite; пока это технический экран, без бизнес-данных и router. Crypto/admin remotes, api (NestJS), worker, packages/ui/contracts/config из [исходного состава](../Tasks/initialize-monorepo.md) ещё не созданы. См. [решения](../03-Decisions/Decision-Index.md) и [roadmap](../04-Roadmap/Overview.md). Backend-модули, бизнес-контракты, federation deployment и модель развёртывания worker пока не установлены.

## Локальный Git

2026-11-12 выполнена согласованная [инициализация репозитория](../Tasks/initialize-git-repository.md): `git init -b main` создал Git в корне Chillbounce. Первый коммит `chore: initialize repository` включает существующую проектную документацию, включая README. Создана dev от main; последующие задачи используют feature-ветки от dev. Проверки и доказательства завершения зафиксированы в тикете. При той инициализации remote не был настроен.

При подготовке monorepo обнаружен origin `https://github.com/maksim790/chillbounce.git`; после fetch dev совпала с origin/dev. Работа над monorepo велась в feature/prepare-monorepo-initialization. Первоначально коммиты и интеграция были запрещены запросом; затем пользователь назвал эту строку ошибкой и поручил стандартное завершение через коммит, merge и push dev. История и проверки — в [тикете](../Tasks/initialize-monorepo.md). Приложение не публиковалось, деплой не выполнялся.

## Источники

- [Карта источников и пределы осмотра](../06-Sources/Index.md)
- [Бриф пользователя](../06-Sources/Project-Brief.md)
