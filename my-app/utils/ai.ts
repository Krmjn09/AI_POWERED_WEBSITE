import axios from 'axios'
import { StructuredOutputParser } from 'langchain/output_parsers'
import z from 'zod'

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
        'a hexadecimal color code that represents the mood of the entry. Example #0101fe for blue representing happiness.'
      ),
    sentimentScore: z
      .number()
      .describe(
        'sentiment of the text and rated on a scale from -10 to 10, where -10 is extremely negative, 0 is neutral, and 10 is extremely positive.'
      ),
  })
)

// Function to analyze the prompt using Eden AI
export const analyse = async (prompt: string) => {
  const apiKey = process.env.EDEN_API_KEY
  const url = 'https://api.edenai.run/v1/pretrained/text/analysis'

  const data = {
    providers: ['openai'], // Specify the provider you want to use (e.g., 'openai')
    text: prompt,
  }

  const headers = {
    Authorization: `Bearer ${apiKey}`,
    'Content-Type': 'application/json',
  }

  try {
    const response = await axios.post(url, data, { headers })

    // Assuming the response from Eden AI is in the required format
    const result = parser.parse(response.data)

    console.log(result)
    return result // Optionally return the result if needed
  } catch (error) {
    console.error('Error:', error)
  }
}
