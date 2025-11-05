import { Links, Meta, Outlet, Scripts, ScrollRestoration, useRouteError, isRouteErrorResponse } from "react-router";
import "./tailwind.css";
import { Toaster } from "sonner";

export default function App() {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <link rel="preconnect" href="https://cdn.shopify.com/" />
        <link
          rel="stylesheet"
          href="https://cdn.shopify.com/static/fonts/inter/v4/styles.css"
        />
        <Meta />
        <Links />
      </head>
      <body>
        <Outlet />
        <ScrollRestoration />
        <Toaster richColors />
        <Scripts />
      </body>
    </html>
  );
}

export function ErrorBoundary() {
  const error = useRouteError();

  let errorMessage = "An unexpected error occurred";
  let errorStatus = 500;
  let errorDetails: string | undefined;

  if (isRouteErrorResponse(error)) {
    errorStatus = error.status;
    errorMessage = error.statusText || errorMessage;
    errorDetails = error.data?.message || error.data;
  } else if (error instanceof Error) {
    errorMessage = error.message;
    errorDetails = error.stack;
  }

  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <title>{errorStatus} | Error</title>
        <Meta />
        <Links />
      </head>
      <body className="bg-gradient-to-br from-amber-50/30 via-white to-stone-50/40">
        <div className="flex min-h-screen items-center justify-center px-4">
          <div className="w-full max-w-md space-y-8 text-center">
            <div className="space-y-3">
              <h1 className="text-9xl font-bold text-primary">{errorStatus}</h1>
              <h2 className="text-2xl font-bold text-stone-900">{errorMessage}</h2>
              {errorDetails && process.env.NODE_ENV === 'development' && (
                <details className="mt-4 text-left">
                  <summary className="cursor-pointer text-sm font-medium text-stone-600 hover:text-stone-900">
                    Error Details (Development Only)
                  </summary>
                  <pre className="mt-2 overflow-auto rounded-lg border border-stone-200 bg-stone-50 p-4 text-xs text-stone-800">
                    {errorDetails}
                  </pre>
                </details>
              )}
            </div>
            <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
              <a
                href="/"
                className="inline-flex items-center justify-center rounded-lg bg-primary px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-primary/90"
              >
                Go to Homepage
              </a>
              <button
                onClick={() => window.history.back()}
                className="inline-flex items-center justify-center rounded-lg border border-stone-300 bg-white px-6 py-3 text-sm font-medium text-stone-900 transition-colors hover:bg-stone-50"
              >
                Go Back
              </button>
            </div>
          </div>
        </div>
        <Scripts />
      </body>
    </html>
  );
}
