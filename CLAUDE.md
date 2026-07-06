# Claude Code Context for Forge

> **Purpose**: This document provides context for Claude Code (AI assistant) when working on Forge. Forge is a CreditChain-native fork of Ethereum Remix, so preserve upstream Remix internals while making product-facing CreditChain changes.

## Project Identity

**Forge** is the AI-native smart contract studio for CreditChain, forked from Ethereum Remix. It keeps Remix's browser IDE, plugin engine, Solidity tooling, testing, debugging, and deployment foundation while adding CreditChain network configuration, contract search/import, AI-assisted audits, deployment verification, and future Contract Passport workflows.

- **Repository**: https://github.com/openibank/forge
- **Primary Domain**: https://forge.creditchain.org
- **Upstream Baseline**: https://github.com/openibank/forge
- **Architecture**: Nx monorepo with Yarn workspaces
- **Main Branch**: `forge/main` once GitHub default branch is switched
- **Default Project**: `forge-ide`
- **Tech Stack**: React 18, TypeScript, Nx 15.7.1, Webpack 5, Node 20+

### Rebrand Rules

- User-facing product name is Forge; CreditForge is acceptable when referring to the broader product vision.
- Keep internal `@forge-project/*`, `@remixproject/*`, `remix-*`, and `RemixUi*` symbols during the safe rebrand phase.
- Do not run destructive global text replacements. Patch visible surfaces file by file.
- Keep original license notices and upstream-compatible project structure.
- CreditChain chain IDs, RPC URLs, explorers, faucet URLs, and verification endpoints are placeholders until confirmed by CreditChain infrastructure.

## Critical Context

### Monorepo Structure

```
forge-project/
├── apps/          # 16+ deployable applications
│   ├── forge-ide/              # Main web IDE (default project)
│   ├── forge-desktop/           # Electron desktop app
│   ├── forge-ide-e2e/          # Nightwatch E2E tests
│   ├── circuit-compiler/       # Circuit compilation
│   ├── contract-verification/  # Contract verification tools
│   ├── noir-compiler/          # Noir language support
│   ├── solidity-compiler/      # Solidity compiler wrapper
│   └── [others...]
└── libs/          # 19+ shared libraries
    ├── forge-analyzer/         # Static analysis & security checks
    ├── forge-debug/            # Transaction debugger
    ├── forge-solidity/         # Compiler management
    ├── forge-tests/            # Solidity unit testing
    ├── forge-ai-core/          # AI features & MCP server ⭐
    ├── forge-core-plugin/      # Plugin base classes
    ├── remix-ui/               # React component library (many sub-packages)
    ├── remixd/                 # Local filesystem daemon
    └── [others...]
```

### Key Libraries to Know

**forge-ai-core** (Important for AI features):
- Location: `libs/forge-ai-core/src/`
- Structure:
  - `agents/`: Code explanation, security, completion, workspace agents
  - `remix-mcp-server/`: MCP (Model Context Protocol) server implementation
    - `handlers/`: Tool handlers (compilation, debugging, deployment, file management)
    - `providers/`: Resource providers (compilation, project, deployment, tutorials)
    - `middleware/`: Security, validation
  - `inferencers/`: Local (Ollama) and remote AI model integration
  - `prompts/`: System prompts and prompt builders

**forge-core-plugin**:
- Base classes for plugin development
- Plugin architecture based on `@remixproject/engine`
- Event-driven communication

**remix-ui**:
- Modular React components in separate packages
- Each concern has its own sub-package (e.g., `remix-ui/terminal`, `remix-ui/editor`)
- Uses Bootstrap 5 and React hooks

**forge-ide-e2e**:
- Nightwatch-based E2E tests
- Tests organized by feature with groups: `<testname>_group<number>.test.js`
- Group tags allow parallel execution: `#group1`, `#group2`, etc.
- Special requirements:
  - `ballot` tests need Ganache running locally
  - `remixd` tests need remixd daemon running
  - `gist` tests need GitHub token in `.env`

## Development Commands

```bash
# Initial setup
yarn install
yarn run build:libs    # Always build libs first
yarn build             # Build entire project
yarn serve             # Dev server (http://127.0.0.1:8080)
yarn serve:hot         # With hot module reload

# Library-specific
nx build <library-name>
nx test <library-name>
nx lint <library-name>

# E2E testing
yarn build:e2e                                    # Build tests first
yarn test:e2e --test=<testname> --group=group1   # Run specific group
yarn test:e2e --test=<testname>                  # Run all groups
yarn run select_test                             # Interactive selector

# Production
yarn run build:production
yarn run serve:production

# Utilities
nx dep-graph          # View dependency graph
yarn format           # Format code
```

## Important Patterns & Conventions

### File Organization
- TypeScript path aliases defined in `tsconfig.base.json`
- Use `@forge-project/<library-name>` imports, not relative paths across libraries
- Each library has: `src/`, `README.md`, `package.json`, `tsconfig.json`

### Testing Patterns
- Unit tests: Jest, located alongside source files
- E2E tests: Nightwatch, in `apps/forge-ide-e2e/src/tests/`
- Group tags in E2E: `'Test description #group1': function (browser) { ... }`
- Must add `'@disabled': true` to test file metadata when using groups

### Plugin Architecture
- Plugins extend base classes from `forge-core-plugin`
- Communication via event system
- API contracts defined in `remix-api`
- Uses `@remixproject/engine` framework

### UI Component Pattern
```typescript
import React from 'react'

interface ComponentProps {
  // props
}

export const Component: React.FC<ComponentProps> = (props) => {
  // React hooks for state
  // Bootstrap 5 for styling
  return <div>...</div>
}
```

