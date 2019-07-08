const puppeteer = require('puppeteer')
const Rembrandt = require('rembrandt')

async function run () {
    const browser = await puppeteer.launch({
        headless: false,
        defaultViewport: { width: 1366, height: 768 }
    })
    const page = await browser.newPage()

    let originalImage = ''

    await page.setRequestInterception(true)
    page.on('request', request => request.continue())
    page.on('response', async response => {
        if (response.request().resourceType() === 'image')
            originalImage = await response.buffer().catch(() => {})
    })

    await page.goto('https://monoplasty.github.io/vue-monoplasty-slide-verify/')

    const sliderElement = await page.$('.slide-verify-slider')
    const slider = await sliderElement.boundingBox()

    const sliderHandle = await page.$('.slide-verify-slider-mask-item')
    const handle = await sliderHandle.boundingBox()

    let currentPosition = 0
    let bestSlider = {
        position: 0,
        difference: 100
    }

    await page.mouse.move(handle.x + handle.width / 2, handle.y + handle.height / 2)
    await page.mouse.down()

    while (currentPosition < slider.width - handle.width / 2) {

        await page.mouse.move(
            handle.x + currentPosition,
            handle.y + handle.height / 2 + Math.random() * 10 - 5
        )

        let sliderContainer = await page.$('.slide-verify')
        let sliderImage = await sliderContainer.screenshot()

        const rembrandt = new Rembrandt({
            imageA: originalImage,
            imageB: sliderImage,
            thresholdType: Rembrandt.THRESHOLD_PERCENT
        })

        let result = await rembrandt.compare()
        let difference = result.percentageDifference * 100

        if (difference < bestSlider.difference) {
            bestSlider.difference = difference
            bestSlider.position = currentPosition
        }

        currentPosition += 5
    }

    await page.mouse.move(handle.x + bestSlider.position, handle.y + handle.height / 2, { steps: 10 })
    await page.mouse.up()

    await page.waitFor(3000)

    // success!

    await browser.close()
}

run()