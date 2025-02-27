import { StructuredTool } from "@langchain/core/tools";
import { string, z } from "zod";
import { GraphState } from "index.js";
import { HIGH_LEVEL_CATEGORY_MAPPING } from "constants.js";
import { ChatPromptTemplate } from "langchain/prompts";

/**
 * Given a users query, extract the high level category which
 * best represents the query.
 *
 * TODO: add schema, name, description, and _call method
 */
export class ExtractHighLevelCategories extends StructuredTool {
  schema = z.object({
    highlevelcategories: z.array(z.enum(Object.keys(HIGH_LEVEL_CATEGORY_MAPPING) as [string, ...string[]]).describe("An enum of all categories which best match the query."))
  })
    .describe("Given a users query, extract the high level category which best represents the query.")
    .describe("The high level categories to extract from the query.")

  name = "ExtractHighLevelCategories";

  description = "Given a users query, extract the high level category which best represents the query.";

  async _call(input: z.infer<typeof this.schema>): Promise<string> {
    const categoriesMapped = input.highlevelcategories.map((category) => HIGH_LEVEL_CATEGORY_MAPPING[category as keyof typeof HIGH_LEVEL_CATEGORY_MAPPING]).flat()
    return JSON.stringify(categoriesMapped)
  }
}

/**
 * TODO: implement
 * @param {GraphState} state
 */
export async function extractCategory(state: GraphState): Promise<Partial<GraphState>> {
  const { llm, query } = state;
  const prompt = ChatPromptTemplate.fromMessages([
    ["system", `You are an expert sotware engineer, helping a junior engineer understand the high level category of a query,
      Given their query and a list of high level categories, select the high level category which best represnts the query.`],
    ['human', `Query {query} High level categories: {highLevelCategories}`]
  ])

  const tool = new ExtractHighLevelCategories();
  const modelwithTools = llm.withStructuredOutput(tool);
  const chain = prompt.pipe(modelwithTools).pipe(tool)


  const response = await chain.invoke({
    query,
    highLevelCategories: Object.entries(HIGH_LEVEL_CATEGORY_MAPPING).map(([key, value]) => `High Level Category: ${key}, categories: ${value.join(", ")}`).join("\n\n")
  })


  const highlevelcategories: string[] = JSON.parse(response)
  return {
    "categories": highlevelcategories,
  }
}
