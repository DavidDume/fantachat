import { OpenAIApi, Configuration } from "openai-edge";
import { Pinecone } from "@pinecone-database/pinecone";

const config = new Configuration({
    apiKey: process.env.OPENAI_API_KEY
})

export const openai = new OpenAIApi(config)

export async function getEmbeddings(text) {
    try {
        const res = await openai.createEmbedding({
            model: "text-embedding-ada-002",
            input: text.replace(/\n/g, "")
        })
        const result = await res.json()
        return result.data[0].embedding
    } catch (err) {
        console.log("Error", err);
        throw err
    }
}

export async function getMatchesFromEmbeddings(embeddings) {
    const pinecone = new Pinecone({
        apiKey: process.env.PINECONE_KEY,
        environment: process.env.PINECONE_ENV
    })
    const index = await pinecone.Index('test')

    try {
        const queryResult = await index.query({
            topK: 5,
            vector: embeddings,
            includeMetadata: true
        })
        return queryResult.matches || []
    } catch (error) {
        console.log(error);
        throw error
    }
}

