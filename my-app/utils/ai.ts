import { OpenAI } from '@langchain/openai'
import {StructuredOutputParser} from 'langchain/output_parsers'
import z from 'zod'
const parser = 

export const analyse = async (prompt: string) => {
  const model = new OpenAI({
    temperature: 0.5,
    modelName: 'gpt-3.5-turbo',
    apiKey: process.env.OPENAI_API_KEY,
  })
  const result = await model.call(prompt)

  console.log(result)
}
