interface ImportMetaEnv {
  readonly VITE_KEY: string;
  readonly VITE_SECRET: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
