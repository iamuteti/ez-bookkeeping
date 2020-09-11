//get this data from your firebase account
var firebaseConfig = {
  apiKey: "",
  authDomain: "",
  databaseURL: "",
  projectId: "",
  storageBucket: "",
  messagingSenderId: "",
  appId: "",
  measurementId: ""
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

var today = new Date();
var year = today.getFullYear();
var month = today.toLocaleString("default", { month: "long" });
var day = today.getDate();

let todayDateDisplay = month + " " + day + ", " + year;
let todayDate = month + day + year;

var dateDisplay = document.getElementById("today_date");
dateDisplay.innerHTML = "<p>" + todayDateDisplay + "</p>";

var totalDisplay = document.getElementById("total_today");

function pageRefresh() {
  document.getElementById("cash_input").focus();

  var db = firebase.database();

  //Listing Income
  var dbIncome = db.ref("Income");
  dbIncome.orderByChild("Date").on("child_added", async function(snapshot) {
    var listDate = await snapshot.val().Date;

    if (listDate === todayDate) {
      var incomeList = document.getElementById("income_list");
      var incomeRow = document.createElement("li");
      incomeRow.className = "list_income_item";
      incomeRow.innerHTML = snapshot.val().Amount;
      var incomeNoteRow = document.createElement("li");
      incomeNoteRow.className = "list_income_note";
      incomeNoteRow.innerHTML = snapshot.val().Note;

      var deleteButton = document.createElement("button");
      deleteButton.innerHTML = "Delete";
      deleteButton.onclick = deleteListItem;

      var editButton = document.createElement("button");
      editButton.innerHTML = "Edit";
      editButton.onclick = editListItem;

      incomeList.appendChild(incomeRow);
      if (incomeNoteRow.innerHTML) {
        incomeList.appendChild(incomeNoteRow);
      }
      incomeList.appendChild(deleteButton);
      incomeList.appendChild(editButton);

      async function deleteListItem() {
        var key = snapshot.key;
        var subtractAmount = Number(snapshot.val().Amount);
        console.log(key);
        await dbIncome.child(key).remove();

        var total = db.ref("Total");
        total.once("value").then(function(snapshot2) {
          var oldSum = Number(snapshot2.child(todayDate).val().Sum);
          var newSum = oldSum - subtractAmount;
          total.child(todayDate).set({
            Sum: newSum
          });
          incomeRow.style.visibility = "hidden";
          incomeNoteRow.style.visibility = "hidden";
          deleteButton.style.visibility = "hidden";
          totalDisplay.innerHTML = "<p>$ " + newSum + "</p>";
          location.reload();
        });
      }

      async function editListItem() {
        var key = snapshot.key;
        var previousAmount = snapshot.val().Amount;
        var previousNote = snapshot.val().Note;
        var newAmount = Number(window.prompt("Amount:", previousAmount));
        var newNote = window.prompt("Note:", previousNote);

        var total = db.ref("Total");
        total.once("value").then(function(snapshot2) {
          var oldSum = Number(snapshot2.child(todayDate).val().Sum);

          if (newAmount > previousAmount) {
            var newSum = oldSum + (newAmount - previousAmount);
            totalDisplay.innerHTML = "<p>$ " + newSum + "</p>";
            total.child(todayDate).set({
              Sum: newSum
            });
            var incomeEdit = db.ref("Income");
            incomeEdit.once("value").then(function(snapshot3) {
              incomeEdit.child(key).update({
                Amount: newAmount,
                Note: newNote
              });
            });
          } else if (previousAmount > newAmount) {
            var newSum = oldSum - (previousAmount - newAmount);
            totalDisplay.innerHTML = "<p>$ " + newSum + "</p>";
            total.child(todayDate).set({
              Sum: newSum
            });
            var incomeEdit = db.ref("Income");
            incomeEdit.once("value").then(function(snapshot3) {
              incomeEdit.child(key).update({
                Amount: newAmount,
                Note: newNote
              });
            });
          } else if (previousAmount === newAmount) {
            var incomeEdit = db.ref("Income");
            incomeEdit.once("value").then(function(snapshot3) {
              incomeEdit.child(key).update({
                Note: newNote
              });
            });
          }
          incomeRow.innerHtml = newAmount;
          incomeNoteRow.innerHtml = newNote;
          location.reload();
        });
      }
    }
  });

  //Listing Expense
  var dbExpenditure = db.ref("Expenditure");
  dbExpenditure
    .orderByChild("Date")
    .on("child_added", async function(snapshot) {
      var listDate = await snapshot.val().Date;

      if (listDate === todayDate) {
        var expenditureList = document.getElementById("expenditure_list");
        var expenditureRow = document.createElement("li");
        expenditureRow.className = "list_expenditure_item";
        expenditureRow.innerHTML = snapshot.val().Amount;
        var expenditureNoteRow = document.createElement("li");
        expenditureNoteRow.className = "list_expenditure_note";
        expenditureNoteRow.innerHTML = snapshot.val().Note;
        var deleteButton = document.createElement("button");
        deleteButton.innerHTML = "Delete";
        deleteButton.onclick = deleteListItem;
        var editButton = document.createElement("button");
        editButton.innerHTML = "Edit";
        editButton.onclick = editListItem;

        expenditureList.appendChild(expenditureRow);
        if (expenditureNoteRow.innerHTML) {
          expenditureList.appendChild(expenditureNoteRow);
        }
        expenditureList.appendChild(deleteButton);
        expenditureList.appendChild(editButton);

        async function deleteListItem() {
          var key = snapshot.key;
          var addAmount = Number(snapshot.val().Amount);
          console.log(key);
          await dbExpenditure.child(key).remove();

          var total = db.ref("Total");
          total.once("value").then(function(snapshot2) {
            var oldSum = Number(snapshot2.child(todayDate).val().Sum);
            var newSum = oldSum + addAmount;
            total.child(todayDate).set({
              Sum: newSum
            });
            expenditureRow.style.visibility = "hidden";
            expenditureNoteRow.style.visibility = "hidden";
            deleteButton.style.visibility = "hidden";
            totalDisplay.innerHTML = "<p>$ " + newSum + "</p>";
            location.reload();
          });
        }

        async function editListItem() {
          var key = snapshot.key;
          var previousAmount = snapshot.val().Amount;
          var previousNote = snapshot.val().Note;
          var newAmount = Number(window.prompt("Amount:", previousAmount));
          var newNote = window.prompt("Note:", previousNote);

          var total = db.ref("Total");
          total.once("value").then(function(snapshot2) {
            var oldSum = Number(snapshot2.child(todayDate).val().Sum);

            if (newAmount > previousAmount) {
              var newSum = oldSum - (newAmount - previousAmount);
              totalDisplay.innerHTML = "<p>$ " + newSum + "</p>";
              total.child(todayDate).set({
                Sum: newSum
              });
              var expenditureEdit = db.ref("Expenditure");
              expenditureEdit.once("value").then(function(snapshot3) {
                expenditureEdit.child(key).update({
                  Amount: newAmount,
                  Note: newNote
                });
              });
            } else if (previousAmount > newAmount) {
              var newSum = oldSum + (previousAmount - newAmount);
              totalDisplay.innerHTML = "<p>$ " + newSum + "</p>";
              total.child(todayDate).set({
                Sum: newSum
              });
              var expenditureEdit = db.ref("Expenditure");
              expenditureEdit.once("value").then(function(snapshot3) {
                expenditureEdit.child(key).update({
                  Amount: newAmount,
                  Note: newNote
                });
              });
            } else if (previousAmount === newAmount) {
              var expenditureEdit = db.ref("Expenditure");
              expenditureEdit.once("value").then(function(snapshot3) {
                expenditureEdit.child(key).update({
                  Note: newNote
                });
              });
            }
            expenditureRow.innerHtml = newAmount;
            expenditureNoteRow.innerHtml = newNote;
            location.reload();
          });
        }
      }
    });

  //Total
  var totalRef = db.ref("Total");
  totalRef.once("value").then(function(snapshot) {
    if (snapshot.child(todayDate).val() === null) {
      totalDisplay.innerHTML = "<p> $ 0 </p>";
    } else {
      var dateTotal = snapshot.child(todayDate).val().Sum;
      totalDisplay.innerHTML = "<p>$ " + dateTotal + "</p>";
    }
  });
}

async function plusSubmission() {
  var db = firebase.database();
  var myDBConn = db.ref();
  var incomeBranch = myDBConn.child("Income");
  var amount = Number(document.getElementById("cash_input").value);
  var note = document.getElementById("note_input");
  incomeBranch.push({
    Amount: amount,
    Note: note.value,
    Date: todayDate
  });

  var total = db.ref("Total");
  total.once("value").then(function(snapshot) {
    if (snapshot.child(todayDate).val() === null) {
      total.child(todayDate).set({
        Sum: amount
      });
    } else {
      var oldSum = Number(snapshot.child(todayDate).val().Sum);
      var newSum = oldSum + amount;
      total.child(todayDate).set({
        Sum: newSum
      });
      totalDisplay.innerHTML = "<p>$ " + newSum + "</p>";
    }
  });
  document.getElementById("cash_input").value = "";
  note.value = "";
}

function minusSubmission() {
  var db = firebase.database();
  var myDBConn = db.ref();
  var expenditureBranch = myDBConn.child("Expenditure");
  var amount = Number(document.getElementById("cash_input").value);
  var note = document.getElementById("note_input");
  expenditureBranch.push({
    Amount: amount,
    Note: note.value,
    Date: todayDate
  });

  var total = db.ref("Total");
  total.once("value").then(function(snapshot) {
    if (snapshot.child(todayDate).val() === null) {
      total.child(todayDate).set({
        Sum: -amount
      });
    } else {
      var oldSum = Number(snapshot.child(todayDate).val().Sum);
      var newSum = oldSum - amount;
      total.child(todayDate).set({
        Sum: newSum
      });
      totalDisplay.innerHTML = "<p>$ " + newSum + "</p>";
    }
  });
  document.getElementById("cash_input").value = "";
  note.value = "";
}
