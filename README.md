# 로컬 실행 시

```bash
# npm
npm install

npx prisma generate

#외부 접속 가능하게
npx nuxt dev --host 0.0.0.0 --port 3000

// api에 있는 js 파일들 prisma import를 @prisma/client로해야함
```

# 빌드 배포 실행 시

```bash
# npm
npm install

npx prisma generate

npm run generate
npx serve .output/public

// api에 있는 js 파일들 prisma를 .prisma/client로해야함
```

# Nuxt 3 Minimal Starter

Look at the [Nuxt 3 documentation](https://nuxt.com/docs/getting-started/introduction) to learn more.

## Setup

Make sure to install the dependencies:

```bash
# npm
npm install

# pnpm
pnpm install

# yarn
yarn install

# bun
bun install
```

## Development Server

Start the development server on `http://localhost:3000`:

```bash
# npm
npm run dev

# pnpm
pnpm run dev

# yarn
yarn dev

# bun
bun run dev
```

## Production

Build the application for production:

```bash
# npm
npm run build

# pnpm
pnpm run build

# yarn
yarn build

# bun
bun run build
```

Locally preview production build:

```bash
# npm
npm run preview

# pnpm
pnpm run preview

# yarn
yarn preview

# bun
bun run preview
```

Check out the [deployment documentation](https://nuxt.com/docs/getting-started/deployment) for more information.
