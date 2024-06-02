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
    async Analize(@BodyParams() @Required() page: Page, @Res() res: Response): Promise<void> {
        try{
            const { url } = page;
            const screenshot: Buffer = await this.screenshotService.screenshot(url);

            const SCRIPT_PATH: string = path.resolve(__dirname, "../../scripts/gradcam.py");
            const PYTHON_PROCESS = spawn("python3", [SCRIPT_PATH, ""]);

            const responseBuff: Buffer[] = [];
            const bufferDataPromise: Promise<Buffer> = new Promise<Buffer>((resolve, reject) => {
                PYTHON_PROCESS.stdout.on("data", resBuffer => {
                    console.log("Received data chunk from Python script: ", resBuffer);
                    responseBuff.push(resBuffer)
                });
                PYTHON_PROCESS.stdout.on("end", () => {
                    const RESULT_PNG: Buffer = Buffer.concat(responseBuff);
                    console.log("Buffer Lenght: ", RESULT_PNG.length);
                    resolve(RESULT_PNG);
                });

                // Handle errors
                PYTHON_PROCESS.stderr.on("data", data => reject(data?.toString()));
                PYTHON_PROCESS.on("close", code => code !== 0 ? reject(new Error("Error executing Python process.")) : null);
            });

            const bufferData: Buffer = await bufferDataPromise;
            res.contentType("image/png");
            res.send(bufferData);
        }catch(error){
            console.error("Error in AnalizeCtrl: ", error);
            if(!res.headersSent) res.status(500).send(error?.message);
        }
    }
};

export default AnalizeCtrl;