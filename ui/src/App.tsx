import { useState, useEffect } from "preact/hooks";

import { TestsTab } from "./tabs/TestsTab";
import { CalibrationTab } from "./tabs/CalibrationTab";
import { CommandsTab } from "./tabs/CommandsTab";
import { StatusTab } from "./tabs/StatusTab";
import { LogsTab } from "./tabs/LogsTab";

import { cls } from "./cls";
import { ControlMode, globalState } from "./globalState";

enum Tab {
  Tests,
  Calibration,
  Commands,
  Status,
  Logs,
}

export function App() {
  const [controlMode, setControlMode] = useState(null);
  const [currentTab, setCurrentTab] = useState(Tab.Tests);

  useEffect(
    async () => {
      setControlMode(await globalState.getControlMode());
      const unControlMode = await globalState.onControlMode(setControlMode);
      return unControlMode;
    },
    []
  );

  const mkControlModeBtn = (name, val, color) =>
    <button
      onClick={_ => globalState.setControlMode(val)}
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
        <span class="icon">
          <i class={`far ${icon}`} aria-hidden="true"></i>
        </span>
        <span>{name}</span>
      </a>
    </li>;

  return (
    <div class="container is-fluid">
      <div class="is-flex is-justify-content-flex-end mt-4">
        <div class="buttons has-addons">
          { mkControlModeBtn("Ручное управление", ControlMode.Manual, "is-success") }
          { mkControlModeBtn("АИК", ControlMode.AIK, "is-warning") }
        </div>
      </div>

      <div class="tabs is-boxed mt-4">
        <ul>
          { mkTab("Испытания ДИРВ", Tab.Tests, "fa-clipboard-check") }
          { mkTab("Калибровка ДИРВ", Tab.Calibration, "fa-gauge-high") }
          { mkTab("Отработка детекторных узлов", Tab.Commands, "fa-chart-column") }
          { mkTab("Статус", Tab.Status, "fa-jedi") }
          { mkTab("Журнал событий", Tab.Logs, "fa-file-alt") }
        </ul>
      </div>
      <div class="m-5">
        { currentTab === Tab.Tests && <TestsTab /> }
        { currentTab === Tab.Calibration && <CalibrationTab /> }
        { currentTab === Tab.Commands && <CommandsTab /> }
        { currentTab === Tab.Status && <StatusTab /> }
        { currentTab === Tab.Logs && <LogsTab /> }
      </div>
    </div>
  );
}
