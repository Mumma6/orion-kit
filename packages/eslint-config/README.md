# @workspace/eslint-config

Shared ESLint configurations for the Orion Kit monorepo.

## Available Configurations

### Base Configuration

```javascript
import { config } from "@workspace/eslint-config/base";
```

- Core ESLint rules
- TypeScript support
- Turbo plugin
- Prettier integration

### Library Configuration

```javascript
import { config } from "@workspace/eslint-config/library";
```

- For non-React library packages
- Extends base configuration
- Library-specific rules

### Node.js Configuration

```javascript
import { config } from "@workspace/eslint-config/node";
```

- For Node.js packages
- Node.js globals
- Allows console.log

### Next.js Configuration

```javascript
import { config } from "@workspace/eslint-config/next-js";
```

- For Next.js applications
- React and React Hooks rules
- Next.js specific rules

### React Internal Configuration

```javascript
import { config } from "@workspace/eslint-config/react-internal";
```

- For React library packages
- React and React Hooks rules
- Browser globals

## Usage

Create an `eslint.config.js` file in your package:

```javascript
import { config } from "@workspace/eslint-config/library";

export default config;
```

## Package.json Scripts

Add these scripts to your package.json:

```json
{
  "scripts": {
    "lint": "eslint . --max-warnings 0",
    "lint:fix": "eslint . --fix"
  }
}
```
