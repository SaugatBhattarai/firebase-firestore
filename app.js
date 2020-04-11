const cafeList = document.querySelector("#cafe-list");
const form = document.querySelector("#add-cafe-form");

//create element and render cafe
function renderCafe(doc) {
  let li = document.createElement("li");
  let name = document.createElement("span");
  let city = document.createElement("span");
  let cross = document.createElement("div");

  li.setAttribute("data-id", doc.id);
  name.textContent = doc.data().name;
  city.textContent = doc.data().city;
  cross.textContent = "x";

  li.appendChild(name);
  li.appendChild(city);
  li.appendChild(cross);
  cafeList.appendChild(li);

  //deleting data
  cross.addEventListener("click", (e) => {
    e.stopPropagation();
    let id = e.target.parentElement.getAttribute("data-id");
    db.collection("cloudcafe").doc(id).delete();
  });
}

// //getting data
// db.collection("cloudcafe")
//   .where("city", "==", "sunwal")
//   .orderBy("name")
//   .get()
//   .then((snapshot) => {
//     // console.log(snapshot.docs);
//     snapshot.docs.forEach((doc) => {
//       renderCafe(doc);
//     });
//   });

//saving data
form.addEventListener("submit", (e) => {
  e.preventDefault();

  db.collection("cloudcafe").add({
    name: form.name.value,
    city: form.city.value,
  });
  form.name.value = "";
  form.city.value = "";
});

//real-time listener
db.collection("cloudcafe")
  .orderBy("city")
  .onSnapshot((snapshot) => {
    let changes = snapshot.docChanges();
    // console.log(changes);
    changes.forEach((change) => {
      // console.log(change.doc.data());
      if (change.type == "added") {
        renderCafe(change.doc);
      } else if (change.type == "removed") {
        let li = cafeList.querySelector("[data-id=" + change.doc.id + "]");
        cafeList.removeChild(li);
      }
    });
  });

//updating the data --- this part is not included in UI

//===============================================================
//part 1. update with update() function
// update allows you to update the one or two property
// without affecting reset of document

/**  db.collection('cloudcafe')
    .doc('GH4t99wW86m3Csj8UDNb')
    .update({
        name:'New Cafe name'
        city:'New City'
    })
*/

//===============================================================
//part 2. update with set() function
// overrides completely the whole document regardless which
// properties you want to update

/**  db.collection('cloudcafe')
    .doc('GH4t99wW86m3Csj8UDNb')
    .set({
        name:'New Cafe name'
    })
*/
// db.collection('cloudcafe').doc('GH4t99wW86m3Csj8UDNb').set({name:'New Cafe',city:'new city'})
// Note: city will be blanked if not included
//===============================================================
