use std::sync::Mutex;
use serde::Serialize;
use tauri::{AppHandle, Emitter, Result, State};

mod app_state;
use app_state::*;


#[tauri::command]
fn get_control_mode(
    state: State<Mutex<AppState>>,
) -> ControlMode {
    let mut state = state.lock().unwrap();
    state.control_mode
}

#[tauri::command]
fn set_control_mode(
    app: AppHandle,
    state: State<Mutex<AppState>>,
    val: ControlMode
) -> Result<()> {
    let mut state = state.lock().unwrap();
    state.control_mode = val;
    app.emit("/control_mode", val)
}

#[tauri::command]
fn get_mshi_device_group(
    state: State<Mutex<AppState>>,
) -> DeviceGroup {
    let mut state = state.lock().unwrap();
    state.mshi.device_group
}

#[tauri::command]
fn set_mshi_device_group(
    app: AppHandle,
    state: State<Mutex<AppState>>,
    val: DeviceGroup,
) -> Result<()> {
    let mut state = state.lock().unwrap();
    state.mshi.device_group = val;
    app.emit("/mshi/device_group", val)
}


#[derive(Clone, Serialize)]
#[serde(rename_all = "camelCase")]
struct MshiSelfTestResults {
    dz: bool,
    dg: bool,
    dn: bool,
}

#[tauri::command]
fn run_mshi_self_test(
    state: State<Mutex<AppState>>
) -> MshiSelfTestResults {
    let mut state = state.lock().unwrap();
    MshiSelfTestResults {
        dz: true,
        dg: true,
        dn: true,
    }
}


#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_shell::init())
        .manage(Mutex::new(AppState::new()))
        .invoke_handler(tauri::generate_handler![
            set_control_mode,
            get_control_mode,
            get_mshi_device_group,
            set_mshi_device_group,

            run_mshi_self_test,
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
