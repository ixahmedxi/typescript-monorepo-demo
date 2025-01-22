import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

// Get the equivalent of __dirname for ES modules
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const rootDir = path.join(__dirname, '..')
const apiPkgDir = path.join(rootDir, 'packages/api')

// Modify this is if you want to try bigger routers
// Each router will have 5 procedures + a small sub-router with 2 procedures
const NUM_ROUTERS = 50

const PACKAGES_DIR = path.join(__dirname, '../generated-routers')
if (!fs.existsSync(PACKAGES_DIR)) {
  fs.mkdirSync(PACKAGES_DIR, { recursive: true })
}

// read template files
const codegenBase = fs.readFileSync(
  path.join(__dirname, '/codegen-base.ts'),
  'utf-8',
)
const packageJson = fs.readFileSync(
  path.join(__dirname, '/codegen-package.json'),
  'utf-8',
)

const routerPackages: Set<string> = new Set(
  Array.from(
    { length: NUM_ROUTERS },
    (_, i) => `router${String(i + 1).padStart(3, '0')}`,
  ),
)
for (const routerName of routerPackages) {
  const packageDir = path.join(PACKAGES_DIR, routerName)

  const srcDir = path.join(packageDir, 'src')

  // Create package directory structure
  fs.mkdirSync(packageDir, { recursive: true })
  fs.mkdirSync(srcDir, { recursive: true })

  // Create package.json
  const routerPackageJson = packageJson.replace(/__ROUTER__NAME__/g, routerName)
  fs.writeFileSync(path.join(packageDir, 'package.json'), routerPackageJson)

  // Create index.ts with router implementation
  const routerCode = codegenBase.replace('__ROUTER__NAME__', routerName)
  fs.writeFileSync(path.join(srcDir, 'index.ts'), routerCode)

  fs.writeFileSync(
    path.join(packageDir, 'tsconfig.json'),
    fs.readFileSync(path.join(apiPkgDir, 'tsconfig.json'), 'utf-8'),
  )
}

// Remove all folders in generated-routers that isn't in routerPackages
const generatedRouters = fs.readdirSync(PACKAGES_DIR)
for (const router of generatedRouters) {
  if (!router.startsWith('.') && !routerPackages.has(router)) {
    fs.rmdirSync(path.join(PACKAGES_DIR, router), { recursive: true })
  }
}

// Create root package that exports all routers
const rootIndexFile = `
import { router } from '@org/trpc';

${[...routerPackages].map((name) => `import { ${name} } from '@org/${name}';`).join('\n')}

export const appRouter = router({
  ${[...routerPackages].join(',\n  ')}
});

export type AppRouter = typeof appRouter;
`.trim()

fs.writeFileSync(path.join(apiPkgDir, 'src/index.ts'), rootIndexFile)

// Add generated router packages as dependencies to api package.json
function updateApiPackageJsonDependencies(dir: string) {
  const apiPackageJsonPath = path.join(dir, 'package.json')
  const apiPackageJson = JSON.parse(
    fs.readFileSync(apiPackageJsonPath, 'utf-8'),
  )

  // Remove any existing @org/router dependencies
  for (const dep in apiPackageJson.dependencies) {
    if (dep.startsWith('@org/router')) {
      delete apiPackageJson.dependencies[dep]
    }
  }

  // Add each router package as a dependency
  for (const routerName of routerPackages) {
    apiPackageJson.dependencies[`@org/${routerName}`] = 'workspace:*'
  }

  // Write updated package.json
  fs.writeFileSync(
    apiPackageJsonPath,
    JSON.stringify(apiPackageJson, null, 2) + '\n',
  )
}

updateApiPackageJsonDependencies(apiPkgDir)
updateApiPackageJsonDependencies(path.join(rootDir, 'apps/web'))

// Stalls the process smh
// try {
//   execSync(`pnpm install --ignore-scripts`, {
//     stdio: 'inherit',
//   })
// } catch {
//   // continue
// }
// console.log('Done!')
