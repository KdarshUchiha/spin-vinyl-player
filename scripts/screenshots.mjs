import { chromium } from 'playwright'
import { mkdirSync } from 'fs'

mkdirSync('docs/screenshots', { recursive: true })
const browser = await chromium.launch()
const errs = []

async function shoot(viewport, label, route) {
  const ctx = await browser.newContext({ viewport })
  const page = await ctx.newPage()
  page.on('pageerror', (e) => errs.push(`${label} pageerror: ${e.message}`))
  page.on('console', (m) => { if (m.type() === 'error' && !m.text().includes('503')) errs.push(`${label} err: ${m.text()}`) })
  await page.goto('http://localhost:5173/', { waitUntil: 'networkidle' })
  await page.waitForTimeout(1500)
  // dismiss onboarding
  await page.evaluate(() => localStorage.setItem('vp_onboarded', '1'))
  await page.reload({ waitUntil: 'networkidle' })
  await page.waitForTimeout(1200)
  if (route === 'home') {
    // already there
  } else if (route === 'search') {
    if (viewport.width < 820) await page.locator('.bnav-btn').nth(1).click()
    else await page.locator('.nav-btn').nth(1).click()
    await page.waitForTimeout(400)
    await page.fill('input[placeholder*="Songs"]', 'the weeknd')
    await page.waitForTimeout(1500)
  } else if (route === 'library') {
    if (viewport.width < 820) await page.locator('.bnav-btn').nth(2).click()
    else await page.locator('.nav-btn').nth(2).click()
    await page.waitForTimeout(500)
  } else if (route === 'about') {
    if (viewport.width < 820) await page.locator('.bnav-btn').nth(3).click()
    else await page.locator('.nav-btn').nth(3).click()
    await page.waitForTimeout(500)
  } else if (route === 'onboarding') {
    await page.evaluate(() => localStorage.removeItem('vp_onboarded'))
    await page.reload({ waitUntil: 'networkidle' })
    await page.waitForTimeout(1500)
  }
  await page.screenshot({ path: `docs/screenshots/${label}.png` })
  await ctx.close()
}

await shoot({ width: 1400, height: 900 }, 'home-desktop', 'home')
await shoot({ width: 1400, height: 900 }, 'search-desktop', 'search')
await shoot({ width: 1400, height: 900 }, 'library-desktop', 'library')
await shoot({ width: 1400, height: 900 }, 'about-desktop', 'about')
await shoot({ width: 1400, height: 900 }, 'onboarding', 'onboarding')
await shoot({ width: 390, height: 844 }, 'home-mobile', 'home')
await shoot({ width: 390, height: 844 }, 'search-mobile', 'search')
await shoot({ width: 390, height: 844 }, 'library-mobile', 'library')

await browser.close()
console.log(JSON.stringify({ errs }, null, 2))
