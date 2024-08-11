import axios from 'axios'
import { OpenAI } from 'openai'
import { StructuredOutputParser } from 'langchain/output_parsers'
import z from 'zod'
import { PromptTemplate } from '@langchain/core/prompts'

// Define the Zod schema for the output parser
const parser = StructuredOutputParser.fromZodSchema(
 z.object({
    mood: z
      .string()
      .describe('the mood of the person who wrote the journal entry.'),
    subject: z.string().describe('the subject of the journal entry.'),
    negative: z
      .boolean()
      .describe(
        'is the journal entry negative? (i.e. does it contain negative emotions?).'
      ),
    summary: z.string().describe('quick summary of the entire entry.'),
    color: z
      .string()
      .describe(
        'a hexidecimal color code that represents the mood of the entry. Example #0101fe for blue representing happiness.'
      ),
    sentimentScore: z
      .number()
      .describe(
        'sentiment of the text and rated on a scale from -10 to 10, where -10 is extremely negative, 0 is neutral, and 10 is extremely positive.'
      ),
  })
)

const getPrompt = async (content: any) => {
  const format_instructions = parser.getFormatInstructions()
  const prompt = new PromptTemplate({
    template:
      'Analyze the following journal entry. Follow the instructions and format your response to match the format instructions, no matter what! \n{format_instructions}\n{entry}',
    inputVariables: ['entry'],
    partialVariables: { format_instructions },
  })
  const input = await prompt.format({ entry: content })
  return input
}

export const analyze = async (content: string) => {
  const input = await getPrompt(content)
  const model: OpenAI = new OpenAI({temperature: 0 , modelName: 'gpt-3.5-turbo'} as ClientOptions)
  const result = await model.call(input)
   try {
    return parser.parse(result)
   } catch (e) {
    console.error(e)
    return null
   }
}
