import { Button } from "@mantine/core";
import { useQuery } from "@tanstack/react-query";
import type { NextPage } from "next";
import React, { useEffect } from "react";
import { APIResponse } from "typings/general";

const Home: NextPage = () => {
	const { data, isLoading } = useQuery(["test"], async () => {
		const res = await fetch("http://localhost:8000/api/example");
		const data: APIResponse = await res.json();
		return data;
	});

	useEffect(() => {
		if (!isLoading) return;
		console.log("DATA FROM API", data);
	}, [data]);

	return (
		<section className="flex h-screen w-full items-center justify-center">
			<div className="flex flex-col gap-4">
				<h1 className="text-4xl font-bold">Hey There!</h1>
				<p>Here is your setup for your work trial in IncognitoApps.</p>
				<p>You can find the instructions in the README.md file in the root of this project.</p>
				<p>Let us know if you have any questions. We are looking forward to seeing your work!</p>
				<p>Good luck!</p>

				<Button
					onClick={() => {
						alert("Start working on your task!");
					}}
				>
					{"Let's Go 🚀"}
				</Button>
			</div>
		</section>
	);
};

export default Home;
