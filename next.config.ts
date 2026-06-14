import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  serverExternalPackages: ["@google/generative-ai"],
  // Silence the multi-lockfile workspace root warning
  outputFileTracingRoot: path.join(__dirname),
  // Keep HTTP connections alive to reduce Gemini API cold-start latency
  httpAgentOptions: { keepAlive: true },
};

export default nextConfig;
