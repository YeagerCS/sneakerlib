import InputBind from "./models/InputBind.js";

const PATH_PREFIX = "src/components/";
let routes = {};

const fetchComponent = async (component, callback) => {
  const path = `${PATH_PREFIX}${component.replace(".html", "")}/`;
  const response = await fetch(path + component);
  if (response.status === 200) {
    const result = await response.text();
    callback(result);
  }
};

export const initialRender = async (Component, parent) => {
  const component = new Component();

  const app = document.getElementById(parent);

  await fetchComponent("App.html", (html) => {
    const htmlComponent = document.createElement("div");
    htmlComponent.innerHTML = html;

    app.appendChild(htmlComponent);
    component.init();
  });
};

export const initHtml = async (component) => {
  const response = await fetch(
    PATH_PREFIX + `${component.replace(".html", "")}/${component}`
  );

  const result = await response.text();
  return result;
};

export const initRender = (html, parent) => {
  document.getElementById(parent).innerHTML = html;
};

export const render = async (Component, parent, state = {}) => {
  const component = new Component();
  component.state = state;
  const html = await initHtml(component.name);
  initRender(html, parent);
  setTitle(component.title)
  component.init();
};

export const multiRender = async (Component, parent, list) => {
  for(let item of list){
    const component = new Component();
    const divClass = "class-" + uuid()
    component.state = {mrItem: item, class: divClass};
    const template = await initHtml(component.name)
    const div = document.createElement("div")
    div.classList.add(divClass)
    div.innerHTML = template;

    document.getElementById(parent).appendChild(div)
    component.init();
  }
}

export const multiRenderClick = (state, id, callback) => {
  document.querySelector(`.${state.class} #${id}`).addEventListener("click", () => {
    callback();
  })
}

export const multiRenderWriteText = (state, id) => {
  document.querySelector(`.${state.class} #${id}`).textContent = state.mrItem[id]
}

export const multiRenderWriteImageSrc = (state, id) => {
  document.querySelector(`.${state.class} #${id}`).src = state.mrItem[id]
}

const setTitle = (title) => {
  if(title){
    document.title = title;
  }
}

export const initCss = async (script) => {
  const response = await fetch(
    PATH_PREFIX + `${script.replace(".css", "")}/${script}`
  );

  const css = await response.text();
  const style = document.createElement("style");
  style.textContent = css;
  document.head.appendChild(style);
};

export const DOMLoaded = (init) => {
  document.addEventListener("DOMContentLoaded", () => {
    setTimeout(async () => {
      await init();
    }, 200);
  });
};

export const bindButton = (button, action) => {
  document.getElementById(button).addEventListener("click", action);
};

export const setInput = (InputBind) => {
  const elem = document.getElementById(InputBind.elem);
  elem.onkeyup = () => {
    InputBind.value = elem.value;
  };
};

export const enableRoutes = (setRoutes, executeRoutes) => {
    document.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', e => {
          e.preventDefault();
  
          const href = link.getAttribute('href');
  
          history.pushState(null, null, href);
          routes = setRoutes;
          executeRoutes();
        });
    });
}

export const emit = (e, data) => {
  const newEvent = new CustomEvent(e, { detail: data });
  window.dispatchEvent(newEvent)
}

export const receive = (e, action) => {
  window.addEventListener(e, action);
}

export const populateTable = (table, tableData, action = null) => {
  const tableBody = document.querySelector(`#${table} tbody`)
        
  tableBody.innerHTML = "";

  tableData && tableData.forEach(data => {
      const row = document.createElement("tr")

      if(action){
        row.addEventListener("click", () => {
          action(data)
        })
      }

      Object.keys(data).forEach(key => {
          const cell = document.createElement("td")
          cell.textContent = data[key]
          row.appendChild(cell)
      })

      tableBody.appendChild(row)
  })
}

export const uuid = () => {
  const hex = "abcdef0123456789"
  const pattern = [8, 4, 4, 4, 12];
  let uuid = ""

  pattern.forEach((length, index) => {
    for(let i = 0; i <length; i++){
      uuid += hex[Math.floor(Math.random() * hex.length)]
    }

    if(index < pattern.length - 1){
      uuid += "-"
    }
  })

  return uuid;
}

