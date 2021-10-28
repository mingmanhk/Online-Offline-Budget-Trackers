let db;

//create new indexedDB request
const request = window.indexedDB.open("budget", 1);

// Create schema
request.onupgradeneeded = (event) => {
  db = event.target.result;
  // Creates an object store with a listID keypath that can be used to query on.
   if (db.objectStoreNames.length === 0) {
     db.createObjectStore("budget", { autoIncrement: true });
   }
     console.log("IndexedDB Connection Success 👍");
};

// request error
request.onerror = function (e) {
    console.log("IndexedDB Connection Failed 💥");
    console.log(`Woops! ${e.target.errorCode}`);
};

// Opens a transaction, accesses the toDoList objectStore and statusIndex.
request.onsuccess = () => {
  const db = request.result;
  const transaction = db.transaction(["toDoList"], "readwrite");
  const toDoListStore = transaction.objectStore("toDoList");
  const statusIndex = toDoListStore.index("statusIndex");

  // Adds data to our objectStore
  toDoListStore.add({ listID: "1", status: "complete" });
  toDoListStore.add({ listID: "2", status: "in-progress" });
  toDoListStore.add({ listID: "3", status: "in-progress" });
  toDoListStore.add({ listID: "4", status: "backlog" });

  // Opens a Cursor request and iterates over the documents.
  const getCursorRequest = toDoListStore.openCursor();
  getCursorRequest.onsuccess = (e) => {
    const cursor = e.target.result;
    if (cursor) {
      if (cursor.value.status === "in-progress") {
        const todo = cursor.value;
        todo.status = "complete";
        cursor.update(todo);
      }
      cursor.continue();
    }
  };
};

//upload offline data once back online
function checkDatabase() {
  console.log("check db invoked");

  // Open a transaction on your budget db
  let transaction = db.transaction(["budget"], "readwrite");

  // access your budget object
  const store = transaction.objectStore("budget");

  // Get all records from store and set to a variable
  const getAll = store.getAll();

  // If the request was successful
  getAll.onsuccess = function () {
    // If there are items in the store, we need to bulk add them when we are back online
    if (getAll.result.length > 0) {
      fetch("/api/transaction/bulk", {
        method: "POST",
        body: JSON.stringify(getAll.result),
        headers: {
          Accept: "application/json, text/plain, */*",
          "Content-Type": "application/json",
        },
      })
        .then((response) => response.json())
        .then((res) => {
          // If our returned response is not empty
          if (res.length !== 0) {
            // Open another transaction to budget with the ability to read and write
            transaction = db.transaction(["budget"], "readwrite");

            // Assign the current store to a variable
            const currentStore = transaction.objectStore("budget");

            // Clear existing entries because our bulk add was successful
            currentStore.clear();
            console.log("Clearing store 🧹");
          }
        });
    }
  };
}

request.onsuccess = function (e) {
  console.log("success");
  db = e.target.result;

  // Check if app is online before reading from db
  if (navigator.onLine) {
    console.log("Backend online! 🗄️");
    checkDatabase();
  }
};

const saveRecord = (record) => {
  console.log("Save record invoked");
  // Create a transaction on the budget db with readwrite access
  const transaction = db.transaction(["budget"], "readwrite");

  // Access your budget object store
  const store = transaction.objectStore("budget");

  // Add record to your store with add method.
  store.add(record);
};

// Listen for app coming back online
window.addEventListener("online", checkDatabase);
