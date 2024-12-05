import { useState, useEffect } from "preact/hooks";
import { invoke } from "@tauri-apps/api/core";

import { cls } from "@/cls";
import { DeviceGroup, globalState } from "@/globalState";
import { runMshiSelfTest } from "@/commands";



export function TestsTab() {
  const [deviceGroup, setDeviceGroup] = useState(null);
  const [testResults, setTestResults] = useState(null);

  useEffect(
    async () => {
      setDeviceGroup(await globalState.getMshiDeviceGroup());
      const unDeviceGroup = await globalState.onMshiDeviceGroup(setDeviceGroup);
      return unDeviceGroup;
    },
    []
  );

  const runTests = async () => {
    setTestResults(null);
    const res = await runMshiSelfTest();
    setTestResults(res);
  };

  return (<>
    <div class="block is-flex is-align-items-center">
      <h1 class="is-size-5 mr-5">Полукомплект МСХИ</h1>
      <DeviceGroupSelector
        value={deviceGroup}
        onChange={globalState.setMshiDeviceGroup} />
    </div>

    <div class="block is-flex is-align-items-center">
      <RunTestsButton onClick={runTests} />
    </div>

    { testResults && (
      <div class="block">
        <h1 class="is-size-5">Результаты тестирования</h1>
        <TestResults value={testResults} />
      </div>
    )}
  </>);
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
    { mkButton("Резервный", DeviceGroup.Spare, "is-warning") }
  </p>);
}


function RunTestsButton({onClick}) {
  const [isBusy, setIsBusy] = useState(false); // FIXME: this should be a global state

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
  const mkVal = ({dev, isOk}) => {
    const tagCls = cls(
      "tag is-medium is-light mr-2",
      isOk ? "is-success" : "is-error");

      return (<li class="mb-2">
        <span class={tagCls}>{dev}</span>
        {isOk ? "Ок" : "Ошибка"}
      </li>);

  };

  return (<ul class="ml-6" style="list-style: circle;">
    { mkVal({dev: "ДЗЧ",  isOk: value.dz}) }
    { mkVal({dev: "ДГИ",  isOk: value.dg}) }
    { mkVal({dev: "ДНИ",  isOk: value.dn}) }
  </ul>);
}
