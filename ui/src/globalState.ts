import { invoke } from "@tauri-apps/api/core";
import { listen, UnlistenFn } from "@tauri-apps/api/event";

export enum ControlMode {
  Manual = "Manual",
  AIK = "AIK",
}

export enum DeviceGroup {
  Primary = "Primary",
  Spare = "Spare"
}

type CommandError = any;


export type MshiStatus =
  | { tag: "Ready" }
  | { tag: "Busy", value: MshiCommand }
  | { tag: "Error", value: any }

export enum MshiCommand {
  RunSelfTest = "RunSelfTest"
}


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

function mkGet<T>(command: string): () => Promise<T> {
    return async (): Promise<T> => invoke<T>(command, {});
}

function mkSet<T>(command: string): (_: T) => Promise<CommandError> {
    return async (val: T): Promise<CommandError> =>
      invoke<CommandError>(command, {val});
}

export const globalState = {
  getControlMode: mkGet<ControlMode>("get_control_mode"),
  setControlMode: mkSet<ControlMode>("set_control_mode"),
  onControlMode: mkListen<ControlMode>("/control_mode"),

  getMshiDeviceGroup: mkGet<DeviceGroup>("get_mshi_device_group"),
  setMshiDeviceGroup: mkSet<DeviceGroup>("set_mshi_device_group"),
  onMshiDeviceGroup: mkListen<DeviceGroup>("/mshi/device_group"),

  getMshiStatus: mkGet<MshiStatus>("get_mshi_status"),
  onMshiStatus: mkListen<MshiStatus>("/mshi/status"),
};
