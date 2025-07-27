"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function HomePage() {
	const router = useRouter();

	useEffect(() => {
		router.replace("/dashboard");
	}, [router]);

	return (
		<div className="flex h-screen items-center justify-center">
			<div className="text-center">
				<h1 className="text-2xl font-bold">Redirecting to Dashboard...</h1>
			</div>
		</div>
	);
} 