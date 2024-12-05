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

export const globalState = {
  getControlMode:
    async (): ControlMode => invoke("get_control_mode", {}),

  setControlMode:
    async (val: ControlMode ) => invoke("set_control_mode", {val}),

  onControlMode:
    async (handle: (_: ControlMode) => void): UnlistenFn => {
      const unlisten = await listen<ControlMode>(
      "/control_mode",
      ev => handle(ev.payload)
    );
    return unlisten;
  },

  getMshiDeviceGroup:
    async (): DeviceGroup => invoke("get_mshi_device_group", {}),
  setMshiDeviceGroup:
    async (val: DeviceGroup) => invoke("set_mshi_device_group", {val}),

  onMshiDeviceGroup:
    async (handle: (_: DeviceGroup) => void): UnlistenFn => {
      const unlisten = await listen<DeviceGroup>(
      "/mshi/device_group",
      ev => handle(ev.payload)
    );
    return unlisten;
  },
};
