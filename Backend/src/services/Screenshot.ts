import { Service } from "@tsed/di";
import puppeteer from "puppeteer";
import type { Browser, Page } from "puppeteer";

@Service()
class Screenshot {
    async screenshot(uwu: string): Promise<Buffer> {
        // console.log("||", uwu, "||");
        const browser: Browser = await puppeteer.launch();
        const page: Page = await browser.newPage();
        await page.goto(uwu, { waitUntil: "networkidle2", timeout: 0});
        const SS: Buffer = await page.screenshot();
        await browser.close();

        return SS;
    }
};

export default Screenshot;