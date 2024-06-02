import { BodyParams } from "@tsed/platform-params";
import { Controller } from "@tsed/di";
import { Post, Required } from "@tsed/schema";
import { Res } from "@tsed/common";

import type { Response } from "express";
import { spawn } from "child_process";
import * as path from "path";
import * as fs from "fs";
import * as util from "util";

import Screenshot from "../../services/Screenshot";

interface Page {
    url: string
}

const writeFile = util.promisify(fs.writeFile);
const unlink = util.promisify(fs.unlink);

@Controller("/Analize")
class AnalizeCtrl {
    constructor(private screenshotService: Screenshot) {};

    @Post()
    async Analize(@BodyParams() @Required() page: Page, @Res() res: Response): Promise<void> {
        try{
            // Take the screenshot
            const { url } = page;
            const screenshot: Buffer = await this.screenshotService.screenshot(url);

            const IMAGE_PATH: string = path.resolve(__dirname, "..\\..\\temp\\temp.png");
            await writeFile(IMAGE_PATH, screenshot);

            // Create child process
            const SCRIPT_PATH: string = path.resolve(__dirname, "..\\..\\scripts\\gradcam.py");
            const PYTHON_PROCESS = spawn("python3", [SCRIPT_PATH, IMAGE_PATH]);
            console.log(IMAGE_PATH)
            console.log(SCRIPT_PATH)

            let hasCriticalError: boolean = false;
            const responseBuff: Buffer[] = [];
            const bufferDataPromise: Promise<Buffer> = new Promise<Buffer>((resolve, reject) => {
                PYTHON_PROCESS.stdout.on("data", resBuffer => {
                    console.log("Received data chunk from Python script: ", resBuffer);
                    responseBuff.push(resBuffer)
                });
                PYTHON_PROCESS.stdout.on("end", async() => {
                    if(hasCriticalError){
                        reject(new Error("Critical error in Python script."));
                        return;
                    }

                    const RESULT_PNG: Buffer = Buffer.concat(responseBuff);
                    console.log("Buffer Lenght: ", RESULT_PNG.length);
                    resolve(RESULT_PNG);

                    // try {
                    //     await unlink(IMAGE_PATH);
                    //     console.log("Image deleted successfully");
                    // } catch (error) {
                    //     console.error("Error deleting image: ", error);
                    // }
                });

                // Handle errors
                let count: number = 0;
                PYTHON_PROCESS.stderr.on("data", data => {
                    const errorMessage: string = data?.toString();
                    if(errorMessage.toLowerCase().includes("warning")){
                        console.warn("Python Warning: ", ++count, " ", errorMessage);
                    }else{
                        console.error("Error executing Python: ", ++count, " ", errorMessage);
                        hasCriticalError = true;
                    }
                });
                PYTHON_PROCESS.on("close", code => (code !== 0 && !hasCriticalError) ? reject(new Error("Error executing Python process.")) : null);
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