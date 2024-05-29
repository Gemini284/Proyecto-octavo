import { HeaderParams } from "@tsed/platform-params";
import { Controller } from "@tsed/di";
import { Post } from "@tsed/schema";

import { spawn } from "child_process";

import Screenshot from "../../services/Screenshot";

@Controller("/Analize")
class AnalizeCtrl {
    constructor(private screenshotService: Screenshot) {};

    @Post()
    async Analize(@HeaderParams() url: string): Promise<Buffer> {
        try{
            const screenshot = await this.screenshotService.screenshot(url);

            return screenshot;
        }catch(error){
            throw new Error(error);
        }
    }
};

export default AnalizeCtrl;