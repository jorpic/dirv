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
