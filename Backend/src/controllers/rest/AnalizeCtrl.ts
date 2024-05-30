import { BodyParams } from "@tsed/platform-params";
import { Controller } from "@tsed/di";
import { Post, Required } from "@tsed/schema";

import { spawn } from "child_process";

import Screenshot from "../../services/Screenshot";

interface Page {
    url: string
}

@Controller("/Analize")
class AnalizeCtrl {
    constructor(private screenshotService: Screenshot) {};

    @Post()
    async Analize(@BodyParams() @Required() page: Page): Promise<Buffer> {
        try{
            const { url } = page;
            const screenshot = await this.screenshotService.screenshot(url);

            return screenshot;
        }catch(error){
            throw new Error(error);
        }
    }
};

export default AnalizeCtrl;