import { chromium } from 'playwright'
import { readFileSync, writeFileSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, resolve } from 'path'

const here = dirname(fileURLToPath(import.meta.url))
const svg = readFileSync(resolve(here, '../public/og.svg'), 'utf8')

const browser = await chromium.launch()
const page = await browser.newPage({ viewport: { width: 1200, height: 630 } })
await page.setContent(`<html><body style="margin:0">${svg}</body></html>`)
await page.waitForTimeout(200)
const buf = await page.screenshot({ omitBackground: false, type: 'png', clip: { x: 0, y: 0, width: 1200, height: 630 } })
writeFileSync(resolve(here, '../public/og.png'), buf)
await browser.close()
console.log('og.png written')
