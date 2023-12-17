export const resizeCanvas = (canvas: HTMLCanvasElement, scaleFactor: number) => {
	// Create a temporary canvas
	const tempCanvas: HTMLCanvasElement = document.createElement("canvas")
	const tempCtx: CanvasRenderingContext2D = tempCanvas.getContext("2d")!

	// Set the dimensions of the temporary canvas to match the original canvas
	tempCanvas.width = canvas.width
	tempCanvas.height = canvas.height

	// Draw the original canvas content onto the temporary canvas
	tempCtx.drawImage(canvas, 0, 0)

	// Resize the original canvas
	canvas.width *= scaleFactor
	canvas.height *= scaleFactor

	// Get the context of the original canvas
	const ctx: CanvasRenderingContext2D = canvas.getContext("2d")!

	// Draw the scaled image from the temporary canvas back onto the original canvas
	ctx.drawImage(tempCanvas, 0, 0, tempCanvas.width, tempCanvas.height, 0, 0, canvas.width, canvas.height)
}
