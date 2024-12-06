import { invoke } from "@tauri-apps/api/core";
import { listen, UnlistenFn } from "@tauri-apps/api/event";

function mkListen<EventData>(
  eventTag: string,
): (h: (e: EventData) => void) => Promise<UnlistenFn> {
  return async (handler: (e: EventData) => void) => {
    const unlisten = await listen<EventData>(
      eventTag,
      ev => handler(ev.payload)
    );
    return unlisten;
  };
}

export type MshiSelfTestResult = any;

export const mshiSelfTest = {
  run:
    async () => invoke("run_mshi_self_test", {}),
  onResult:
    mkListen<MshiSelfTestResult>("mshi_self_test_result"),
};
