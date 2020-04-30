import { JetView } from "webix-jet";
import { products, dbAdd, dbUpdate, dbRemove } from "../models/products";
const URL = "http://127.0.0.1:8000/api/";

export default class DataView extends JetView {
  config() {
    var dataProducts = new webix.DataCollection({ data: products });

    var formAdd = [
      { view: "text", label: "Name", name: "name", placeholder: "Name" },
      {
        view: "text",
        label: "Description",
        name: "description",
        placeholder: "Description",
      },
      {
        view: "button",
        id: "button1",
        value: "Add New Product",
        css: "webix_primary",
        click: function () {
          var form = this.getFormView();
          if (form.validate()) {
            const values = this.getParentView().getValues();
            dbAdd(values);
            setTimeout(() => {
              $$("add-form").clear();
              refreshData();
            }, 2000);
          }
        },
      },
    ];

    var add = {
      view: "form",
      id: "add-form",
      css: "add-form",
      scroll: false,
      autowidth: true,
      autoheight: true,
      elements: formAdd,
      rules: {
        name: webix.rules.isNotEmpty,
        description: webix.rules.isNotEmpty,
      },
      elementsConfig: {
        labelPosition: "top",
      },
      on: {
        onValidationError: function (key) {
          var text;
          if (key === "name") text = "Name can't be empty";
          if (key === "description") text = "Description can't be empty";
          webix.message({ type: "error", text: text });
        },
      },
    };

    var filter = {
      view: "toolbar",
      rows: [
        {
          view: "text",
          id: "input_filter",
          placeholder: "Filter product by name",
          on: {
            onTimedKeyPress() {
              const filterValue = this.getValue().toLowerCase();
              $$("table_products").filter(function (obj) {
                const objResult = obj.title.toLowerCase().indexOf(filterValue);
                return objResult !== -1;
              });
            },
          },
        },
      ],
    };

    var table = {
      view: "datatable",
      id: "table_products",
      scrollX: false,
      data: dataProducts,
      autoheight: true,
      select: true,
      on: {
        onBeforeLoad: function () {
          this.showOverlay("Loading...");
        },
        onAfterLoad: function () {
          this.hideOverlay();
        },
      },
      columns: [
        {
          id: "title",
          header: "Name",
          sort: "string_strict",
          fillspace: true,
        },
        { id: "description", header: "Description", fillspace: true },
      ],
      editable: true,
      form: "formActions",
      pager: "pager",
    };

    var form = {
      view: "form",
      width: 300,
      id: "formActions",
      css: "formActions",
      hidden: true,
      elements: [
        {
          view: "text",
          id: "title",
          name: "title",
          label: "Name",
          placeholder: "Name",
        },
        {
          view: "text",
          id: "description",
          name: "description",
          label: "Description",
          placeholder: "Description",
        },
        {
          cols: [
            {
              cols: [
                {
                  view: "button",
                  value: "Update",
                  type: "form",
                  click: updateData,
                  css: "webix_primary",
                },
                {
                  view: "button",
                  value: "Remove",
                  css: "webix_danger",
                  click: removeData,
                },
              ],
            },
          ],
        },
        {
          view: "button",
          value: "Cancel",
          click: cancelActions,
        },
        {},
      ],
      rules: {
        title: webix.rules.isNotEmpty,
        description: webix.rules.isNotEmpty,
      },
      elementsConfig: {
        labelPosition: "top",
      },
    };

    function refreshData() {
      dataProducts.clearAll();
      dataProducts.load(`${URL}products`);
    }

    function updateData(id) {
      var form = $$(id).getFormView();
      var values = form.getValues();
      if (form.validate()) {
        dbUpdate(values);
        $$("table_products").updateItem(values.id, values);
        $$("formActions").hide();
        $$("formActions").clearValidation();
      } else {
        webix.message("Field cannot be empty!", "error");
        $$("formActions").hide();
        $$("formActions").clearValidation();
      }
    }

    function removeData() {
      const id = $$("table_products").getSelectedId();
      if (id)
        webix.confirm({
          title: "Delete",
          text: "Are you sure want to delete the product?",
          callback: function (result) {
            if (result) {
              dbRemove(id);
              $$("table_products").remove(id);
              $$("formActions").hide();
            }
          },
        });
      else webix.message("No product is selected!", "error");
    }

    function cancelActions() {
      $$("formActions").hide();
    }

    return {
      cols: [
        {
          rows: [
            add,
            filter,
            table,
            {},
            {
              view: "pager",
              id: "pager",
              size: 5,
              group: 3,
              template:
                "{common.first()}{common.prev()}{common.pages()}{common.next()}{common.last()}",
            },
            {},
          ],
        },
        form,
      ],
    };
  }
}
