import {Controller} from "@tsed/di";
import {Get} from "@tsed/schema";
import { QueryParams } from "@tsed/common"
import OpenAI from "openai";

const openai = new OpenAI(process.env.OPEN AI_API_KEY || "default api key");
@Controller("/gpt")
export class GptController {
  
  @Get("/")
  async get(@QueryParams("imageUrl") imageUrl: string) {
    try {
      if (!imageUrl) {
        return "Please provide an image URL"; // Return an error message
      }

      const response = await openai.chat.completions.create({
        model: "gpt-4-turbo",
        messages: [
          {
            role: "user",
            content: [
              { type: "text", text: "Tell me the contents of the following web page? Mention all the ui components that you can see, such as buttons, fields, forms, videos, images and all that you can find" },
              {
                type: "image_url",
                image_url: {
                  "url": imageUrl,
                  "detail": "low"
                },
              },
            ],
          },
        ],
      });
      
      return response.choices[0].text; // return the generated text
    } catch (error) {
      // Handle errors here
      console.error("Error calling OpenAI API:", error);
      return "Error occurred"; // Return an error message
    }
  }
}
