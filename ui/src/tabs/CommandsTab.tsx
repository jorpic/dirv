import { useState } from "preact/hooks";

import { BarChart } from "@/components/BarChart";
import { LineChart } from "@/components/LineChart";

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
