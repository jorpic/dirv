import { invoke } from "@tauri-apps/api/core";

export const runMshiSelfTest = async () => invoke("run_mshi_self_test", {});
