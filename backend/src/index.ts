// Define graph here
import { ChatOpenAI } from "@langchain/openai";
import { DatasetSchema } from "types.js";
import { StateGraph } from '@langchain/langgraph'

/**
 * TODO: implement
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type GraphState = {
  /**
   * the llm to sue for graph
   */
  llm: ChatOpenAI,
  /**
  * the query to extract api for
  */
  query: string
  /**
  * the relevant api categories
  */
  categories: string[] | null;
  /**
 * the relevant apis for categories
 */
  apis: DatasetSchema[] | null;
  /**
 * the relevant api for tge caye
 */
  bestApi: DatasetSchema[] | null;
  /**
 * the relevant api categories
 */
  params: Record<string, string> | null;
  /**
 * the api response
 */
  response: Record<string, any> | null;
};

/**
 * TODO: implement
 */
const graphChannels = {
  llm: {
    value: null,
  },
  query: {
    value: null,
  },
  categories: {
    value: null,
  },
  apis: {
    value: null,
  },
  bestApi: {
    value: null
  },
  params: {
    value: null,
  },
  response: {
    value: null
  }
};

/**
 * TODO: implement
 * @param {GraphState} state
 */
const verifyParams = (): string => {
  throw new Error("verifyParams not implemented");
};

/**
 * TODO: implement
 */
function createGraph() {
  const graph = new StateGraph<GraphState>({
    channels: graphChannels,
  })

  graph.addNode('extract_category_node', (state: GraphState) => {
    console.log(`not implemented yet_${state}`)
  })
  graph.addNode('get_apis_node', (state: GraphState) => {
    console.log(`not implemented yet_${state}`)
  })
  graph.addNode('select_api_node', (state: GraphState) => {
    console.log(`not implemented yet_${state}`)
  })
  graph.addNode('extract_params_node', (state: GraphState) => {
    console.log(`not implemented yet_${state}`)
  })
  graph.addNode('human_loop_node', (state: GraphState) => {
    console.log(`not implemented yet_${state}`)
  })
  graph.addNode('execute_request_node', (state: GraphState) => {
    console.log(`not implemented yet_${state}`)
  })

  graph.addEdge('extract_category_node', 'get_apis_node');
  graph.addEdge('get_apis_node', 'select_api_node');
  graph.addEdge('select_api_node', 'extract_params_node');

  graph.addConditionalEdges('extract_params_node', (state: GraphState): "human_loop_edge" | "execute_request_node" => {
    throw new Error(`not implemented ${state}`)
  })

  graph.addConditionalEdges('human_loop_edge', (state: GraphState): "extract_params_node" => {
    throw new Error(`not implemented ${state}`)
  })

  graph.setEntryPoint('extract_category_node')
  graph.setFinishPoint('execute_request_node')


  const app = graph.compile()
  return app
}

const datasetQuery =
  "I'm researching WhatsApp for Business accounts. Can you check if the number 9876543210 is a WhatsApp for Business account? Also, provide the business description, website, email, business hours, address, and category if it is.";

const relevantIds = [
  "8044d241-0f5b-403d-879a-48b080fd4bf6",
  "a7c44eb0-c7f2-446a-b57e-45d0f629c50c",
  "f657180c-3685-410d-8c71-a5f7632602f1",
];

/**
 * TODO: implement
 * @param {string} query
 */
async function main(query: string) {
  const app = createGraph();

  const llm = new ChatOpenAI({
    modelName: 'gpt-4-turbo-preview',
    temperature: 0,
  })

  const response = app.invoke({
    llm,
    query,
  })

  console.log(response)

  throw new Error("main not implemented" + query);
}

main(datasetQuery);
