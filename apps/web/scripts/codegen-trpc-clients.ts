/**
 * This script generates the tRPC clients which work with jump to definition
 */

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

// Get the equivalent of __dirname for ES modules
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const PKG_DIR = path.resolve(__dirname, '..')

const pkgJson = JSON.parse(
  fs.readFileSync(path.join(PKG_DIR, 'package.json'), 'utf-8'),
)
const routers = Object.keys(pkgJson.dependencies)
  .filter((it) => it.startsWith('@org/router'))
  .map((it) => it.replace('@org/', ''))

const TEMPLATE = fs
  .readFileSync(`${__dirname}/client.base.ts`, 'utf-8')
  .toString()
  // remove any '// @ts-expect-error' comments
  .replace(/\/\/ @ts-expect-error.*/g, '')

const TARGET_DIR = `${PKG_DIR}/src/generated-trpc-client`

// first delete target dir if it exists
if (fs.existsSync(TARGET_DIR)) {
  fs.rmSync(TARGET_DIR, { recursive: true })
}

// then create it again
fs.mkdirSync(TARGET_DIR, { recursive: true })

function upperCaseFirst(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1)
}

for (const pkgName of routers) {
  const routerInstance = pkgName
  const routerType = upperCaseFirst(routerInstance)
  const tsPath = `@org/${pkgName}`

  const out = TEMPLATE.replaceAll('__TS_PATH__', tsPath)
    .replaceAll('__ROUTER_TYPE__', routerType)
    .replaceAll('__ROUTER_INSTANCE__', routerInstance)

  fs.writeFileSync(`${TARGET_DIR}/${routerInstance}.ts`, out)
}
