import { useState } from "preact/hooks";
import { invoke } from "@tauri-apps/api/core";

import { cls } from "@/cls";


export function TestsTab() {
  const [deviceGroup, setDeviceGroup] = useState(DeviceGroup.Primary);
  const [testResults, setTestResults] = useState([]);

  const runTests = async () => {
    setTestResults([]);
    const res = await invoke(
      "runDeviceTests",
      { "deviceGroup": deviceGroup }
    );
    setTestResults(res);
  };

  return (<>
    <div class="block is-flex is-align-items-center">
      <h1 class="is-size-5 mr-5">Полукомплект МСХИ</h1>
      <DeviceGroupSelector value={deviceGroup} onChange={setDeviceGroup} />
    </div>

    <div class="block is-flex is-align-items-center">
      <RunTestsButton onClick={runTests} />
    </div>

    <div class="block">
      <h1 class="is-size-5">Результаты тестирования</h1>
      <TestResults value={testResults} />
    </div>
  </>);
}


enum DeviceGroup {
  Primary,
  Secondary
}

function DeviceGroupSelector({value, onChange}) {
  const mkButton = (name, val, color) => (
    <button
      class={cls("button is-rounded", value === val, color, "is-selected")}
      onClick={() => onChange(val)}
    >
      { name }
    </button>
  );

  return (<p class="control buttons has-addons">
    { mkButton("Основной", DeviceGroup.Primary, "is-success") }
    { mkButton("Резервный", DeviceGroup.Secondary, "is-warning") }
  </p>);
}


function RunTestsButton({onClick}) {
  const [isBusy, setIsBusy] = useState(false); // FIXME: this is a global state

  const handler = async () => {
    setIsBusy(true);
    await onClick();
    setIsBusy(false);
  };

  return (
    <button
      class={cls("button is-info", isBusy, "is-loading")}
      disabled={isBusy}
      onClick={handler}
    >
      Запустить самотестирование ДИРВ
    </button>
  );
}

function TestResults({value}) {
  const mkVal = res => {
    const tagCls = cls(
      "tag is-medium is-light mr-2",
      res.isSuccess ? "is-success" : "is-error");

      return (<li class="mb-2">
        <span class={tagCls}>{res.tag}</span>
        {res.message}
      </li>);

  };

  return (<ul class="ml-6" style="list-style: circle;">
    { value.map(mkVal) }
  </ul>);
}
