const URL = "http://127.0.0.1:8000/api/";

export const products = new webix.ajax(`${URL}products`).then((data) => {
  return data.json();
});

export function dbAdd(values) {
  fetch(`${URL}products`, {
    method: "post",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      title: values.name,
      description: values.description,
    }),
  }).then((data) => {
    return webix.message(`New product added!`, "success");
  });
}

export function dbUpdate(values) {
  fetch(`${URL}products/${values.id}`, {
    method: "put",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      title: values.title,
      description: values.description,
    }),
  }).then((data) => {
    // console.log(data);
    return webix.message(`Product updated!`, "success");
  });
}

export function dbRemove(id) {
  fetch(`${URL}products/${id}`, {
    method: "delete",
  }).then((data) => {
    // console.log(data);
    return webix.message(`Product deleted!`, "success");
  });
}
