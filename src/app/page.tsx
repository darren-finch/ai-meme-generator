"use client"
import { drawRotatedTextBox } from "./util/drawRotatedTextBox"
import { memeTemplates } from "./util/memeTemplates"
import { useState } from "react"

export default function Home() {
	const [topic, setTopic] = useState("")
	const [memeTemplateIndex, setMemeTemplateIndex] = useState(0)

	const handleGenerateBtnClick = () => {
		if (memeTemplateIndex < 0 || memeTemplateIndex > memeTemplates.length - 1) {
			alert("Please enter a valid meme template number")
			return
		}

		const memeTemplate = memeTemplates[memeTemplateIndex]

		const canvas = document.getElementById("canvas") as HTMLCanvasElement
		canvas.width = memeTemplate.imageWidth
		canvas.height = memeTemplate.imageHeight

		const context: CanvasRenderingContext2D = canvas.getContext("2d")!

		const promptSuffix = topic === "" ? "" : `\nMake everything related to ${topic}.`
		const prompt = memeTemplate.promptDescription + promptSuffix

		fetch("http://localhost:3000/api/chatgpt", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({ prompt: prompt }),
		})
			.then((response) => response.json())
			.then((data) => {
				const text = data.text
				console.log(text)
				text.split("\n").forEach((line: string, index: number) => {
					if (index > memeTemplate.textLines.length - 1) return
					const textLine = memeTemplate.textLines[index]
					textLine.text = line.substring(line.indexOf(".") + 2)
				})

				const img = new Image()
				img.onload = () => {
					context.drawImage(img, 0, 0)
					memeTemplate.textLines.forEach((textLine) => {
						drawRotatedTextBox(
							context,
							textLine.text,
							textLine.size,
							"Arial",
							textLine.x,
							textLine.y,
							textLine.width,
							textLine.height,
							textLine.angle,
							textLine.color,
							false,
							textLine.shadowColor,
							textLine.shadowBlur,
							5 // maybe make this configurable in the future
						)
					})
				}
				img.src = memeTemplate.src
			})
	}

	return (
		<>
			<h1>AI Meme Generator</h1>
			<p>Enter a topic for your meme (e.g. programming, romance, sports, etc)</p>
			<div style={{ marginBottom: "20px" }}>
				<input
					id="memeTemplateInput"
					type="number"
					placeholder="Enter the number of the meme template you want to use..."
					value={memeTemplateIndex}
					onChange={(e) => setMemeTemplateIndex(Number.parseInt(e.target.value))}
					style={{ color: "black !important" }}
				/>
			</div>
			<div style={{ marginBottom: "20px" }}>
				<input
					id="topicInput"
					type="text"
					placeholder="Enter topic..."
					value={topic}
					onChange={(e) => setTopic(e.target.value)}
					style={{ color: "black !important" }}
				/>
				<button id="generateBtn" onClick={handleGenerateBtnClick}>
					Generate
				</button>
			</div>
			<canvas id="canvas" width="1000" height="1000"></canvas>
		</>
	)
}
