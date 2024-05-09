import {Controller} from "@tsed/di";
import {Get} from "@tsed/schema";

@Controller("/gpt")
export class GptController {
  @Get("/")
  get() {
    return "hello";
  }
}
