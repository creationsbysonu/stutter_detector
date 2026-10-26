declare module "react-dom/client" {
  export function createRoot(
    container: HTMLElement | ShadowRoot,
    options: { identifier?: string }
  ): void;
}