### Internationalization
- Uses react-intl with FormattedMessage
- Translations managed via CrowdIn (NOT GitHub PRs)
- Locale files in `apps/forge-ide/src/app/tabs/locales/`
- Always provide `id` prop, `defaultMessage` only for dynamic IDs

## When Working on This Codebase

### Always Check First
1. **Build libs before building apps**: `yarn run build:libs` before `yarn build`
2. **Nx cache**: Uses Nx Cloud for caching (configured in `nx.json`)
3. **Node version**: Requires Node 20+ (check `package.json` engines)
4. **Branch strategy**: PRs should target `master` branch

### Common Locations
- **Tests**: `apps/forge-ide-e2e/src/tests/` (E2E), `<library>/src/**/*.spec.ts` (unit)
- **UI Components**: `libs/forge-ui/<component>/src/lib/`
- **Plugin Code**: `libs/forge-core-plugin/src/`
- **AI Features**: `libs/forge-ai-core/src/`
- **Documentation**: `README.md` in each library/app
- **Contributing Guide**: `CONTRIBUTING.md` at root

### File Reading Strategy
When exploring the codebase:
1. Start with `README.md` files in relevant directories
2. Check `package.json` for dependencies and scripts
3. Look for TypeScript interfaces/types to understand data structures
4. Read tests to understand expected behavior
5. For AI features, check `libs/forge-ai-core/src/` structure

### Code Style
- Follow JavaScript Standard Style
- TypeScript preferred for new code
- Run `yarn format` before committing
- Avoid over-engineering: keep changes focused and minimal

### Typical Task Workflows

**Adding a new library:**
```bash
nx generate @nrwl/node:library <name>
# Update build:libs script in package.json
# Add README.md
```

**Adding UI component:**
- Create in `libs/forge-ui/<component>/src/lib/`
- Export from package index
- Add tests alongside component
- Use existing Bootstrap 5 classes

**Adding E2E test:**
- Create in `apps/forge-ide-e2e/src/tests/`
- Use group tags: `#group1`, `#group2`, etc.
- Add `'@disabled': true` to metadata
- Build with `yarn build:e2e` before running

**Adding AI features:**
- Agents: `libs/forge-ai-core/src/agents/`
- MCP Handlers: `libs/forge-ai-core/src/remix-mcp-server/handlers/`
- Resource Providers: `libs/forge-ai-core/src/remix-mcp-server/providers/`
- Prompts: `libs/forge-ai-core/src/prompts/`

## Environment Variables

- `NX_CLOUD_ACCESS_TOKEN`: Nx Cloud authentication (read from env)
- `NX_ENDPOINTS_URL`: API endpoints (used in serve:endpoints, serve:ngrok)
- `NX_DESKTOP_FROM_DIST`: Desktop build configuration flag
- `WALLET_CONNECT_PROJECT_ID`: WalletConnect integration

## Known Issues & Quirks

1. **Memory issues**: May need to increase Node memory for builds
   - `node --max-old-space-size=8192` is used in some scripts

2. **Nx cache**: Sometimes needs clearing with `--skip-nx-cache` flag

3. **E2E tests**:
   - Must build with `yarn build:e2e` after any test file changes
   - Script at `apps/forge-ide-e2e/src/buildGroupTests.js` processes group tags
   - Some tests require external services (Ganache, remixd)

4. **Hot reload**: Use `yarn serve:hot` for frontend changes, not just `yarn serve`

5. **Import resolution**: Complex import resolver with support for npm, GitHub, IPFS, Swarm
   - See `apps/forge-ide-e2e/README.md` for 14 test groups covering different scenarios

6. **Plugin engine**: Uses custom plugin engine from `@remixproject/engine` package

## Project-Specific Knowledge

### Ethereum/Solidity Context
- This is a Solidity IDE, so many libraries deal with:
  - Solidity compilation and AST parsing
  - EVM debugging and transaction tracing
  - Static analysis for security vulnerabilities
  - Smart contract testing and deployment

### Desktop vs Web IDE
- `forge-ide`: Web application (main focus)
- `forge-desktop`: Electron wrapper with additional local file access
- Both share most code but have different build configurations

### Plugin System
- Remix is highly extensible through plugins
- Plugins can be loaded from URLs, local files, or built-in
- Communication via pub/sub event system
- Each plugin has a profile (name, description, methods, events)

### Testing Philosophy
- Group-based E2E tests for parallel execution
- Tests can run in isolation or all groups sequentially
- CircleCI runs tests in parallel across multiple containers
- Can tag tests with `#flaky` to run across all instances

## Documentation & Resources

- **Main Docs**: https://forge-ide.readthedocs.io/en/latest/
- **Discord**: https://discord.gg/MzhfCGstNA
- **Contributing**: See `CONTRIBUTING.md` at root
- **Libs Overview**: See `libs/README.md`
- **E2E Testing**: See `apps/forge-ide-e2e/README.md`
- **MetaMask Testing**: See `apps/forge-ide-e2e/METAMASK.md`
- **CircleCI**: See `apps/forge-ide-e2e/CIRCLE_CI.md`

## Updates to This File

Team members should update this file when:
- New critical patterns emerge
- Project structure changes significantly
- Important conventions are established
- Common pitfalls are discovered
- New tools or workflows are adopted

**Format**: Keep this document focused on what Claude needs to know, not general development docs.

---

**Last Updated**: 2026-01-08 by team member
**Purpose**: Context document for Claude Code AI assistant
