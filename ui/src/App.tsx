import { useState } from "preact/hooks";
import { invoke } from "@tauri-apps/api/core";

function cls(base, obj) {
  return Object.entries(obj).reduce(
    (res, [key, val]) => val ? `${res} ${key}` : res,
    base
  );
}

enum ControlMode {
  Manual,
  AIK,
}

enum Tab {
  Tests,
  Calibration,
  Commands,
  Status,
  Logs,
}


function App() {
  const [controlMode, setControlMode] = useState(ControlMode.Manual);
  const [currentTab, setCurrentTab] = useState(Tab.Tests);

  const mkControlModeBtn = (name, val, color) =>
    <button
      onClick={_ => setControlMode(val)}
      class={cls("button is-rounded", {
        "is-selected": controlMode === val,
        [color]: controlMode === val
      })}
    >
      {name}
    </button>;

  const mkTab = (name, val, icon) =>
    <li
      class={currentTab === val ? "is-active" : ""}
      onClick={_ => setCurrentTab(val)}
    >
      <a>
        <span class="icon small"
          ><i class={`far ${icon}`} aria-hidden="true"></i
        ></span>
        <span>{name}</span>
      </a>
    </li>;

  return (
    <div class="container is-fluid">
      <div class="is-flex is-justify-content-flex-end mt-5">
        <div class="buttons has-addons">
          {mkControlModeBtn("Ручное управление", ControlMode.Manual, "is-success")}
          {mkControlModeBtn("АИК", ControlMode.AIK, "is-warning")}
        </div>
      </div>

      <div class="tabs is-boxed is-medium">
        <ul>
          {mkTab("Испытания ДИРВ", Tab.Tests, "fa-clipboard-check")}
          {mkTab("Калибровка ДИРВ", Tab.Calibration, "fa-gauge-high")}
          {mkTab("Отработка детекторных узлов", Tab.Commands, "fa-chart-column")}
          {mkTab("Статус", Tab.Status, "fa-jedi")}
          {mkTab("Журнал событий", Tab.Logs, "fa-file-alt")}
        </ul>
      </div>
      <section class="section">
        tab
      </section>
    </div>
  );
}

export default App;
