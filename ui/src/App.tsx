import { useState } from "preact/hooks";
import { invoke } from "@tauri-apps/api/core";

import { BarChart } from "./BarChart";
import { LineChart } from "./LineChart";


// FXIME: move to util
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


export function App() {
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

export function TestsTab() {
  return (<>
    <div class="block is-flex is-align-items-center">
      <h1 class="is-size-5">Полукомплект&nbsp;МСХИ</h1>
      <p class="control buttons has-addons ml-5">
        <button class="button is-rounded is-success is-selected">Основной</button>
        <button class="button is-rounded -is-warning">Резервный</button>
      </p>
    </div>

    <div class="block is-flex is-align-items-center">
      <button class="button is-info">Запустить самотестирование ДИРВ</button>
      <progress class="progress ml-5" style="width: 20vw;" value="15" max="100">15%</progress>
    </div>

    <div class="block">
      <h1 class="is-size-5">Результаты тестирования</h1>
      <ul class="ml-6" style="list-style: circle;">
        <li class="mb-2"><span class="tag is-medium is-light is-danger">ДЗЧ</span></li>
        <li class="mb-2"><span class="tag is-medium is-light is-danger">ДНИ</span> Ошибка</li>
        <li class="mb-2"><span class="tag is-medium is-light is-success">ДГИ</span> OK</li>
      </ul>
    </div>
  </>);
}

export function CalibrationTab() {
  const [size, setSize] = useState(20);

  return (<>
    <div class="columns">
      <div class="column is-half">
        <div class="block is-flex is-align-items-center">
          <span class="is-size-5">Полукомплект&nbsp;МСХИ</span>

          <p class="control buttons has-addons ml-5">
            <button class="button is-rounded is-success is-selected">Основной</button>
            <button class="button is-rounded -is-warning">Резервный</button>
          </p>
        </div>

        <div class="block">
          <button class="button is-info">Однократный запрос массива данных</button>
        </div>

        <div class="block">
          <button
            class="button is-info"
            onClick={() => setSize(size+10)}
          >
            Начать опрос
          </button>
        </div>
      </div>

      <div class="column">
        <div class="panel">
          <div class="panel-heading">Управление узлами</div>
          <div class="panel-block">
            <strong>ДЗЧ</strong>
            <p class="control buttons has-addons ml-5">
              <button class="button is-rounded is-danger">Выкл</button>
              <button class="button is-rounded -is-warning">Основной</button>
              <button class="button is-rounded -is-warning">Резервный</button>
            </p>
          </div>
          <div class="panel-block">
            <strong>ДНИ</strong>
            <p class="control buttons has-addons ml-5">
              <button class="button is-rounded is-danger">Выкл</button>
              <button class="button is-rounded -is-warning">Основной</button>
              <button class="button is-rounded -is-warning">Резервный</button>
            </p>
          </div>
          <div class="panel-block">
            <strong>ДГИ</strong>
            <p class="control buttons has-addons ml-5">
              <button class="button is-rounded is-danger">Выкл</button>
              <button class="button is-rounded -is-warning">Основной</button>
              <button class="button is-rounded -is-warning">Резервный</button>
            </p>
          </div>
        </div>
      </div>
    </div>
    <div class="is-flex is-flex-wrap-wrap is-justify-content-space-evenly">
      <div>
        <h1 class="is-size-5">ДЗЧ − спектр</h1>
        <BarChart width={500} height={250} size={size}/>
      </div>
      <div>
        <h1 class="is-size-5">ДЗЧ − темп счёта</h1>
        <LineChart width={500} height={250} size={size}/>
      </div>
      <div>
        <h1 class="is-size-5">ДГИ − спектр</h1>
        <BarChart width={500} height={250} size={size}/>
      </div>
      <div>
        <h1 class="is-size-5">ДНИ − темп счёта</h1>
        <LineChart width={500} height={250} size={size}/>
      </div>
    </div>
  </>);
}

export function CommandsTab() {
  return (<>
    <div class="columns">
      <div class="column is-half">
        <div class="tabs is-fullwidth mt-4">
          <ul>
            <li class="is-active"><a>ДЗЧ</a></li>
            <li class=""><a>ДГИ</a></li>
            <li class=""><a>ДНИ</a></li>
          </ul>
        </div>
      </div>
      <div class="column is-half">
        <div class="panel">
          <div class="panel-heading">Команды</div>
          <div class="panel-block">
            <button class="button is-info">Команда 1</button>
          </div>
          <div class="panel-block">
            <button class="button is-info">Команда 2</button>
          </div>
          <div class="panel-block">
            <button class="button is-info">Команда 3</button>
          </div>
          <div class="panel-block">
            <button class="button is-info">Команда 4</button>
          </div>
        </div>
      </div>
    </div>
    <div class="columns">
      <div class="column is-half">
      </div>
      <div class="column is-half">
        <h1 class="is-size-5">Телеметрические данные</h1>
        <pre style="min-height: 10vh; width: 100%; overflow: auto;">
        </pre>
      </div>
    </div>
  </>);
}

export function StatusTab() {
  return (<>
    <div class="block">
      <h1 class="is-size-5">Состояние портов RS-485</h1>
      <ul class="ml-6" style="list-style: circle;">
        <li class="mb-2"><span class="tag is-medium is-light is-danger">/dev/ttyS1</span></li>
        <li class="mb-2"><span class="tag is-medium is-light is-danger">/dev/ttyS2</span> Ошибка</li>
        <li class="mb-2"><span class="tag is-medium is-light is-success">/dev/ttyS3</span> OK</li>
      </ul>
    </div>

    <div class="block">
      <h1 class="is-size-5">Состояние портов ГОСТ Р52070</h1>
      <ul class="ml-6" style="list-style: circle;">
        <li class="mb-2"><span class="tag is-medium is-light is-danger">/dev/XXX</span></li>
      </ul>
    </div>

    <div class="block">
      <h1 class="is-size-5">Информация о подключении Ethernet</h1>
      <ul class="ml-6" style="list-style: circle;">
        <li class="mb-2"></li>
        <li class="mb-2"></li>
        <li class="mb-2"></li>
      </ul>
    </div>
  </>);
}

export function LogsTab() {
  // TODO: add a switch to control order of messages: chrono / reverse
  const messages = [
    {time: "1231234123", msg: "Hello"},
    {time: "12341234",  msg: "Hello"},
    {time: "1341231", msg: "Hello"},
    {time: "234234523", msg: "Hello"},
  ];
  const style = "height: 80vh; width: 100%; overflow: auto;";
  return (<pre style={style}>
      {messages.map(m =>
        <><strong>{m.time}</strong> {`${m.msg}\n`}</>
      )}
  </pre>);
}
