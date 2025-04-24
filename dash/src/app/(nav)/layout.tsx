import { type ReactNode } from "react";

import Menubar from "@/components/Menubar";

type Props = {
	children: ReactNode;
};

export default function Layout({ children }: Props) {
	return (
		<div>
			<div className="sticky left-0 top-0 z-10 flex h-12 w-full items-center justify-between gap-4 border-b border-zinc-800 bg-black p-2">
				<Menubar />
				<div className="hidden items-center gap-4 pr-2 sm:flex">
					{/* External links removed */}
				</div>
			</div>

			{children}
		</div>
	);
}
