# Chillbounce Monorepo Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [x]`) syntax for tracking.

**Goal:** Подготовить пустой pnpm TypeScript workspace с работающими общими проверками.

**Architecture:** pnpm управляет пакетами, единым lockfile и рекурсивным запуском package scripts. ESLint и Prettier запускаются корневыми командами; общие TypeScript/ESLint/Prettier настройки расширяются будущими приложениями. Отдельный task runner и кеширование результатов задач не добавляются.

**Tech Stack:** pnpm Workspaces, TypeScript, ESLint Flat Config, typescript-eslint, Prettier.

**Spec:** [Тикет и критерии приёмки](../../Tasks/initialize-monorepo.md), версия 2; Nx исключён по прямому поручению пользователя. План версии 2 и объём согласованы ответом «да.» 2026-11-12; запись согласования и его границы находятся в тикете. Выполнено основным агентом в режиме Fast; результаты и журнал выполнения — в тикете. Делегирование не выполнялось.

## Global Constraints

- Не создавать новый Git-репозиторий. Первоначальный запрет коммитов и интеграции отменён пользователем 2026-11-12: после проверок выполнить коммит, merge в dev, проверку интегрированного состояния и обычный push origin/dev по AGENTS.md. PR, удаление веток и изменение main не входят в объём. История согласования — в тикете.
- Не создавать приложения, generators и фиктивные исходники/тесты ради проверок.
- Не подключать Nx, Nx Cloud, замещающий task runner, React, NestJS, Vite, Module Federation и зависимости будущих приложений.
- Использовать актуальные стабильные совместимые версии; packageManager содержит точную версию pnpm.
- Сохранить существующие файлы после анализа; не добавлять инструменты без необходимости.
- Режим выполнения определит start-task; делегирование этим планом не разрешается. Если выбран основной агент, использовать executing-plans.

## Review Focus

1. Пустой workspace: проверки завершаются успешно с честным сообщением об отсутствии TS-целей, без фиктивных файлов.
2. Рекурсивный запуск pnpm: root package исключён, root scripts не вызывают сами себя.
3. Отсутствующие scripts: --if-present допускает отсутствие package typecheck, но ошибки существующих scripts сохраняют ненулевой exit code.
4. Ignore patterns: .env.local скрыт, .env.example, lockfile и tool configs видимы Git.
5. Форматирование существующего vault: смысл и рабочие ссылки сохраняются; повторное форматирование не даёт нового diff.

## 1. Подготовить совместимый набор инструментов и workspace

**Files:** создать package.json, pnpm-workspace.yaml, pnpm-lock.yaml, apps/.gitkeep, packages/.gitkeep, .gitignore. Существующие файлы сначала прочитать.

**Interfaces:** private root package и workspaces apps/_, packages/_; packageManager pnpm@<точная стабильная версия>; единый корневой lockfile.

- [x] Перепроверить Git status, ветку, dev и remote по AGENTS; продолжать текущую ветку этого тикета, если она существует. Сохранить чужие изменения. Не коммитить.
- [x] Проверить доступные Node/pnpm; через Context7 и registry определить актуальные stable и peerDependencies/engines инструментов. Зафиксировать источники, выбранные версии и совместимый Node в документации. При конфликте latest явно определить совместимое решение, не игнорировать peer errors.
- [x] Создать private package.json с packageManager, workspace globs и сохраняемые пустые каталоги; не создавать дочерние пакеты. Использовать один lockfile (pnpm shared lockfile), без лишнего дублирования defaults.
- [x] Создать .gitignore по критерию 7 тикета; выполнить git check-ignore --no-index для node_modules/x, apps/api/dist/x, node_modules/.vite/x, .env.local, debug.log, временных и IDE/OS путей. Они должны игнорироваться; .env.example, package.json, pnpm-lock.yaml и конфигурации — нет.
- [x] Установить только devDependencies typescript, eslint, @eslint/js, typescript-eslint, prettier и eslint-config-prettier выбранных совместимых версий через pnpm. Не запускать генерацию проектов. Проверить manifest, lockfile и pnpm install.

## 2. Настроить общие проверки

**Files:** создать tsconfig.base.json, eslint.config.mjs, .prettierrc.json, .prettierignore; дополнить package.json scripts.

**Interfaces:** root scripts lint, lint:fix, format, format:check, typecheck; будущие проекты предоставляют собственные package scripts и расширяют root configs.

