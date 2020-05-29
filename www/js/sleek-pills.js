class SleekPills extends HTMLElement {

  constructor() {
    super();
    this.shadow = this.attachShadow({ mode: 'open' });
    this.ul = document.createElement('ul');
    this.shadow.appendChild(this.ul);
    this.shadow.appendChild(style.content.cloneNode(true));
    window.addEventListener(this.getAttribute('filter-event'), this.filter, false);
  };

  async connectedCallback() {
    const Module = await import(this.getAttribute('api'))
    this.data = await Module.getData();
    this.updateList(this.data);
  }

  filter = (event) => {
    const partial = event.detail.toString().toLowerCase();
    const filtered = this.data.filter(function(datum) {
      return datum.code.toLowerCase().includes(partial) || datum.name.toLowerCase().includes(partial);
    });
    this.updateList(filtered);
  }

  updateList = (data) => {
    if (this.hasAttribute("limit")) {
      data = data.slice(0, this.getAttribute('limit'));
    }
    let html = "";
    data.forEach(datum => {
      html += this.createLi(datum);
    });
    this.ul.innerHTML = html;
  }

  createLi = (datum) => (
    `<li class="pill">
       <a href="${datum.link}" title="${datum.title}">
         <p class="pill-code">${datum.code}</p>
         <p class="pill-name">${datum.name}</p>
       </a>
     </li>`
  );
}

const style = document.createElement('template');
style.innerHTML = `
  <style>
    ul, li, a, p {
      padding: 0;
      margin: 0;
      list-style: none;
    }
    ul {
      display: grid;
      grid-gap: 0.3em;
      grid-template-columns: repeat(auto-fill, minmax(15em, auto));
    }
    a {
      text-decoration: none;
      color: var(--dark-colof);
      border: 1px solid var(--shade-light-color);
      border-radius: var(--border-radius);
      background-color: var(--shade-light-color);
      display: flex;
      align-items: stretch;
    }
    a:hover {
      background-color: var(--shade-medium-color);
      border: 1px solid var(--shade-medium-color);
    }
    .pill-code {
      display: flex;
      align-items: center;
      flex: 1 1 10%;
      padding: 0 0.5em;
      border-radius: var(--border-radius) 0 0 var(--border-radius);
      background-color: var(--background-color);
      color: var(--shade-medium-color);
      font-weight: bold;
    }
    .pill-name {
      display: flex;
      align-items: center;
      flex: 1 1 90%;
      padding: 0 1em;
      font-size: 0.8em;
      overflow: hidden;
      white-space: nowrap;
    }
  </style>`;

customElements.define('sleek-pills', SleekPills);
export {SleekPills};