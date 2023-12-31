import type { Metadata } from "next"
import "./globals.css"

export const metadata: Metadata = {
	title: "AI Meme Generator",
	description: "A meme generator that uses ChatGPT to generate captions.",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
	return (
		<html lang="en">
			<body className="w-full flex justify-center items-center bg-white">{children}</body>
		</html>
	)
}
