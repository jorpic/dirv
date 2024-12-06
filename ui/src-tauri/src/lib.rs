use std::sync::{Arc, Mutex};
use serde::Serialize;
use tauri::{AppHandle, Emitter, Result, State};
use tokio::time::{sleep, Duration};

mod app_state;
use app_state::*;

type AppStateMutex = Arc<Mutex<AppState>>;


#[tauri::command]
fn get_control_mode(
    state: State<AppStateMutex>,
) -> ControlMode {
    let state = state.lock().unwrap();
    state.control_mode
}

#[tauri::command]
fn set_control_mode(
    app: AppHandle,
    state: State<AppStateMutex>,
    val: ControlMode
) -> Result<()> {
    let mut state = state.lock().unwrap();
    state.control_mode = val;
    app.emit("/control_mode", val)
}

#[tauri::command]
fn get_mshi_device_group(
    state: State<AppStateMutex>,
) -> DeviceGroup {
    let state = state.lock().unwrap();
    state.mshi.device_group
}

#[tauri::command]
fn set_mshi_device_group(
    app: AppHandle,
    state: State<AppStateMutex>,
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
fn get_mshi_status(
    state: State<AppStateMutex>,
) -> DeviceStatus<MshiCommand, MshiError> {
    let state = state.lock().unwrap();
    state.mshi.status.clone()
}

// This is not a command. For internal use only.
fn set_mshi_status(
    new_status: DeviceStatus<MshiCommand, MshiError>,
    app: AppHandle,
    state: AppStateMutex,
) -> Result<()> {
    let mut state = state.lock().unwrap();
    state.mshi.status = new_status.clone();
    drop(state);

    app.emit("/mshi/status", new_status)
}

#[tauri::command]
async fn run_mshi_self_test(
    app: AppHandle,
    state: State<'_, AppStateMutex>,
) -> Result<()> {
    let state = state.inner().clone();
    set_mshi_status(
        DeviceStatus::Busy(MshiCommand::RunSelfTest),
        app.clone(),
        state.clone())?;

    app.emit("mshi_self_test_started", ())?;

    tauri::async_runtime::spawn(async move {
        sleep(Duration::from_secs(4)).await;
        let res = MshiSelfTestResults {
            dz: true,
            dg: true,
            dn: true,
        };

        let _ = set_mshi_status(
            DeviceStatus::Ready,
            app.clone(),
            state.clone());
        let _ = app.emit("mshi_self_test_result", res);
    });

    Ok(())
}


#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_shell::init())
        .manage(Arc::new(Mutex::new(AppState::new())))
        .invoke_handler(tauri::generate_handler![
            set_control_mode,
            get_control_mode,
            get_mshi_device_group,
            set_mshi_device_group,
            get_mshi_status,

            run_mshi_self_test,
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
