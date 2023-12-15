import { NextApiRequest } from "next"
import { NextResponse } from "next/server"
import OpenAI from "openai"

const openai = new OpenAI()

// copy the function above but put it in Typescript
export async function POST(request: Request) {
	const reqBody = await request.json()
	const completion = await openai.chat.completions.create({
		messages: [{ role: "system", content: reqBody.prompt }],
		temperature: 0.7,
		model: "gpt-3.5-turbo",
	})

	return Response.json({ text: completion.choices[0].message.content })
}
