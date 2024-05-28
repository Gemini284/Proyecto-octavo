import { Post, Get } from "@tsed/schema";
import { Controller } from "@tsed/di";

@Controller("/Analize")
class AnalizeCtrl {
    @Get()
    hello(): string {
        return "HOLA DESDE ANALIZE";
    }
};

export default AnalizeCtrl;