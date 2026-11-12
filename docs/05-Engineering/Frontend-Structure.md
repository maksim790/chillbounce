# Стандарт структуры frontend

Статус: согласованный целевой стандарт, ещё не внедрён в исходники. Основание — [дизайн v3](../superpowers/specs/2026-11-12-frontend-structure-shadcn-design.md), [план v2](../superpowers/plans/2026-11-12-frontend-structure-shadcn.md) и [тикет](../Tasks/frontend-structure-shadcn.md). Текущие приложения находятся в apps/shell и apps/wallet, UI-пакета, shadcn/ui и Tailwind пока нет. Действующие команды и runtime-контракт описаны в [Frontend](../02-System/Frontend.md).

## Целевая структура

```text
apps/
├── frontend/
│   ├── shell/
│   ├── wallet/
│   ├── admin/              # Будущий remote мониторинга
│   └── packages/
│       └── ui/
│           └── src/
│               ├── components/
│               ├── hooks/
│               ├── lib/
│               └── styles/
└── api/                    # Будущий NestJS backend

package.json
pnpm-workspace.yaml
pnpm-lock.yaml
tsconfig.base.json
```

apps/frontend группирует все frontend-приложения и frontend-пакеты; собственного фиктивного package.json ему не требуется. apps/api предназначен для одного будущего NestJS-приложения. Это единый monorepo с корневыми pnpm workspace, lockfile, нейтральным TS base и общими ESLint/Prettier. Корневой packages не удаляется; новые межплатформенные контракты обсуждаются отдельно. Crypto и worker этой схемой нового назначения не получают и не создаются.

## Внутри каждого frontend-приложения

```text
src/
├── app/             # Композиция приложения, App, providers, router, интеграции
├── pages/           # Страницы, собирающие пользовательские сценарии
├── features/        # Самостоятельные пользовательские сценарии
├── shared/          # Общий код только этого приложения
│   ├── api/         # Транспорт и общая инфраструктура запросов
│   ├── lib/         # Независимые локальные утилиты
│   └── ui/          # Локальные визуальные композиции без бизнес-логики
├── main.tsx
└── bootstrap.tsx
```

Это лёгкая структура по сценариям, не полный Feature-Sliced Design: обязательные entities/widgets не вводятся. Папки появляются только при реальном содержимом. В features/<scenario> рядом находятся UI, состояние, запросы, типы и валидация сценария; подпапки нужны по размеру, а не по шаблону. Endpoint-функции сценария не переносятся автоматически в shared/api. Локальный shared/hooks допустим при реальном повторном использовании.

Примеры будущего размещения, не существующие файлы и не разрешение реализовать функции:

| Что                                       | Целевое место                                        |
| ----------------------------------------- | ---------------------------------------------------- |
| Композиция Shell и подключение remote     | apps/frontend/shell/src/app/                         |
| Страница входа                            | apps/frontend/shell/src/pages/LoginPage.tsx          |
| Форма и запросы входа                     | apps/frontend/shell/src/features/login/              |
| Форма, типы и запрос внутреннего перевода | apps/frontend/wallet/src/features/internal-transfer/ |
| Локальное пустое состояние Wallet         | apps/frontend/wallet/src/shared/ui/                  |
| Общий Button shadcn/ui и тема             | apps/frontend/packages/ui/src/components/ и styles/  |

Папки сценариев и страниц — kebab-case; React-компоненты — PascalCase.tsx, хуки — useName.ts, обычные модули — kebab-case.ts. main.tsx сохраняет асинхронный вход, bootstrap.tsx — создание React root. Env declarations остаются техническими файлами приложения. Страница не обязательна для компонента, который непосредственно собирается app.

## Зависимости и публичные границы

Направление импортов: app → pages → features → shared → общий UI-пакет. Верхний уровень может использовать нижние напрямую, обратные зависимости запрещены. Pages не импортируют другие pages; features не используют внутренности других features, их композиция выполняется выше. Внутри feature разрешены относительные импорты.

Для внешнего использования feature определяет узкие точки входа; обязательного index.ts нет. Например, будущая pages/LoginPage.tsx может напрямую импортировать предназначенный для использования компонент из `../features/login/LoginForm`. Общий barrel, экспортирующий всё приложение, не создаётся.

