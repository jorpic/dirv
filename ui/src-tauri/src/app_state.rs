use serde::{Deserialize, Serialize};

#[derive(Clone, Serialize)]
pub struct AppState {
    pub control_mode: ControlMode,
    pub mshi: Mshi,
    pub dz: Option<SerialPort>,
    pub dg: Option<SerialPort>,
    pub dn: Option<SerialPort>,
}

#[derive(Clone, Copy, Deserialize, Serialize)]
pub enum ControlMode {
    Manual, AIK
}

#[derive(Clone, Copy, Deserialize, Serialize)]
pub enum DeviceGroup {
    Primary, Spare
}

#[derive(Clone, Serialize)]
#[serde(tag = "value", content = "data")]
pub enum DeviceStatus<Cmd, Err> {
    Ready,
    Busy(Cmd),
    Error(Err),
}

#[derive(Clone, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct Mshi {
    pub device_group: DeviceGroup,
    pub status: DeviceStatus<MshiCommand, MshiError>,
    pub dz: Option<DeviceGroup>,
    pub dg: Option<DeviceGroup>,
    pub dn: Option<DeviceGroup>,
}

#[derive(Clone, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct SerialPort {
    pub path: String,
    pub status: DeviceStatus<DetectorCommand, DetectorError>
}

#[derive(Clone, Serialize)]
pub enum MshiCommand {
    RunSelfTest
}

#[derive(Clone, Serialize)]
pub enum MshiError {
    Other
}

#[derive(Clone, Serialize)]
pub enum DetectorCommand {
    StartPoll
}

#[derive(Clone, Serialize)]
pub enum DetectorError {
    Other
}

impl AppState {
    pub fn new() -> Self {
        AppState {
            control_mode: ControlMode::Manual,
            mshi: Mshi {
                device_group: DeviceGroup::Primary,
                status: DeviceStatus::Ready,
                dz: None,
                dg: None,
                dn: None,
            },
            dz: None,
            dg: None,
            dn: None,
        }
    }
}
