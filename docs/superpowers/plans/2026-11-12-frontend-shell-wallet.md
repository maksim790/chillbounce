# Shell и wallet Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [x]`) syntax for tracking. Пользователь выбрал выполнение основным агентом; субагентов не запускать.

**Goal:** Два независимо запускаемых React/Vite приложения с проверенной загрузкой wallet remote в shell и изоляцией его ошибок.

**Architecture:** Shell лениво потребляет `wallet/Wallet`; wallet экспортирует React-компонент без props и отдельно монтирует его для standalone. Общая версия React и federation singletons согласованы; shell владеет loading/error UI, бизнес-данных и общего состояния нет.

**Tech Stack:** pnpm, React, TypeScript, Vite, @module-federation/vite, ESLint, Prettier.

**Spec:** [Дизайн v1 — approved](../specs/2026-11-12-frontend-shell-wallet-design.md), [тикет](../../Tasks/frontend-shell-wallet.md). План v2 approved: пользователь ответил «Подтвердить план» после исключения Playwright; запись согласования 2026-11-12T16:15:03Z. Пользователь отдельно выбрал «Начать выполнение»; результаты и согласованное прекращение дальнейших browser checks записаны в тикете.

## Global Constraints

- Только apps/shell и apps/wallet, без полноценных интерфейсов, маршрутизации, backend, финансовых данных, auth, RPC, UI kit, дополнительных remotes и Nx.
- Использовать существующие pnpm Workspaces и root lockfile, TypeScript 6.0.3, runtime-neutral base config и стиль Prettier с табуляцией.
- Пользователь: «не надо запускать playwright тесты». В плане v2 не устанавливать Playwright, его браузеры или другие test runners; не создавать e2e suites, тестовые remotes и test scripts. Не запускать Playwright-тесты, в том числе через обходную команду. Проверки в браузере проводить без Playwright-тестов.
- Выполняет основной агент; делегирование не требуется и не разрешено выбранным способом.
- Продолжать feature/frontend-shell-wallet; отдельные законченные части проверять и коммитить. Интеграция в dev и обычный push — после полного завершения тикета по AGENTS.md. main и удаление веток не входят в объём.
- Подготовка не изменяла приложения. При последующем выполнении реализованы Tasks 1–3; результаты CLI и ручных сценариев записаны в тикете.

## Review Focus

1. Offline remote не должен ломать bootstrap shell: проверка Task 2 со свежим открытием shell при остановленном wallet.
2. Две копии React/неверный JSX runtime: Task 1, ручная интеракция одного Wallet standalone и внутри shell без runtime-ошибок; повтор в preview Task 3.
3. Dev работает, production chunks/CORS нет: Task 3, ручная проверка обоих preview с разными origins.
4. Пропущенный/неверный remote URL либо занятый порт: Tasks 1–2, CLI должен выдавать понятную ошибку, не выбирать другой порт незаметно.
5. Ошибки render после успешного импорта: Task 2, контролируемая временная ошибка собственного Wallet в dev; после проверки исходник полностью восстановлен.

## Версии и файлы

Read-only npm registry проверен 2026-11-12: react/react-dom 19.3.1; vite 8.3.8; @vitejs/plugin-react 6.3.0; @module-federation/vite 1.23.11; @types/react и @types/react-dom 19.3.0; eslint-plugin-react-hooks 7.1.1; eslint-plugin-react-refresh 0.5.7. Предложены exact versions, совместимые по engines с Node.js 22.20.0. Перед установкой перепроверить peerDependenciesMeta; optional compiler/Babel peers не добавлять без необходимости. @types/node — последняя стабильная 22.x с минимумом 22.12.0, закреплённая exact. TypeScript 7 и смена линтера не требуются.

Оба приложения: package.json, index.html, vite.config.ts, tsconfig.json (frontend), tsconfig.node.json (tooling), src/main.tsx (async entry), src/bootstrap.tsx (React root), src/vite-env.d.ts; wallet дополнительно src/Wallet.tsx, shell — src/App.tsx, src/RemoteErrorBoundary.tsx, src/remotes.d.ts, remote-url.ts и .env.example. Минимальный CSS — только для читаемости технического экрана.

Корень: дополнить package.json, pnpm-lock.yaml и eslint.config.mjs. .gitignore/.prettierignore менять только при появлении фактически генерируемых federation outputs; dist уже исключён. Не добавлять test directories, Playwright configs, test-results/report ignores или отдельный tsconfig для отсутствующей тестовой инфраструктуры. Обновить README, систему, Tooling, решения, roadmap/open questions и карту источников по факту реализации.

