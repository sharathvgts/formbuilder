import { FormioProvider, FormEdit, type FormType } from "@formio/react";
import IframeRenderer from "./_components/IframeRenderer";
import { useState } from "react";

const Index = () => {
	const [schema] = useState<FormType>({
		display: "form",
		components: [],
	});
	return (
		<div className="h-full w-full flex flex-col justify-center items-center">
			<IframeRenderer
				links={[
					{
						rel: "stylesheet",
						href: "https://cdn.jsdelivr.net/npm/bootstrap@4.6.0/dist/css/bootstrap.min.css",
						tag: "link",
					},
					{
						rel: "stylesheet",
						href: "http:/localhost:5173/src/pages/formiframe/_components/form.min.css",
						tag: "link",
					},
					{
						src: "http://localhost:5173/src/pages/formiframe/_components/script.js",
						tag: "script",
						type: "text/javascript",
					},
					{
						rel: "stylesheet",
						href: "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.css",
						tag: "link",
					},
					{
						src: "https://cdn.form.io/js/formio.form.min.js",
						tag: "script",
						type: "text/javascript",
					},
				]}
			>
				<FormioProvider>
					<div
						style={{
							width: "100%",
							height: "100%",
							display: "flex",
							flexDirection: "column",
							justifyContent: "center",
							alignItems: "center",
						}}
					>
						<div id="builder"></div>
					</div>
				</FormioProvider>
			</IframeRenderer>
		</div>
	);
};

export default Index;
