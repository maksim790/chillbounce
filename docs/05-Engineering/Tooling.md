# Инструменты monorepo

Объём согласован в [тикете](../Tasks/initialize-monorepo.md) и плане v2: pnpm Workspaces без Nx и замещающего task runner. Исходники приложений, CI и framework plugins ещё не созданы.

## Версии и установка

Прямые devDependencies закреплены точными версиями в [package.json](../../package.json); единый [pnpm-lock.yaml](../../pnpm-lock.yaml) хранится в Git. [pnpm-workspace.yaml](../../pnpm-workspace.yaml) включает `apps/*` и `packages/*`; shared workspace lockfile включён по умолчанию. Корень private.

При первой установке pnpm 12 автоматически добавил точечный `minimumReleaseAgeExclude: [prettier@3.10.1]` для выбранного свежего stable-релиза. Исключение ограничено этой точной версией; общий release-age контроль не отключён. Lockfile pnpm 12 содержит несколько YAML-документов, в том числе зависимости самого package manager; это один файл, сгенерированный pnpm, его не нужно вручную объединять или форматировать.

| Инструмент             | Версия  |
| ---------------------- | ------- |
| pnpm                   | 12.18.0 |
| TypeScript             | 6.0.3   |
| ESLint                 | 10.14.0 |
| @eslint/js             | 10.0.1  |
| typescript-eslint      | 8.72.2  |
| Prettier               | 3.10.1  |
| eslint-config-prettier | 10.1.8  |

Проверено по npm registry 2026-11-12: перечисленные инструменты, кроме TypeScript, выбраны из stable `latest`. TypeScript `latest` — 7.0.2, но typescript-eslint 8.72.2 объявляет peer range `>=4.8.4 <6.1.0`; выбрана последняя стабильная 6.0.x — 6.0.3. Переход на TS 7 требует поддержки линтером. Выбор проверяется установкой с `--strict-peer-dependencies`.

ESLint требует Node.js `^20.19.0 || ^22.13.0 || >=24`; проект использует диапазон `^22.13.0 || >=24.0.0`, проверка выполнялась на Node.js 22.20.0. Источники метаданных: npm registry `/pnpm/latest`, `/typescript`, `/eslint/latest`, `/@eslint/js/latest`, `/typescript-eslint/latest`, `/prettier/latest`, `/eslint-config-prettier/latest`.

Команды установки и root scripts: [README](../../README.md#разработка). В этой среде Corepack 0.34.0 пытается запустить отсутствующий `bin/pnpm.cjs` у pnpm 12. Поэтому используется `npm.cmd exec --yes --package=pnpm@12.18.0 -- pnpm <команда>`. Глобальная установка и изменение системной execution policy не требуются.

## Расширение будущими пакетами

- Создавайте реальные пакеты с package.json в `apps/*` или `packages/*`; сейчас эти каталоги пусты, кроме `.gitkeep`.
- В tsconfig пакета задайте `extends: "../../tsconfig.base.json"`. База задаёт ES2022, strict и проверку регистра путей. `lib: ["ES2022"]` и `types: []` исключают неявные browser/Node globals. Приложение добавляет нужные `lib`/`types`, JSX, module/moduleResolution, decorators, emit и input/output options. Никаких runtime-специфичных настроек в базе нет.
- Добавьте в пакет собственный `typecheck` script, например с выбранным для него tsconfig. Корневой `pnpm -r --if-present run typecheck` исключает корень и запускает существующие scripts; `--if-present` допускает отсутствие script, а ошибки существующих scripts остаются ошибками. При пустом workspace код приложений не проверяется. Не включайте `includeWorkspaceRoot`, чтобы избежать рекурсии.
- [ESLint Flat Config](../../eslint.config.mjs) применяет recommended JS и TS правила к соответствующим файлам, без type-aware lint и framework plugins. React/NestJS правила и runtime globals добавляются при создании приложений. eslint-config-prettier расположен последним; Prettier работает отдельно.
- [Prettier](../../.prettierrc.json) использует один стиль: singleQuote true, endOfLine lf, tabWidth 4, useTabs true, semi true, printWidth 80. Пользователь сменил отступы на табуляцию и поручил сохранить эту настройку. [Ignore](../../.prettierignore) исключает генерируемые файлы, зависимости и кеши. Lockfile генерируется pnpm. Проверка форматирования охватывает и vault.
- [Настройки VS Code](../../.vscode/settings.json) включают formatOnSave и явно назначают esbenp.prettier-vscode для TypeScript и JavaScript. Это перекрывает языковые пользовательские настройки другого форматтера. Расширение читает корневой .prettierrc.json; правила не дублируются в settings.json. В Git включён только этот общий файл из .vscode; остальные файлы папки остаются исключёнными. Срабатывание Ctrl+S подтверждено пользователем в беседе 2026-11-12.

Кеширование результатов задач не настраивается. Запуск build/test появится вместе с реальными пакетами и их scripts.

## Документационные основания

Получены через Context7 при подготовке и выполнении:

- [pnpm Workspaces](https://github.com/pnpm/pnpm.io/blob/main/docs/workspaces.md), [recursive](https://github.com/pnpm/pnpm.io/blob/main/docs/cli/recursive.md), [run](https://github.com/pnpm/pnpm.io/blob/main/docs/cli/run.md).
- [typescript-eslint Quickstart](https://github.com/typescript-eslint/typescript-eslint/blob/main/docs/getting-started/Quickstart.mdx), [совместимость форматирования](https://github.com/typescript-eslint/typescript-eslint/blob/main/docs/users/What_About_Formatting.mdx).
- [TypeScript configuration inheritance](https://www.typescriptlang.org/tsconfig/extends.html).

Фактические результаты команд и ограничения проверок записываются в [тикете](../Tasks/initialize-monorepo.md); документация библиотек сама по себе не подтверждает локальные проверки.
