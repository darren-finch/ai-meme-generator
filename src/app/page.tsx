"use client"
import { drawRotatedTextBox } from "./util/drawRotatedTextBox"
import { memeTemplates } from "./util/memeTemplates"
import { useState } from "react"
import { resizeCanvas } from "./util/resizeCanvas"
import NextImage from "next/image"

export default function Home() {
	const [topic, setTopic] = useState("")
	const [memeTemplateIndex, setMemeTemplateIndex] = useState(0)

	// We use this state to prevent the user from clicking the generate button multiple times
	const [isGenerating, setGenerating] = useState(false)

	const handleGenerateBtnClick = () => {
		if (isGenerating) return

		setGenerating(true)

		if (memeTemplateIndex < 0 || memeTemplateIndex > memeTemplates.length - 1) {
			alert("Please enter a valid meme template number")
			return
		}

		const memeTemplate = memeTemplates[memeTemplateIndex]

		const canvas = document.getElementById("canvas") as HTMLCanvasElement

		// Resize canvas to match image size
		canvas.width = memeTemplate.imageWidth
		canvas.height = memeTemplate.imageHeight

		const context: CanvasRenderingContext2D = canvas.getContext("2d")!

		const promptSuffix = topic === "" ? "" : `\nMake everything related to ${topic}.`
		const prompt = memeTemplate.promptDescription + promptSuffix

		fetch(`${process.env.NEXT_PUBLIC_MEME_API_BASE_URL}/chatgpt`, {
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

					// If canvas is over the width or height of its container, scale it down
					const container = document.getElementById("canvas")!.parentElement!
					if (canvas.width > container.clientWidth) {
						const scale = container.clientWidth / canvas.width
						resizeCanvas(canvas, scale)
					}
					if (canvas.height > container.clientHeight) {
						const scale = container.clientHeight / canvas.height
						resizeCanvas(canvas, scale)
					}

					setGenerating(false)
				}
				img.src = memeTemplate.src
			})
	}

	return (
		<div className="my-12 container bg-slate-900 p-8 rounded-lg shadow-xl shadow-slate-600 flex items-center justify-center h-[800px]">
			<div className="w-6/12 p-4">
				<h1 className="text-4xl font-bold">AI Meme Generator</h1>
				<div className="my-4">
					<p>Select a meme template</p>
					<div className="w-full my-2 flex flex-wrap gap-4">
						{memeTemplates.map((memeTemplate, index) => (
							<button
								key={index}
								className="w-24 h-24 bg-white flex justify-center items-center border-2 ring-1 dark:hover:border-blue-500 dark:focus:ring-white dark:focus:border-blue-500 rounded-lg cursor-pointer overflow-hidden"
								onClick={() => setMemeTemplateIndex(index)}>
								<NextImage
									src={memeTemplate.src}
									alt="A meme template"
									width={100}
									height={100}
									className="max-w-full max-h-full object-contain"
								/>
							</button>
						))}
					</div>
				</div>
				<div className="my-4">
					<label className="block mb-2" htmlFor="topicInput">
						Enter a topic for your meme (e.g. programming, romance, sports, etc)
					</label>
					<input
						id="topicInput"
						type="text"
						placeholder="Enter topic..."
						value={topic}
						onChange={(e) => setTopic(e.target.value)}
						className="block bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
					/>
				</div>
				<div className="my-4">
					<button
						id="generateBtn"
						onClick={handleGenerateBtnClick}
						disabled={isGenerating}
						className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
						Generate
					</button>
					<p className="my-2 text-slate-200 text-sm">
						Note that resizing the screen may cause the meme to be cut off and it will have to be
						regenerated.
					</p>
				</div>
			</div>
			<div className="border-r border-gray-400 w-1 h-full"></div>
			<div className="w-6/12 h-full p-4 flex flex-col items-stretch justify-center">
				<div className="relative max-w-full max-h-full overflow-hidden">
					<div
						className={`absolute inset-0 m-auto flex justify-center items-center ${
							isGenerating ? "visible" : "hidden"
						}`}>
						<div className="animate-spin rounded-full h-32 w-32 border-b-2 border-white"></div>
					</div>
					<canvas id="canvas"></canvas>
				</div>
			</div>
		</div>
	)
}
