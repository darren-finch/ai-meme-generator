export function drawRotatedTextBox(
	ctx: CanvasRenderingContext2D,
	text: string,
	fontSize: number,
	fontFamily: string,
	x: number,
	y: number,
	width: number,
	height: number,
	rotateDegrees: number,
	color: string,
	showTextBox: boolean,
	shadowColor?: string,
	shadowBlur?: number,
	lineWidth?: number
) {
	ctx.save() // Save the current state

	// Set the color and font for the text
	ctx.fillStyle = color
	ctx.font = `${fontSize}px ${fontFamily}`

	// Set the rotation
	let radians = (rotateDegrees * Math.PI) / 180
	ctx.translate(x, y)
	ctx.rotate(radians)

	// Set the shadow
	if (shadowColor && shadowBlur) {
		ctx.shadowColor = shadowColor
		ctx.shadowBlur = shadowBlur
	}

	// Optional: Draw the text box for debugging
	if (showTextBox) {
		ctx.strokeStyle = "red"
		ctx.strokeRect(0, 0, width, height)
	}

	// Wrap and draw the text
	let words = text.split(" ")
	let line = ""
	let lineHeight = fontSize // Approximate line height, adjust as needed
	let yLine = 0

	ctx.textBaseline = "top"

	for (let n = 0; n < words.length; n++) {
		let testLine = line + words[n] + " "
		let metrics = ctx.measureText(testLine)
		let testWidth = metrics.width
		if (testWidth > width && n > 0) {
			ctx.fillText(line, 0, yLine)
			line = words[n] + " "
			yLine += lineHeight
		} else {
			line = testLine
		}
	}
	ctx.fillText(line, 0, yLine)

	// Check if the text fits in the box
	// if (yLine + lineHeight > height) {
	// 	console.error("Error: Text does not fit in the box.")
	// 	ctx.clearRect(-width, -height, width, height) // Clear the text
	// }

	ctx.restore() // Restore the original state
}
