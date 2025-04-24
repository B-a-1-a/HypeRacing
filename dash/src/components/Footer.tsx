import Link from "next/link";

export default function Footer() {
	return (
		<footer className="my-8 text-sm text-zinc-600">
			<div className="mb-4 flex flex-wrap gap-2">
				<p>
					The Dashboard App is a fork of <TextLink website="https://github.com/slowlydev/f1-dash">slowlydev's</TextLink> feel free to support the original project.
				</p>

				<p>
					Get{" "}
					<Link className="text-blue-500" href="/help">
						Help
					</Link>
					.
				</p>

				<p>Version: {process.env.version}</p>
			</div>

			<p>
				This project/website is unofficial and is not associated in any way with the Formula 1 companies. F1, FORMULA
				ONE, FORMULA 1, FIA FORMULA ONE WORLD CHAMPIONSHIP, GRAND PRIX and related marks are trade marks of Formula One
				Licensing B.V
			</p>
		</footer>
	);
}

type TextLinkProps = {
	website: string;
	children: string;
};

const TextLink = ({ website, children }: TextLinkProps) => {
	return (
		<a className="text-blue-500" target="_blank" href={website}>
			{children}
		</a>
	);
};
