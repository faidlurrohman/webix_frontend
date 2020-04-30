import { JetView, plugins } from "webix-jet";

export default class TopView extends JetView {
  config() {
    var header = {
      type: "header",
      template: "Menu",
      css: "webix_header app_header",
    };

    var menu = {
      view: "menu",
      id: "top:menu",
      css: "app_menu",
      width: 180,
      layout: "y",
      select: true,
      template: "<span class='webix_icon #icon#'></span> #value# ",
      data: [{ value: "Products", id: "data", icon: "wxi-columns" }],
    };

    var ui = {
      type: "clean",
      paddingX: 5,
      css: "app_layout",
      cols: [
        {
          paddingX: 5,
          paddingY: 10,
          rows: [{ rows: [header, menu] }],
        },
        { type: "wide", paddingY: 10, paddingX: 5, rows: [{ $subview: true }] },
      ],
    };

    return ui;
  }
  init() {
    this.use(plugins.Menu, "top:menu");
  }
}
