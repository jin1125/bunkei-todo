"use strict";

const table = document.querySelector("table"); // 表
const todo = document.getElementById("todo"); // TODO
const priority = document.querySelector("select"); // 優先度
const deadline = document.querySelector('input[type="date"]'); // 締切
const submit = document.getElementById("submit"); // 登録ボタン

let list = [];
const storage = localStorage;

const addItem = (item) => {
  const tr = document.createElement("tr"); // tr要素を生成

  // オブジェクトの繰り返しはfor-in文
  for (const prop in item) {
    const td = document.createElement("td"); // td要素を生成

    if (prop === "done") {
      const checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      checkbox.checked = item[prop];
      td.appendChild(checkbox);
      checkbox.addEventListener("change", checkBoxListener);
    } else {
      td.textContent = item[prop]; // ブラケット記法
    }

    tr.appendChild(td); // 生成したtd要素をtr要素に追加
  }

  table.append(tr); // trエレメントをtable要素に追加
};

const clearTable = () => {
  const trList = Array.from(document.getElementsByTagName("tr"));
  trList.shift();

  for (const tr of trList) {
    tr.remove();
  }
};

const checkBoxListener = (ev) => {
  // A. チェックボックスの親（td）の親（tr）を取得
  const currentTr = ev.currentTarget.parentElement.parentElement;

  // B. テーブルの全tr要素のリストを取得（＆配列に変換）
  const trList = Array.from(document.getElementsByTagName("tr"));

  // C. 配列.indexOfメソッドで何番目（インデックス）かを取得
  const idx = trList.indexOf(currentTr) - 1;

  // D. 配列listにそのインデックスでアクセスしてdoneを更新
  list[idx].done = ev.currentTarget.checked;

  // E. ストレージデータを更新
  storage.todoList = JSON.stringify(list);
};

document.addEventListener("DOMContentLoaded", () => {
  const json = storage.todoList;
  if (json == undefined) {
    return;
  }

  list = JSON.parse(json);

  for (const item of list) {
    addItem(item);
  }
});

submit.addEventListener("click", () => {
  const item = {}; // 入力値を一旦格納するオブジェクト

  if (todo.value !== "") {
    item.todo = todo.value;
  } else {
    window.alert("TODOを入力してください");
    return;
  }

  item.priority = priority.value;

  if (deadline.value !== "") {
    item.deadline = deadline.value;
  } else {
    item.deadline = new Date().toLocaleDateString().replace(/\//g, "-");
    // window.alert('期日を入力してください');
    // return
  }

  item.done = false; // 完了はひとまずBoolean値で設定

  // フォームをリセット
  todo.value = "";
  priority.value = "普";
  deadline.value = "";

  console.log(item); // 確認

  addItem(item);

  list.push(item);
  storage.todoList = JSON.stringify(list);
});

const filterButton1 = document.createElement("button");
filterButton1.textContent = "優先度（高）で絞り込み";
filterButton1.id = "priority";
const main = document.querySelector("main");
main.appendChild(filterButton1);

filterButton1.addEventListener("click", () => {
  clearTable();

  for (const item of list) {
    if (item.priority === "高") {
      addItem(item);
    }
  }
});

const filterButton2 = document.createElement("button");
filterButton2.textContent = "優先度（普）で絞り込み";
filterButton2.id = "priority";
main.appendChild(filterButton2);

filterButton2.addEventListener("click", () => {
  clearTable();

  for (const item of list) {
    if (item.priority === "普") {
      addItem(item);
    }
  }
});

const filterButton3 = document.createElement("button");
filterButton3.textContent = "優先度（低）で絞り込み";
filterButton3.id = "priority";
main.appendChild(filterButton3);

filterButton3.addEventListener("click", () => {
  clearTable();

  for (const item of list) {
    if (item.priority === "低") {
      addItem(item);
    }
  }
});

const filterButton4 = document.createElement("button");
filterButton4.textContent = "絞り込みを戻す";
filterButton4.id = "priority";
main.appendChild(filterButton4);

filterButton4.addEventListener("click", () => {
  location.reload();
});


const remove = document.createElement("button");
remove.textContent = "完了したTODOを削除する";
remove.id = "remove";
const br = document.createElement("br");
main.appendChild(br);
main.appendChild(remove);

remove.addEventListener("click", () => {
  clearTable();
  list = list.filter((item) => item.done === false);
  list.forEach((item) => addItem(item));
  storage.todoList = JSON.stringify(list);
});