| Допустимо                                                   | Недопустимо                                                                |
| ----------------------------------------------------------- | -------------------------------------------------------------------------- |
| Страница входа использует публичный LoginForm своей feature | shared/ui импортирует LoginForm из features                                |
| Wallet использует Button через объявленный export UI-пакета | UI-пакет импортирует Wallet, auth или API приложения                       |
| Shell импортирует публичный wallet/Wallet через Federation  | Shell импортирует wallet/src/Wallet напрямую или через alias соседнего app |
| Страница собирает независимые сценарии                      | Feature перевода импортирует внутреннее состояние feature вывода           |

Между apps нет прямых импортов исходников. Существующий wallet/Wallet без props и React singleton сохраняются; новый runtime-контракт этим стандартом не вводится. Exposed-компонент не создаёт React root и не владеет layout Shell; standalone bootstrap монтирует его отдельно. Конкретные package exports и aliases устанавливаются при внедрении. Ни общий бизнес-store, ни router, ни новый пакет контрактов не добавляются без отдельной потребности.

## Общий UI и локальный UI

apps/frontend/packages/ui владеет общими исходниками shadcn/ui, визуальными примитивами, UI-хуками, утилитами и токенами. Он не зависит от Shell, remotes или backend и не содержит API, auth, балансов или бизнес-состояния. В shadcn/ui выбранные компоненты добавляются в исходники проекта; не требуется писать их с нуля или устанавливать весь набор.

Локальный shared/ui приложения содержит переиспользуемые в нём визуальные композиции. Общие Button/Input/Dialog берутся из общего UI-пакета, а форма перевода остаётся в feature Wallet. Исходники общих компонентов не копируются в каждый remote. Общий пакет подключается через workspace-зависимость и объявленные exports, однако это не определяет способ загрузки кода браузером.

## Доставка UI, тема и CSS

Runtime-доставка UI пока открыта: локальная сборка потребителями и предоставление через Shell — разные варианты. Общий исходный пакет не означает ни отдельный UI remote, ни автоматически единственную runtime-копию. Для Shell-поставщика предстоит определить совместимость версий, отказ поставщика и самостоятельный запуск Wallet. Политика shared/exposes/import:false не выбирается здесь.

Shell управляет темой общей страницы. Remotes используют общие токены и не перезаписывают тему или глобальные стили оболочки; их standalone bootstrap обеспечивает ту же базовую тему. Reset/base styles подключаются на уровне entry документа, а не каждым UI-компонентом; exposed-компонент не навязывает повторную глобальную инициализацию.

Tailwind source discovery, порядок CSS-слоёв, доставка стилей remote и конфликты проверяются при внедрении. Shell не должен рассчитывать, что его сборка автоматически обнаружит классы независимо собранного remote. Общая папка styles не гарантирует CSS-изоляции. Полезная первая проверка будущего внедрения — Button и Dialog, их тема, стили и порталы в standalone Wallet и внутри Shell. В документационной задаче эти проверки не запускались.

## Отдельный этап внедрения

Перед переносом и подключением UI требуется отдельная задача, учитывающая:

- Workspace discovery вложенных `apps/frontend/*` и `apps/frontend/packages/*`, будущего apps/api и сохранённых корневых пакетов; текущие `apps/*` и `packages/*` сами по себе новую вложенность не покрывают.
- Относительные TS extends, ESLint file globs, Vite paths/exposes/env root, scripts и документационные ссылки.
- Версии и primitive base shadcn/ui, components.json/aliases, package exports, Tailwind/CSS pipeline и необходимые компоненты.
- Палитру, стиль, light/dark UX и runtime-доставку UI; auth/router/API и назначение crypto остаются открытыми отдельно.

В этой задаче не перемещаются файлы, не устанавливаются зависимости, не создаются пустые каталоги и не меняются конфигурации. Разделение обязанностей Shell/Wallet и авторитетность backend из [карты обязанностей](../02-System/Frontend.md#будущие-обязанности) остаются прежними.

## Основания

- [shadcn/ui monorepo](https://ui.shadcn.com/docs/monorepo): общий UI-пакет и локальные композиции.
- [Пример Vite Federation](https://github.com/gioboa/react-nx-microfrontend-demo): host/remote вместе с shared UI; Nx из примера не переносится в проект.
- [Bulletproof React](https://github.com/alan2207/bulletproof-react/blob/master/docs/project-structure.md): группировка по features, создание подпапок по необходимости, предупреждение о barrel-файлах.
- [pnpm packages](https://pnpm.io/settings#packages) и [Tailwind source detection](https://tailwindcss.com/docs/detecting-classes-in-source-files): настраиваемое обнаружение пакетов и источников классов. Источники исследованы при подготовке; они подтверждают механизмы, а не успешное внедрение нашей схемы.
