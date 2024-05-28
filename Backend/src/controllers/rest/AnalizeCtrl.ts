import { BodyParams } from "@tsed/platform-params";
import { Controller } from "@tsed/di";
import { Post } from "@tsed/schema";
import Screenshot from "src/services/Screenshot";

@Controller("/Analize")
class AnalizeCtrl {
    @Post()
    Analize(@BodyParams() url: string): string {
        
        return url;
    }
};

export default AnalizeCtrl;