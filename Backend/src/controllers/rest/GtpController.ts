import {Controller} from "@tsed/di";
import {Get} from "@tsed/schema";

@Controller("/gtp")
export class GtpController {
  @Get("/")
  get() {
    return "hello";
  }
}
