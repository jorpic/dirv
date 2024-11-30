import { useState } from "preact/hooks";

import { BarChart } from "@/components/BarChart";
import { LineChart } from "@/components/LineChart";

export function CalibrationTab() {
  const [size, setSize] = useState(20);

  const mkThreeStateBtn = () =>
    <p class="control buttons has-addons ml-5">
      <button class="button is-rounded is-danger">Выкл</button>
      <button class="button is-rounded -is-warning">Основной</button>
      <button class="button is-rounded -is-warning">Резервный</button>
    </p>;

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
            {mkThreeStateBtn()}
          </div>
          <div class="panel-block">
            <strong>ДНИ</strong>
            {mkThreeStateBtn()}
          </div>
          <div class="panel-block">
            <strong>ДГИ</strong>
            {mkThreeStateBtn()}
          </div>
        </div>
      </div>
    </div>
    <div class="is-flex is-flex-wrap-wrap is-justify-content-space-evenly">
      <div>
        <h1 class="is-size-5">ДЗЧ − спектр</h1>
        <BarChart width={500} height={220} size={size}/>
      </div>
      <div>
        <h1 class="is-size-5">ДЗЧ − темп счёта</h1>
        <LineChart width={500} height={220} size={size}/>
      </div>
      <div>
        <h1 class="is-size-5">ДГИ − спектр</h1>
        <BarChart width={500} height={220} size={size}/>
      </div>
      <div>
        <h1 class="is-size-5">ДНИ − темп счёта</h1>
        <LineChart width={500} height={220} size={size}/>
      </div>
    </div>
  </>);
}
