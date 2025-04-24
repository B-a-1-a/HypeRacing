import { Metadata } from "next";

const title = "HypeRacing | Formula 1 live timing";
const description =
	"Experience live telemetry and timing data from Formula 1 races. Get insights into leaderboards, tire choices, gaps, lap times, sector times, team radios, and more.";

const url = "https://hype-racing.com";

export const metadata: Metadata = {
	generator: "Next.js",

	applicationName: title,

	title,
	description,

	openGraph: {
		title,
		description,
		url,
		type: "website",
		siteName: "HypeRacing",
		images: [
			{
				alt: "Realtime Formula 1 Dashboard",
				url: `${url}/og-image.png`,
				width: 1200,
				height: 630,
			},
		],
	},

	twitter: {
		site: "@Slowlydev",
		title,
		description,
		creator: "@Slowlydev",
		card: "summary_large_image",
		images: [
			{
				url: `${url}/twitter-image.png`,
				alt: "Realtime Formula 1 Dashboard",
				width: 1200,
				height: 630,
			},
		],
	},

	category: "Sports & Recreation",

	referrer: "strict-origin-when-cross-origin",

	keywords: ["Formula 1", "HypeRacing", "realtime telemetry", "f1 timing", "live updates"],

	creator: "Slowlydev",
	publisher: "Slowlydev",
	authors: [{ name: "Slowlydev", url: "https://slowly.dev" }],

	appleWebApp: {
		capable: true,
		title: "HypeRacing",
		statusBarStyle: "black-translucent",
	},

	formatDetection: {
		email: false,
		address: false,
		telephone: false,
	},

	metadataBase: new URL(url),

	alternates: {
		canonical: url,
	},

	verification: {
		google: "hKv0h7XtWgQ-pVNVKpwwb2wcCC2f0tBQ1X1IcDX50hg",
	},

	manifest: "manifest.json",
};