- [x] Создать нейтральную tsconfig.base.json с strict: true; не включать глобально JSX, DOM/Node globals, decorators и runtime-специфичный moduleResolution. Проверить допустимость compiler options средством выбранной версии TS без сохранения тестовых проектов; ожидается отсутствие ошибок опций.
- [x] Создать eslint.config.mjs: recommended @eslint/js и typescript-eslint, подходящие JS/TS file globs, global ignores для dependencies, outputs и caches, eslint-config-prettier последним. Не включать type-aware lint без необходимости и TS-проектов.
- [x] Создать единый Prettier config и .prettierignore для generated/dependencies/cache/lockfile по необходимости. Не исключать документацию целиком; не добавлять eslint-plugin-prettier.
- [x] Добавить root scripts: lint и lint:fix запускают ESLint существующих подходящих файлов; format и format:check запускают Prettier workspace; typecheck — `pnpm -r --if-present run typecheck`. Сверить CLI с выбранной версией pnpm и проверить пустой набор. Root package исключён из рекурсивного запуска (includeWorkspaceRoot не включать); отсутствие script допустимо, ошибка существующего script не подавляется. Это поведение сверить с документацией, не создавая фиктивных пакетов. Не вызывать tsc напрямую на пустой базе и не добавлять фиктивный success script.
- [x] Проверить manifest, lockfile и корень: Nx, nx.json, Cloud и замещающий task runner отсутствуют; управление будущими пакетами опирается на pnpm scripts.
- [x] Выполнить pnpm lint, pnpm lint:fix, pnpm format, pnpm format:check, pnpm typecheck. Ожидаются exit code 0 и отсутствие recursion/TS no-input errors; для typecheck явно отметить отсутствие целей. Исправить реальные ошибки без создания фиктивных файлов.

## 3. Подтвердить воспроизводимость и обновить документацию

**Files:** README.md, AGENTS.md, docs/Home.md, docs/02-System/Overview.md, docs/03-Decisions/Decision-Index.md, docs/04-Roadmap/Overview.md, docs/04-Roadmap/Open-Questions.md, docs/05-Engineering/Testing-Strategy.md, docs/06-Sources/Index.md и тикет; иные страницы — только при фактическом затрагивании.

**Interfaces:** документация содержит реальные команды, версии, результаты и ограничения; будущее React/Vite/NestJS окружение не представлено созданным.

- [x] Документировать команды и версии со ссылками на package/config источники; отразить выбранные пользователем инструменты и будущую структуру, закрыть соответствующие вопросы roadmap. Сохранить историю решений и исправить устаревшее утверждение о remote по фактическому состоянию.
- [x] Запустить pnpm install --frozen-lockfile; ожидаются exit code 0 и неизменный lockfile. Проверить отсутствие конкурирующих lockfiles, приложений и лишних dependencies.
- [x] Повторить format после правок docs; выполнить lint и format:check, typecheck. Проверить идемпотентность format/lint:fix сравнением diff до и после повторного запуска. Повторять иные успешные проверки только при затрагивающих их изменениях.
- [x] Запустить validator из Testing-Strategy и отдельно проверить корневые Markdown-ссылки. Ожидаются разрешимые локальные ссылки; недоступность инструмента заменить эквивалентной read-only проверкой и указать метод.
- [x] Проверить полный diff, git diff --check, статус и соответствие всем критериям тикета. Записать фактические результаты, включая typecheck без целей; не объявлять build/test будущих приложений успешными.
- [x] Первоначально оставить изменения незакоммиченными согласно исходному ограничению. После его явной отмены пользователем завершить работу по правилам AGENTS.md: повторные проверки, коммит, merge и проверка dev перед push; feature-ветку сохранить. Фактический результат сообщить в отчёте.

## Основания технического подхода

Получено через Context7 при подготовке 2026-11-12; это документационные основания, а не результаты локальных проверок или подтверждение latest-версий:

- [pnpm workspace](https://github.com/pnpm/pnpm.io/blob/main/docs/workspaces.md): root package входит в workspace; shared lockfile по умолчанию включён.
- [pnpm recursive](https://github.com/pnpm/pnpm.io/blob/main/docs/cli/recursive.md) и [pnpm run](https://github.com/pnpm/pnpm.io/blob/main/docs/cli/run.md): рекурсивные scripts по умолчанию исключают root; --if-present допускает отсутствующий script. Документация повторно получена через Context7 при исключении Nx в версии 2.
- [typescript-eslint Quickstart](https://github.com/typescript-eslint/typescript-eslint/blob/main/docs/getting-started/Quickstart.mdx) и [совместимость форматирования](https://github.com/typescript-eslint/typescript-eslint/blob/main/docs/users/What_About_Formatting.mdx).

Перед выполнением сверить API и CLI выбранных версий через Context7. План не закрепляет непроверенные номера версий.
