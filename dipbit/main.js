const puppeteer = require('puppeteer')

async function run() {
    const browser = await puppeteer.launch({
        headless: false,
        defaultViewport: { width: 1366, height: 768 }
    })
    const page = await browser.newPage()

    await page.evaluateOnNewDocument(() => {
        Object.defineProperty(navigator, 'webdriver', {
            get: () => false
        })
    })

    await page.goto('https://www.dipbit.com/auth/login')
    await page.type('#email', 'js@automation.com')
    await page.type('#password', 'password123')

    let sliderElement = await page.$('.slidetounlock')
    let slider = await sliderElement.boundingBox()

    let sliderHandle = await page.$('.nc_iconfont.btn_slide')
    let handle = await sliderHandle.boundingBox()

    await page.mouse.move(handle.x + handle.width / 2, handle.y + handle.height / 2)
    await page.mouse.down()
    await page.mouse.move(handle.x + slider.width, handle.y + handle.height / 2, { steps: 50 })
    await page.mouse.up()

    await page.waitFor(3000)

    // success!

    await browser.close()
}

run()
