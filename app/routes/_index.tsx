import type { MetaFunction } from "@remix-run/node";
import { ClientOnly } from "./client-only";

export const meta: MetaFunction = () => {
  return [
    { title: "Remix hosted in Express, built by Vite" },
    { name: "description", content: "Demonstration of vitejs/vite-16536" },
  ];
};

export default function Index() {
  return (
    <div style={{ fontFamily: "system-ui, sans-serif", lineHeight: "1.8" }}>
      <h1>Remix hosted in Express, built by Vite</h1>
      <p>
        Demonstration of{" "}
        <a href="https://github.com/vitejs/vite/issues/16536">
          vitejs/vite-16536
        </a>
        . When the ExchangeJS server is restarted, or the{" "}
        <code>vite.config.ts</code> file is changed and the Vite dev server
        restarts, then the browser should be able to re-connect to the HMR
        server and resume development without a manual reload.
      </p>
      <p>
        When the below are true, then cross-origin isolation is enabled. See the{" "}
        <a href="https://web.dev/articles/coop-coep">web.dev</a> or{" "}
        <a href="https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Cross-Origin-Embedder-Policy">
          MDN
        </a>{" "}
        articles on the features enabled by this mode.
      </p>
      <ClientOnly
        fallback={
          <p>Server rendered, wait for client render to view information.</p>
        }
      >
        {() => <ClientInfo />}
      </ClientOnly>
    </div>
  );
}

function ClientInfo() {
  return (
    <>
      <ul>
        <li>
          <a href="https://developer.mozilla.org/en-US/docs/Web/API/Window/crossOriginIsolated">
            Window.crossOriginIsolated
          </a>
          : {window.crossOriginIsolated.toString()}
        </li>
        <li>
          <a href="https://developer.mozilla.org/en-US/docs/Web/API/WorkerGlobalScope/crossOriginIsolated">
            WorkerGlobalScope.crossOriginIsolated
          </a>
          : {self.crossOriginIsolated.toString()}
        </li>
      </ul>
      <p>
        To toggle cross-origin isolation, set{" "}
        <code>enableCrossOriginIsolation</code> in <code>entry.server.tsx</code>
        .
      </p>
    </>
  );
}
