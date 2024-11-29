import { useState } from "preact/hooks";

import { BarChart } from "@/components/BarChart";
import { LineChart } from "@/components/LineChart";
import { cls } from "@/cls";


enum Detector {
  DZ,
  DG,
  DN
}

export function CommandsTab() {
  const [selectedDetector, setSelectedDetector] = useState(Detector.DZ);
  const [selectedPort, setSelectedPort] = useState("/dev/ttyS3");

  const availablePorts = [
    "/dev/ttyS0",
    "/dev/ttyS1",
    "/dev/ttyS2",
    "/dev/ttyS3",
  ];

  const mkTab = (name, val) =>
    <li
      onClick={() => setSelectedDetector(val)}
      class={cls({"is-active": selectedDetector === val})}
    >
      <a>{name}</a>
    </li>;

    const mkCommand = name =>
      <div class="panel-block">
        <button class="button is-info">{name}</button>
      </div>;

  return (<>
    <div class="columns">
      <div class="column is-half">
        <div class="tabs is-fullwidth mt-4">
          <ul>
            { mkTab("ДЗЧ", Detector.DZ) }
            { mkTab("ДГИ", Detector.DG) }
            { mkTab("ДНИ", Detector.DN) }
          </ul>
        </div>

        <div class="level">
          <div class="level-left">
            <div class="level-item">
              <span class="is-size-5 mr-4">Порт RS-485</span>
              <div class="select">
                <select
                  value={selectedPort}
                  onInput={e => setSelectedPort(e.currentTarget.value)}
                >
                  {availablePorts.map(p => <option value={p}>{p}</option>)}
                </select>
              </div>
              <span class="tag is-medium is-light is-warning ml-4">
                Основной полукомплект
              </span>
            </div>
          </div>
        </div>

        <div class="block">
          <button
            class="button is-info"
            onClick={() => 0}
          >
            Начать опрос
          </button>
        </div>

        { selectedDetector === Detector.DZ && <DZTab/> }
        { selectedDetector === Detector.DG && <DGTab/> }
        { selectedDetector === Detector.DN && <DNTab/> }
      </div>
      <div class="column is-half">
        <div class="panel">
          <div class="panel-heading">Команды</div>
          { mkCommand("Команда 1") }
          { mkCommand("Команда 2") }
          { mkCommand("Команда 3") }
          { mkCommand("Команда 4") }
        </div>
        <h1 class="is-size-5">Телеметрические данные</h1>
        <pre style="min-height: 10vh; width: 100%; overflow: auto;">
        </pre>
      </div>
    </div>
  </>);
}


function DZTab() {
  return (<>
    <div>
      <h1 class="is-size-5">ДЗЧ − спектр</h1>
      <BarChart width={500} height={250} />
    </div>
    <div>
      <h1 class="is-size-5">ДЗЧ − темп счёта</h1>
      <LineChart width={500} height={250} />
    </div>
  </>);
}

function DGTab() {
  return (
    <div>
      <h1 class="is-size-5">ДГИ − спектр</h1>
      <BarChart width={500} height={250} />
    </div>
  );
}

function DNTab() {
  return (
    <div>
      <h1 class="is-size-5">ДНИ − темп счёта</h1>
      <LineChart width={500} height={250} />
    </div>
  );
}
