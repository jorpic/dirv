export function cls() {
  const res = [];
  for(let arg of arguments) {
    if(typeof arg === "boolean") {
      if(arg) {
        continue;
      } else {
        break;
      }
    }
    if(typeof arg === "object") {
      for(let [k, v] of Object.entries(arg)) {
        if(v) {
          res.push(k);
        }
      }
    } else {
      res.push(arg);
    }
  }

  return res.join(" ");
}
