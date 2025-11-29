# Dev Tools Platform

A comprehensive web-based developer tools platform built with [Next.js](https://nextjs.org) and [React](https://react.dev). This application provides a collection of utilities for developers, including JSON tools, JWT decoding, regex testing, UUID generation, and more.

## Features

The platform includes three main tool categories:

### 🛠️ Dev Tools
- **API Tester** - Test HTTP requests and APIs
- **Hash Generator** - Generate hash values
- **JSON Tools** - Format, validate, and transform JSON
- **JWT Decoder** - Decode and inspect JWT tokens
- **Minifier** - Minify JavaScript, CSS, and HTML
- **Regex Tester** - Test and validate regular expressions
- **UUID Generator** - Generate UUIDs (v1, v3, v4, v5)
- **Diff Checker** - Compare two texts and view differences

### 🚀 DevOps Tools
- **CI/CD** - CI/CD pipeline utilities
- **cURL Generator** - Generate cURL commands
- **Docker** - Docker utilities and commands
- **HTTP Tools** - HTTP/REST utilities
- **Kubernetes** - K8s utilities and configurations
- **Logs** - Log parsing and analysis
- **Terraform** - Terraform templates and utilities

### 🧪 Test Tools
- **Browser Testing** - Browser compatibility testing
- **Test Data** - Generate mock test data
- **Performance** - Performance testing utilities
- **CSS Selectors** - Test CSS selectors
- **Webhooks** - Webhook testing and debugging

## Tech Stack

- **Framework**: [Next.js 16](https://nextjs.org) with App Router
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com)
- **UI Components**: [Radix UI](https://www.radix-ui.com/)
- **Code Editor**: [Monaco Editor](https://microsoft.github.io/monaco-editor/)
- **Theme Management**: [next-themes](https://github.com/pacocoursey/next-themes)
- **State Management**: [Zustand](https://github.com/pmndrs/zustand)
- **Notifications**: [Sonner](https://sonner.emilkowal.ski/)
- **Icons**: [Lucide React](https://lucide.dev/)

## Prerequisites

- **Node.js**: v18 or higher
- **npm**, **yarn**, **pnpm**, or **bun** package manager

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd dev-tools-platform
```

2. Install dependencies:
```bash
npm install
# or
yarn install
# or
pnpm install
# or
bun install
```

## Running the Project

### Development Server

Start the development server with hot reload:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to view the application.

### Production Build

Create an optimized production build:

```bash
npm run build
```

Start the production server:

```bash
npm run start
```

### Linting

Run ESLint to check code quality:

```bash
npm run lint
```

## Project Structure

```
src/
├── app/
│   ├── layout.tsx           # Root layout
│   ├── page.tsx             # Home page
│   ├── globals.css          # Global styles
│   ├── api/
│   │   └── proxy/           # API proxy endpoint
│   └── tools/
│       ├── dev/             # Development tools
│       ├── devops/          # DevOps tools
│       └── test/            # Testing tools
├── components/
│   ├── layout/              # Layout components
│   ├── tools/               # Tool-specific components
│   ├── ui/                  # Reusable UI components
│   ├── mode-toggle.tsx      # Dark/light mode toggle
│   ├── search-command.tsx   # Search/command palette
│   └── theme-provider.tsx   # Theme configuration
├── hooks/                   # Custom React hooks
└── lib/
    ├── utils.ts             # Utility functions
    └── json-utils.ts        # JSON processing utilities
```

## Development Workflow

### Editing Pages

You can start editing by modifying files in the `src/app` directory. Changes are reflected in the browser instantly with Next.js hot reload.

### Adding New Tools

To add a new tool:

1. Create a new directory under `src/app/tools/{category}/`
2. Add a `page.tsx` file with your tool component
3. The route will be automatically created based on the directory structure

### Custom Hooks

Place custom React hooks in `src/hooks/` directory following the `useHookName` naming convention.

### UI Components

Reusable UI components are located in `src/components/ui/`. These are built with Radix UI primitives and styled with Tailwind CSS.

## Configuration Files

- **`tsconfig.json`** - TypeScript configuration
- **`next.config.ts`** - Next.js configuration
- **`tailwind.config.ts`** - Tailwind CSS configuration
- **`postcss.config.mjs`** - PostCSS configuration
- **`eslint.config.mjs`** - ESLint configuration
- **`components.json`** - UI component configuration

## Environment Variables

Create a `.env.local` file in the root directory if needed for environment-specific configuration:

```bash
# Example environment variables
NEXT_PUBLIC_API_URL=http://localhost:3000
```

## Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)

## Performance Optimizations

- **Next.js Optimizations**: Image optimization, code splitting, automatic static generation
- **Tailwind CSS**: Unused CSS pruning
- **Code Minification**: Using Terser for production builds
- **Font Optimization**: Using next/font for Geist font family

## Troubleshooting

### Port Already in Use

If port 3000 is already in use, you can specify a different port:

```bash
npm run dev -- -p 3001
```

### Dependencies Installation Issues

If you encounter issues during installation:

```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

### Build Errors

Check that you're using Node.js v18 or higher:

```bash
node --version
```

## Learn More

For more information about the technologies used in this project:

- [Next.js Documentation](https://nextjs.org/docs)
- [React Documentation](https://react.dev)
- [TypeScript Documentation](https://www.typescriptlang.org/docs/)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Radix UI Documentation](https://www.radix-ui.com/docs/primitives)

## Deployment

### Deploy on Vercel

The easiest way to deploy this application is using the [Vercel Platform](https://vercel.com) from the creators of Next.js.

1. Push your code to a Git repository (GitHub, GitLab, or Bitbucket)
2. Connect your repository to [Vercel](https://vercel.com/new)
3. Vercel will automatically detect Next.js and configure the build settings
4. Your application will be deployed and accessible via a Vercel URL

For detailed deployment instructions, see [Next.js Deployment Documentation](https://nextjs.org/docs/app/building-your-application/deploying).

### Other Deployment Options

- **Docker**: Build a containerized version for deployment
- **Self-hosted**: Deploy to any Node.js-compatible server
- **Netlify**: Using Next.js adapter for Netlify

## Contributing

Contributions are welcome! Please follow these guidelines:

1. Create a new branch for your feature
2. Make your changes
3. Run the linter: `npm run lint`
4. Build the project: `npm run build`
5. Submit a pull request

## License

This project is private. For licensing details, contact the project owner.

## Support

For issues, questions, or suggestions, please open an issue in the repository.
