/** @type {import('next').NextConfig} */
const nextConfig = {
	images: {
		remotePatterns: [
			{
				protocol: "https",
				hostname: "imgflip.com",
				port: "",
				pathname: "/**",
			},
		],
	},
}

module.exports = nextConfig
