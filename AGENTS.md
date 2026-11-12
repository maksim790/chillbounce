# Chillbounce — инструкции проекта

## Назначение и навигация

Chillbounce — планируемая кастодиальная криптовалютная платформа для хранения, пополнения, внутренних переводов и вывода тестовых активов Ethereum Sepolia.

Начинайте с [базы знаний](docs/Home.md). Требования находятся в [описании продукта](docs/01-Product/Overview.md), состояние реализации — в [обзоре системы](docs/02-System/Overview.md), принятые решения — в [индексе решений](docs/03-Decisions/Decision-Index.md). Источник требований: [бриф пользователя](docs/06-Sources/Project-Brief.md).

## Архитектурные ограничения

- Целевая структура проекта — монорепозиторий.
- Целевой frontend — микрофронтенды с Module Federation.
- Целевой backend — монолит NestJS.
- Планируемая blockchain integration — Ethereum Sepolia и тестовые активы.
- Финансовый учёт должен использовать double-entry ledger; защита ключей, контроль балансов, предотвращение двойных списаний и reconciliation входят в требования. Состояние реализации проверяйте по коду и обзору системы.
- Не представляйте запланированную функциональность как реализованную. Нерешённые вопросы перечислены в [roadmap](docs/04-Roadmap/Open-Questions.md).

## Команды разработки и проверки

При инициализации исходники, package scripts, CI и конфигурация инструментов не обнаружены. Команды установки, запуска, сборки, линтинга и тестов пока не установлены; не придумывайте их. После появления конфигурации документируйте команды со ссылкой на источник и результат проверки.

Согласованная [политика проверки](docs/05-Engineering/Testing-Strategy.md) обязательна. Для каждого изменения проверяйте согласованные критерии задачи, актуальность затронутой документации и Markdown-ссылки. Финансовые и блокчейн-изменения требуют соответствующих условных проверок. Отмечайте недоступные и не запущенные проверки явно.

## Documentation and task workflow

- Update affected vault pages in the same task when stable behavior,
  contracts, boundaries, security assumptions, or operations change.
  For purely mechanical changes, explain why no vault update was needed.
- Keep affected product, system, roadmap and decision pages and the
  [source coverage map](docs/06-Sources/Index.md) current. Preserve decision
  history without inventing rationale. Never store secrets, private keys,
  or real user data in documentation.
- Split non-trivial work into coherent parts. Verify and commit each
  completed logical part, leaving the project in a working state.
- Run applicable mandatory checks before committing. Fix failed checks.
  If a check is unavailable, committing is allowed only with an explicit
  explanation of the reason and verification limitations.
- Use a short conventional commit subject and a concise body for broad changes.

## Repository branches

- `main` is the production branch. After initial repository setup, do not
  develop or commit directly on it.
- Initial setup is a one-time exception: when explicitly requested, initialize
  the repository on `main`, make the first commit of reviewed project files,
  then create and switch to `dev` from that commit. No bootstrap or feature
  branch is required for initial setup; subsequent tasks use feature branches
  from `dev`. This exception does not authorize remote setup or publication.
- `dev` is the integration branch. Do not develop or commit task changes
  directly on it.
- Unless the user instructs otherwise, create a separate feature branch
  from `dev` for each task requiring file changes. When continuing the same
  task on its existing feature branch, reuse it; do not recreate or rebase
  it automatically.
- Before creating the branch, inspect the current branch, working tree,
  and availability of `dev`.
- If Git is not initialized or `dev` is missing, report it and obtain
  approval for the initial setup unless the user has already explicitly
  requested it. Do not ask again for an already authorized scope. Invoking
  `prepare-task` prepares the ticket; execution remains with `start-task`.
- When a remote is configured, fetch its current state. Update a clean
  local `dev` from its corresponding remote branch only by fast-forward.
  If the branches have diverged or the target is unclear, stop and report it.
- Leave unrelated dirty files alone. Stage only changes belonging to the task.
  Do not stash, discard, reset, or clean unrelated work. If it prevents
  switching branches or completing the task, report the obstruction.
- Promotion from `dev` to `main`, force pushes, and branch deletion each
  require separate explicit authorization.

## Task completion and integration

- After the entire task is completed and committed, offer exactly three
  choices in this order:
  1. Merge the feature branch into `dev` and push `dev`.
  2. Create a PR into `dev`.
  3. Leave changes on the feature branch without merging, pushing,
     or creating a PR.
- For analysis-only tasks or tasks requiring no changes, report the result
  without creating an empty commit or offering integration choices.
- Initial repository setup ends with a report of the first commit, branches,
  and verification results. Do not offer feature integration choices for it:
  there is no feature branch to merge or open a PR from.
- Before offering integration, inspect the complete branch diff and commit
  list relative to `dev`. If unrelated changes are present, report them and
  obtain clarification before including them in a merge or PR; do not
  silently remove or rewrite those commits.
- Present these choices once at task completion, not after intermediate commits.
  Mark unavailable actions and explain missing prerequisites.
- Wait for the user's selection before merging, pushing, or creating a PR.
  Creating a PR includes permission to push the feature branch as needed.
- Before an authorized merge, fetch again when a remote is configured and
  recheck `dev`. Apply the same fast-forward-only update policy; stop on
  divergence or an unclear target. If a push is rejected because the remote
  changed, fetch and reassess without force-pushing; resolve any new
  divergence with the user.
- If an authorized merge encounters conflicts, resolve unambiguous conflicts
  independently. Obtain clarification when resolution requires choosing
  behavior not already established by the task or accepted requirements.
- Verify the resulting integrated state after every merge, including merges
  without conflicts, and before pushing `dev`. For a merge with conflicts,
  also verify the resolved state before creating the merge commit. Apply
  the same policy for failed or unavailable checks. Do not push a result
  with failed mandatory checks; report the failure without discarding work.

<!-- context7 -->
## Актуальная документация библиотек

Используйте Context7 MCP, когда задача касается библиотеки, фреймворка, SDK, API, CLI или облачного сервиса: синтаксиса API, конфигурации, миграции версий, специфичной отладки, установки или использования CLI. Это правило действует и для хорошо известных технологий; предпочитайте Context7 веб-поиску документации.

Не используйте Context7 для рефакторинга, написания скриптов с нуля, отладки бизнес-логики, code review или общих концепций программирования, если не требуется документация конкретной технологии.

1. Начните с `resolve-library-id`, указав библиотеку и предмет поиска, кроме случая, когда пользователь уже дал точный ID `/org/project`.
2. Выберите совпадение по имени, релевантности описания, количеству примеров, репутации источника (предпочтительно High/Medium) и benchmark score. При плохом совпадении уточните имя или запрос. Для указанной версии используйте соответствующий ID.
3. Вызовите `query-docs` с выбранным ID и запросом об одной конкретной концепции. Для независимых концепций делайте отдельные запросы; объединяйте их только для вопроса об их взаимодействии.
4. Основывайте ответ на полученной документации.
<!-- context7 -->
