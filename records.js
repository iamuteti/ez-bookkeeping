//get this data from your firebase account
var firebaseConfig = {
  apiKey: "AIzaSyD6EePYcsl-wI4irLWpHzKKsE4OJ4ncxj4",
  authDomain: "tavern-93404.firebaseapp.com",
  databaseURL: "https://tavern-93404-default-rtdb.firebaseio.com",
  projectId: "tavern-93404",
  storageBucket: "tavern-93404.appspot.com",
  messagingSenderId: "871857106742",
  appId: "1:871857106742:web:561b8e3831bad926a30d97",
  measurementId: "G-6CZTR9KH34",
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
console.log("Firebase: ", firebase);
var db = firebase.database();

var today = new Date();
var year = today.getFullYear();
var month = today.toLocaleString("default", { month: "long" });
var day = today.getDate();
let todayDate = month + day + year;

var dayOfWeek = today.getDay();

let longMonths = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

var recordList = document.getElementById("records_list");

function pageRefresh() {
  var total = db.ref("Total");
  total.once("value").then(async function (snapshot) {
    yearLoop: for (let i = year - 1; i < year + 1; i++) {
      monthLoop: for (let j = 0; j < longMonths.length; j++) {
        dayLoop: for (let k = 1; k < 32; k++) {
          var dateString = longMonths[j] + k + i;

          if (snapshot.child(dateString).val() === null) {
            continue;
          } else {
            var total = await Number(snapshot.child(dateString).val().Sum);

            if (total < 0) {
              var negativeRecordRow = document.createElement("li");
              negativeRecordRow.className = "negative_record_row";
              negativeRecordRow.innerHTML =
                "<li>" +
                longMonths[j] +
                " / " +
                k +
                " / " +
                i +
                ": " +
                total +
                "</li>";
              recordList.appendChild(negativeRecordRow);
            } else {
              var positiveRecordRow = document.createElement("li");
              positiveRecordRow.className = "positive_record_row";
              positiveRecordRow.innerHTML =
                "<li>" +
                longMonths[j] +
                " / " +
                k +
                " / " +
                i +
                ": " +
                total +
                "</li>";
              recordList.appendChild(positiveRecordRow);
            }
          }

          if (dateString === todayDate) {
            break yearLoop;
          }
        }
      }
    }
  });
}