export const asLocalStorage = (inital, name = uuid()) => {
  let data = JSON.parse(localStorage.getItem(name)) || inital;

  const handler = {
    get: (target, prop) => {
      return target[prop]
    },

    set: (target, prop, value) => {
      target[prop] = value;

      localStorage.setItem(name, JSON.stringify(target))
      return true;
    },

    apply: (target, thisArg, args) => {
      const result = target.apply(thisArg, args)
      localStorage.setItem(name, JSON.stringify(target))
      return result;
    }
  }

  const proxy = new Proxy(data, handler)
  return proxy;
}

export const renderEach = ({data, attach, elem = "div", style = null, subElem = "div", action = null}) => {
  const attachToElem = document.getElementById(attach)
  if(!style){
    style = `
    display: flex;
    gap: 5px;
    `;
  }
  data && data.forEach((obj) => {
    const element = document.createElement(elem)
    element.style = style;

    if(action){
      element.addEventListener("click", () => {
        action(obj)
      })
    }

    Object.keys(obj).forEach(key => {
      const cell = document.createElement(subElem)
      cell.textContent = obj[key]
      element.appendChild(cell)
    })

    attachToElem.appendChild(element)
  })
}

export const bindInputs = (object) => {
  Object.keys(object).forEach(key => {
    object[key] = new InputBind(key)
  })
}

// Maps keys in objects which are InputBind instances to the values of the input bind
export const values = (object) => {
  return Object.keys(object).reduce((valueObject, key) => {
    const InputBind = object[key]
    valueObject[key] = InputBind.value;
    return valueObject;
  }, {})
}

export const validate = (inputObj, 
  pwRegex = /^(?=.[a-z])(?=.[A-Z])(?=.\d)(?=.[@$!%?&])[A-Za-z\d@$!%?&]{8,}$/g,
  pwKey = "password", emailKey = "email"
  ) => {

  let caughtError = false;
  Object.keys(inputObj).forEach(key => {
    if(!inputObj[key]){
      caughtError = true;
      return false;
    }

    if(key === pwKey){
      if(!inputObj[key].value.match(pwRegex)){
        caughtError = true;
        return false;
      }
    }

    if(key === emailKey){
      const emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g;
      if(!inputObj[key].value.match(emailRegex)){
        caughtError = true;
        return false;
      }
    }
  })

  if (caughtError){
    return false;
  }
  return true;
}

export const applyStyles = (...styles) => {
  let styleString = "";

  for(let val of styles){
    styleString += `${val}${val.endsWith(";") ? "" : ";"}\n`;
  }
  return styleString;
}

export const write = (text, id) => {
  const elem = document.getElementById(id)
  if(elem){
    elem.textContent = text;
  }
}

export const writeImgSrc = (src, id) => {
  const elem = document.getElementById(id)
  if(elem){
    elem.src = src;
  }
}

export const read = (id) => {
  const elem = document.getElementById(id)
  return elem ? elem.textContent : "";
}

export const navigate = (url, state = {}) => {
  if (state) {
    const urlWithState = new URL(url, window.location.origin);
    for (const key in state) {
      if (state.hasOwnProperty(key)) {
        urlWithState.searchParams.append(key, JSON.stringify(state[key]));
      }
    }
    window.location.href = urlWithState.href;
    return;
  }

  window.location.href = url;
}

export const getNavigateState = () => {
  const urlParams = new URLSearchParams(window.location.search);
  const state = {};
  for (const [key, value] of urlParams.entries()) {
    try {
      state[key] = JSON.parse(value);
    } catch (e) {
      state[key] = value;
    }
  }
  return state;
};

// Paginator

export let pagMin, pagMax;
export const initializePaginator = (min, max) => {
  pagMin = min;
  pagMax = max;
}

export const paginatorNext = (amountOfEntries, arrayLength, action) => {
  if (pagMax < arrayLength) {
    pagMin += amountOfEntries;
    pagMax = Math.min(pagMin + amountOfEntries, arrayLength);
    action();
  }
}

export const paginatorBack = (amountOfEntries, action) => {
  if (pagMin >= amountOfEntries) {
    pagMin -= amountOfEntries;
    pagMax = pagMin + amountOfEntries;
    action();
  }
}

export const setElemHidden = (id, hidden) => {
  document.getElementById(id).style.display = hidden ? "none" : "block";
}