## Task 1: Работающая связка и standalone wallet

**Interfaces:** private packages `@chillbounce/shell` и `@chillbounce/wallet`; expose `./Wallet`, import `wallet/Wallet`, default `function Wallet(): React.JSX.Element` без props. Shell heading `Chillbounce`, wallet heading `Wallet`, button `Проверить React`, counter `Проверок: 0`.

- [x] Проверить Git, тикет и approved design/plan, сохранить посторонние файлы. Проверить версии/peers по registry и Context7. Установить только React/runtime в оба package; Vite/React plugin/federation и types — в приложения; React ESLint plugins — root tooling. Зависимости прямых импортов объявить в соответствующих manifests без неявного hoisting. Test runners и браузеры не устанавливать.
- [x] Создать `resolveWalletRemoteUrl(raw: string | undefined, allowLocalDefault: boolean): string` в apps/shell/remote-url.ts. undefined + true возвращает http://127.0.0.1:5174/remoteEntry.js; undefined + false, пустая строка, некорректный URL, javascript:/file: дают понятную ошибку; абсолютные http/https допускаются. Host Vite config читает VITE_WALLET_REMOTE_URL через loadEnv из каталога shell; локальный default допускается только для serve, production build без URL явно падает. .env.example содержит публичный локальный URL; реальные .env не коммитить.
- [x] Создать Wallet с useState и default export без props. Standalone bootstrap монтирует его локально; экспортируемый компонент root не создаёт. В main.tsx оставить async import bootstrap для инициализации sharing. Shell потребляет только React.lazy(() => import('wallet/Wallet')) с узкой декларацией модуля через React ComponentType без any и без импорта исходников wallet; Suspense показывает `Загрузка Wallet…`.
- [x] Настроить federation: names shell/wallet, ESM remote type module, wallet filename remoteEntry.js, expose ./Wallet; host entry из helper. Shared react/react-dom — singleton с согласованным requiredVersion, JSX-runtime/client subpaths проверить по выбранной версии. Не включать import:false: wallet нужен standalone fallback. Использовать loaded-first и не включать eager remote preload, чтобы shell мог запуститься без remote; это обязательно проверить в Task 2.
- [x] TS frontend наследует ../../tsconfig.base.json: lib ES2022/DOM/DOM.Iterable, jsx react-jsx, module ESNext, moduleResolution Bundler, types vite/client, noEmit, include src. Отдельный tsconfig.node включает vite.config.ts и host remote-url.ts, types node, lib ES2022, module ESNext/Bundler, noEmit. Runtime-neutral base не менять.
- [x] Scripts пакетов: dev=`vite`, typecheck=`tsc --noEmit -p tsconfig.json && tsc --noEmit -p tsconfig.node.json`, build=`pnpm run typecheck && vite build`, preview=`vite preview`. Root dev/preview=`pnpm --parallel --filter @chillbounce/shell --filter @chillbounce/wallet run <dev|preview>`; root build последовательно запускает wallet build и shell build. Root typecheck сохраняет рекурсивный запуск scripts обоих пакетов. ESLint расширить необходимыми flat React Hooks/Refresh правилами для TSX приложений.
- [x] Зафиксировать dev/preview host 127.0.0.1 и порты shell 5173/wallet 5174 с strictPort; wallet CORS разрешает нужный shell origin, не все origins. Dev и preview используют одну пару портов по очереди. При запущенном shell второй shell dev должен завершиться ошибкой занятого порта.
- [x] Выполнить lint, format:check, typecheck. Expected: exit 0, реальные TS targets обоих приложений. В браузере без Playwright открыть standalone wallet и shell, увидеть соответствующие headings; в каждом варианте клик кнопки меняет `Проверок: 0` на `Проверок: 1`, неожиданных runtime-ошибок нет. Проверить diff, обновить затронутые docs и закоммитить: `feat: add shell and wallet federation foundation`.

## Task 2: Отказы remote и настройки окружения

**Interfaces:** существующий resolveWalletRemoteUrl из Task 1; shell loading text `Загрузка Wallet…`, error text `Wallet временно недоступен`. Восстановление remote — обычной перезагрузкой страницы, без автоматических retries.

