# Frontend: shell и wallet

Техническая основа реализуется по [тикету](../Tasks/frontend-shell-wallet.md), [дизайну v1](../superpowers/specs/2026-11-12-frontend-shell-wallet-design.md) и согласованному плану v2. Фактические результаты проверок фиксируются в тикете; наличие исходников не означает завершённой приёмки.

## Границы

- [Shell](../../apps/shell/package.json) — host, контейнер страницы, loading UI и обработка ошибок remote.
- [Wallet](../../apps/wallet/package.json) — remote и самостоятельное приложение. Экспорт `wallet/Wallet` — default React-компонент без props и без собственного React root. Standalone entry монтирует тот же компонент.
- React/react-dom 19.3.1 согласованы и объявлены shared singleton в обоих Vite configs; используется @module-federation/vite 1.23.11 и loaded-first. Shell потребляет remote динамически, без импорта исходников wallet. TypeScript-declaration в shell описывает текущую узкую форму экспорта; развитие props потребует согласованного изменения контракта.
- Экран содержит только заголовки и локальный счётчик проверки React state. Балансы, токены, транзакции, auth, RPC, backend, router и UI kit отсутствуют.

## Локальный запуск

Установка: `pnpm install`. Если pnpm не установлен глобально, используйте способ через npm.cmd exec из [README](../../README.md#разработка).

| Команда                                 | Назначение                                   |
| --------------------------------------- | -------------------------------------------- |
| `pnpm dev`                              | Shell и wallet параллельно                   |
| `pnpm --filter @chillbounce/shell dev`  | Только shell                                 |
| `pnpm --filter @chillbounce/wallet dev` | Только wallet                                |
| `pnpm build`                            | Typecheck и сборка wallet, затем shell       |
| `pnpm preview`                          | Обе готовые сборки параллельно               |
| `pnpm typecheck`                        | Frontend и Vite-config проекты обоих пакетов |

Shell: http://127.0.0.1:5173. Standalone wallet: http://127.0.0.1:5174. Dev и preview используют эти же порты, поэтому запускаются по очереди. strictPort запрещает незаметный переход на следующий порт. Wallet разрешает cross-origin доступ из shell origins http://127.0.0.1:5173 и http://localhost:5173; wildcard CORS не используется. Оба имени loopback поддержаны после сообщения пользователя о блокировке CORS при открытии shell через localhost.

Перед локальным build/preview скопируйте [apps/shell/.env.example](../../apps/shell/.env.example) в apps/shell/.env.local. Пример содержит только публичный URL remote. Для dev предусмотрено локальное значение по умолчанию; для build/preview URL должен быть задан явно. VITE_WALLET_REMOTE_URL — абсолютный HTTP(S) URL remoteEntry.js; credentials и другие протоколы запрещены. VITE-переменные попадают в клиентскую конфигурацию и не подходят для секретов. В сборке URL фиксируется, смена значения для уже собранного приложения требует пересборки shell. Preview-переменная сама по себе не переписывает готовые chunks.

## Сбои и проверки

В tsconfig.node.json обоих приложений включён skipLibCheck: сторонние declarations @module-federation/sdk 2.9.3 требуют DOM и Webpack из Node-конфигурации Vite. Проверка своего vite.config/remote-url.ts остаётся strict; frontend tsconfig и root base этот флаг не получают. Ограничение: внутренние ошибки сторонних .d.ts в конфигурационных проектах не проверяются. Webpack как лишняя зависимость не добавляется.

При медленной загрузке предполагается loading UI. Если первый импорт или рендер remote завершается ошибкой, shell должен сохранить свою оболочку и показать fallback. Автоматических retries нет: после возврата wallet обновите страницу. Уже загруженный компонент может продолжать работать после остановки remote-сервера; отказ проверяется на свежей странице.

Приёмка включает lint, format:check, typecheck, обе сборки и проверку dev/preview в обычном браузере. По решению пользователя Playwright, другие test runners, автоматические browser tests и тестовые remotes не добавляются. Браузер проверяет пользователь; до его подтверждения соответствующие сценарии не считаются пройденными.
