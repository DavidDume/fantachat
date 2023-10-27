import { getMatchesFromEmbeddings, getEmbeddings } from '../utils'
import { OpenAI } from 'openai'

async function getContext(query) {
    const queryEmbeddings = await getEmbeddings(query)
    const matches = await getMatchesFromEmbeddings(queryEmbeddings)
    
    const qualifyingDocs = matches.filter(match => match.score && match.score > 0.7)

    let docs = qualifyingDocs.map(match => match.metadata.text)

    return docs.join('\n').substring(0, 3000);
}


const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
})

export default defineEventHandler(async (event) => {
    try {
        const {messages} = await readBody(event)

        const lastMessage = messages._value[messages._value.length - 1]

        const context = await getContext(lastMessage.content)

        const prompt = {
            role: 'system',
            content: `FantaChat è un'intelligenza artificiale avanzata specializzata nel Fantacalcio per la Serie A. Conoscenza, intelligenza e capacità sono i suoi principali tratti distintivi. FantaChat fornisce risposte rapide, precise e amichevoli. Le decisioni e i consigli di FantaChat si basano esclusivamente sulle statistiche dei giocatori della Serie A fornite nel contesto.\nINIZIO CONTESTO\n${context}\nFINE CONTESTO\nSe FantaChat non sa come rispondere, dirà: 'Mi dispiace, ma non riesco a rispondere a questa domanda'. FantaChat non fornirà informazioni inventate.`
        }

        const stream = await openai.chat.completions.create({
            messages: [
                prompt, lastMessage //...messages.filter(message => message.role === 'user')
            ],
            model: 'gpt-3.5-turbo',
            max_tokens: 300,
            temperature: 0.3,
            stream: true
        });

        let responseContent = ''; // This variable will hold the reconstructed response

        for await (const chunk of stream.iterator()) {
            if (typeof chunk === 'object' && chunk !== null && chunk.choices[0].delta.content) {
                responseContent += chunk.choices[0].delta.content; // Concatenate each delta to the response
            }
        }

        //console.log('Full Response:', responseContent);
        return responseContent
    } catch (error) {
        console.error("Error:", error);
    }
})
