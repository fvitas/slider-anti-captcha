const puppeteer = require('puppeteer')

async function run() {
    const browser = await puppeteer.launch({
        headless: false,
        defaultViewport: { width: 1366, height: 768 }
    })
    const page = await browser.newPage()

    await page.goto('http://kthornbloom.com/slidetosubmit/')
    await page.type('input[name="name"]', 'Puppeteer Bot')
    await page.type('input[name="email"]', 'js@automation.com')

    let sliderElement = await page.$('.slide-submit')
    let slider = await sliderElement.boundingBox()

    let sliderHandle = await page.$('.slide-submit-thumb')
    let handle = await sliderHandle.boundingBox()

    await page.mouse.move(handle.x + handle.width / 2, handle.y + handle.height / 2)
    await page.mouse.down()
    await page.mouse.move(handle.x + slider.width, handle.y + handle.height / 2, { steps: 10 })
    await page.mouse.up()

    await page.waitFor(3000)

    // success!

    await browser.close()
}

run()