- [x] Добавить RemoteErrorBoundary вокруг lazy/Suspense, чтобы ошибка импорта или рендера wallet не убирала heading и контейнер shell. Не добавлять router, общий store, production test flags или fake remote. В README описать подготовку .env.local из .env.example перед build+preview.
- [x] С помощью сетевого замедления в браузере проверить loading UI и последующее появление wallet; не использовать Playwright или его тестовые перехваты. Затем остановить только управляемый процесс wallet и свежим открытием shell подтвердить fallback. Вернуть wallet и перезагрузить страницу: wallet и кнопка работают. Уже загруженный компонент не обязан исчезать при остановке сервера.
- [x] Для ручной проверки render boundary сохранить точный исходник своего Wallet, временно вызвать исключение при его рендере в dev, открыть shell и подтвердить fallback при сохранённом heading. Полностью восстановить исходник и проверить diff; временная ошибка не должна попасть в commit или итоговый dist. Если безопасная проверка в браузере недоступна, явно сообщить непроверенный сценарий, не засчитывать ревью как выполненный browser check.
- [x] CLI проверить production build без URL и с некорректным URL/протоколом: ожидается ненулевой код и понятная ошибка. Удалять пользовательские env-файлы не требуется: условия проверять временным известным окружением или отдельным чистым каталогом, без чтения/перезаписи секретов. Корректный URL затем позволяет собрать shell.
- [x] Повторить lint/format:check/typecheck. Expected: exit 0. В документе задачи записать ручные browser/CLI результаты, используемые origins и ограничения; автоматические тесты не объявлять пройденными. Закоммитить проверенную обработку ошибок: `feat: isolate wallet remote loading failures`.

## Task 3: Build+preview, документация и завершение

**Interfaces:** root dev/build/preview и package scripts обоих приложений. Test scripts в этой задаче не создаются. Для shell build URL задаётся публичной .env.local либо окружением; локальный default не должен незаметно попадать в production build.

- [x] Остановить управляемые dev-серверы, задать документированный URL для локальной сборки и выполнить root build. Expected: оба dist собраны. Запустить оба preview и в браузере без Playwright повторить standalone wallet и composition, работу счётчика и отсутствие неожиданных ошибок/chunk/CORS failures. Остановить preview wallet, свежим открытием shell подтвердить fallback; вернуть wallet и перезагрузить. HTTP 200 и наличие dist сами по себе federation не доказывают.
- [x] Обновить README/Tooling с точными командами запуска одного/обоих приложений, env, портами, запретом одновременного dev/preview и восстановлением remote через reload. Обновить систему, решения, roadmap/open questions и карту источников: реализован только технический frontend, без backend, бизнес-экранов, auth и финансовой логики. Указать, что Playwright и другие test runners не добавлялись, автоматические browser tests не запускались по решению пользователя.
- [x] Выполнить pnpm install --frozen-lockfile --strict-peer-dependencies, lint, format:check, typecheck и build; повторить затронутые ручные browser checks, docs validator и root Markdown-links check, git diff --check. Expected: CLI exit 0, ручные критерии подтверждены отдельно. Недоступный обязательный browser check не объявлять пройденным; тикет остаётся открытым до проверки или явно согласованного исключения. Playwright не является обязательным gate этого плана и не запускается.
- [x] Провести отдельное саморевью полного diff по 8 критериям тикета и пяти Review Focus. Независимое ревью не запускать: выбран основной агент. Записать результаты, сохранить Created, поставить done только по проверкам; закоммитить: `docs: document frontend foundation and verification`.
- [ ] По AGENTS.md проверить коммиты и полный diff относительно dev, повторно fetch origin и обновить dev только fast-forward; интегрировать согласованный scope, проверить интегрированный результат и выполнить обычный push dev. Сохранить feature-ветку, закончить на dev. Если интеграция заблокирована, сохранить работу и точно сообщить незавершённый шаг.

## Основания и изменение плана

[Module Federation Vite](https://github.com/module-federation/vite) и [Vite](https://vite.dev/guide/) исследованы через Context7; registry подтверждает объявленные engines/peers, но не доказывает локальную работу. Версии и механизм sharing сверяются перед выполнением.

План v1 не согласован: пользователь выбрал «Внести изменения», уточнил «не надо запускать playwright тесты» и выбрал основного агента. В v2 убраны Playwright dependency, browser installation, конфигурации, тестовые fixtures/suites и test scripts. Runtime-контракт и согласованный дизайн приложений не изменены; CLI и ручные browser проверки — согласованный способ подтверждения результата. План v2 и объём подтверждены отдельным ответом «Подтвердить план» 2026-11-12; границы согласования записаны в тикете. Реализация завершена; отдельный повтор preview offline/recovery прекращён по прямому указанию пользователя, без заявления об успешной проверке этого сценария.
