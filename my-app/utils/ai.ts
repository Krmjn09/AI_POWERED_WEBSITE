import axios from 'axios'
import { StructuredOutputParser } from 'langchain/output_parsers'
import z from 'zod'
import { PromptTemplate } from '@langchain/core/prompts'

// Define the Zod schema for the output parser
const parser = StructuredOutputParser.fromZodSchema(
  z.object({
    mood: z.string(),
    subject: z.string(),
    negative: z.boolean(),
    summary: z.string(),
    color: z.string(),
    sentimentScore: z.number(),
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
  try {
    const response = await axios.post(
      'https://api.edenai.run/v1/pretrained/text/generation',
      {
        providers: 'openai',
        text: input,
        temperature: 0,
        max_tokens: 100,
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.EDEN_API_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    )
    const result = response.data
    const analysis = await parser.parse(result)

    // Set color based on mood
    if (analysis.mood === 'happy') {
      analysis.color = '#00FF00' // Green for happy
    } else if (analysis.mood === 'sad') {
      analysis.color = '#FF0000' // Red for sad
    } else {
      analysis.color = '#FFFFFF' // Default color
    }

    return analysis
  } catch (error) {
    console.error('Error analyzing content:', error)
    return null
  }
}
