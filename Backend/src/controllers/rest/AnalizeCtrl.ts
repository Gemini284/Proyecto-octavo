import { BodyParams } from "@tsed/platform-params";
import { Controller } from "@tsed/di";
import { Post, Required } from "@tsed/schema";
import { Res } from "@tsed/common";

import type { Response } from "express";
import { spawn } from "child_process";
import * as path from "path";

import Screenshot from "../../services/Screenshot";

interface Page {
    url: string
}

@Controller("/Analize")
class AnalizeCtrl {
    constructor(private screenshotService: Screenshot) {};

    @Post()
    async Analize(@BodyParams() @Required() page: Page, @Res() res: Response): Promise<Buffer> {
        try{
            const { url } = page;
            const screenshot: Buffer = await this.screenshotService.screenshot(url);

            const SCRIPT_PATH: string = path.resolve(__dirname, "../scripts/test.py");
            const PYTHON_PROCESS = spawn("python3", [SCRIPT_PATH, "ElPepe", "666", "--ciudad", "Tepic"]);

            const responseBuff: Buffer[] = [];
            const bufferData: Buffer = await new Promise((resolve, reject) => {
                try{
                    PYTHON_PROCESS.stdout.on("data", resBuffer => responseBuff.push(resBuffer));
                    PYTHON_PROCESS.stdout.on("end", () => {
                        const RESULT_PNG: Buffer = Buffer.concat(responseBuff);
                        // res.contentType("image/png");
                        resolve(RESULT_PNG);
                    });
                }catch(error){
                    reject(error);
                }
            });

            // Handle errors
            PYTHON_PROCESS.stderr.on("data", data => console.log("Error in data: ", data));
            PYTHON_PROCESS.on("close", code => code !== 0 ? res.status(500).send("Error executing Python process.") : null);
        
            return bufferData;
        }catch(error){
            res.status(500).send(error.message);
            throw new Error(error);
        }
    }
};

export default AnalizeCtrl;