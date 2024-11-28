
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
