import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

// Get the equivalent of __dirname for ES modules
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const apiPkgDir = path.join(__dirname, '../packages/api')

// Modify this is if you want to try bigger routers
// Each router will have 5 procedures + a small sub-router with 2 procedures
const NUM_ROUTERS = 50

const PACKAGES_DIR = path.join(__dirname, '../generated-routers')
if (!fs.existsSync(PACKAGES_DIR)) {
  fs.mkdirSync(PACKAGES_DIR, { recursive: true })
} else {
  fs.rmSync(PACKAGES_DIR, { recursive: true, force: true })
}

// read template files
const codegenBase = fs.readFileSync(__dirname + '/codegen-base.ts', 'utf-8')
const packageJson = fs.readFileSync(
  __dirname + '/codegen-package.json',
  'utf-8',
)

function createRouterPackage(routerName: string) {
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
    JSON.stringify({
      "extends": ["@org/tsconfig/base.json"],
      "references": [
        {
          "path": "../../packages/utils"
        },
        {
          "path": "../../packages/trpc"
        }
      ],
    }, null, 2),
  )

  
}

const routerPackages: string[] = []
for (let i = 0; i < NUM_ROUTERS; i++) {
  const routerName = `router${i}`
  routerPackages.push(routerName)
  createRouterPackage(routerName)
}

// Create root package that exports all routers
const rootIndexFile = `
import { router } from '@org/trpc';

${routerPackages.map((name) => `import { ${name} } from '@org/${name}';`).join('\n')}

export const appRouter = router({
  ${routerPackages.join(',\n  ')}
});

export type AppRouter = typeof appRouter;
`.trim()

const apiSrcDir = path.join(apiPkgDir, 'src')
if (!fs.existsSync(apiSrcDir)) {
  fs.mkdirSync(apiSrcDir, { recursive: true })
}
fs.writeFileSync(path.join(apiSrcDir, 'index.ts'), rootIndexFile)

// Add generated router packages as dependencies to api package.json
const apiPackageJsonPath = path.join(apiPkgDir, 'package.json')
const apiPackageJson = JSON.parse(fs.readFileSync(apiPackageJsonPath, 'utf-8'))

// Remove any existing @org/router dependencies
for (const dep in apiPackageJson.dependencies) {
  if (dep.includes('@org/router')) {
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


// Update root tsconfig.json to include references to generated router packages
const rootTsConfigPath = path.join(process.cwd(), 'tsconfig.json')
const rootTsConfig = JSON.parse(fs.readFileSync(rootTsConfigPath, 'utf-8'))

// Remove any existing router references
rootTsConfig.references = rootTsConfig.references.filter(
  (ref: { path: string }) => !ref.path.startsWith('generated-routers/'),
)

// Add references for each generated router
for (const routerName of routerPackages) {
  rootTsConfig.references.push({
    path: `./generated-routers/${routerName}`,
  })
}

// Write updated tsconfig.json
fs.writeFileSync(
  rootTsConfigPath,
  JSON.stringify(rootTsConfig, null, 2) + '\n',
)


// Update api tsconfig.json to include references to generated router packages
const apiTsConfigPath = path.join(apiPkgDir, 'tsconfig.json')
const apiTsConfigStr = fs.readFileSync(apiTsConfigPath, 'utf-8')
const apiTsConfig = JSON.parse(apiTsConfigStr)


// Initialize references array if it doesn't exist
if (!apiTsConfig.references) {
  apiTsConfig.references = []
}

// Remove any existing router references
apiTsConfig.references = apiTsConfig.references.filter(
  (ref: { path: string }) => !ref.path.startsWith('../../generated-routers/'),
)

// Add references for each generated router
for (const routerName of routerPackages) {
  apiTsConfig.references.push({
    path: `../../generated-routers/${routerName}`,
  })
}

// Write updated tsconfig.json
fs.writeFileSync(
  apiTsConfigPath,
  JSON.stringify(apiTsConfig, null, 2) + '\n',
)


