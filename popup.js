document.addEventListener("DOMContentLoaded", () => {
  const loadButton = document.getElementById("btnCharger");
  const typeSelect = document.getElementById("typeID");
  const resultdiv = document.getElementById("resultdiv");
  const alertdiv = document.getElementById("alertdiv");
  const jsondiv = document.getElementById("jsonContent");

  // Get a reference to the spinner element
  const spinner = document.getElementById("spinner");

  let jsonData = []; // Pour stocker les données JSON

  document
    .getElementById("uploadButton")
    .addEventListener("click", async () => {
      const cniId = document.getElementById("idcni").value;

      // Define the API endpoint URL
      const apiUrl = `http://telecom.pni.dj/r1/DJ/GOV/10004/CNI/getpersonbycni/${cniId}`;
      const apiUrl2 = `http://telecom.pni.dj/r1/DJ/GOV/10002/si_fix/fix/numero/${cniId}`;

      // Show the spinner
      spinner.style.display = "block";

      // Set up authentication headers or certificates as required
      const headers = {
        "X-Road-Client": "DJ/GOV/10002/SI_telecom",
      };

      try {
        const response = await fetch(apiUrl, {
          method: "GET",
          headers: headers,
        });

        if (response.status === 200) {
          console.log(response.headers.get("content-type"));

          const contentType = response.headers.get("content-type");

          if (contentType && contentType.includes("application/json")) {
            jsonData = await response.json();

            const stringfiedJSON = JSON.stringify(jsonData, null, 4);
            const parsedData = JSON.parse(stringfiedJSON);

            // Hide the spinner when the response is received
            spinner.style.display = "none";
            alertdiv.style.display = "none";
            /* jsondiv.style.display = "block";
            jsondiv.textContent = stringfiedJSON;  
            console.log(parsedData[0].C1);  */

            const ipnom = document.getElementById("nom");
            const ipdate_naissance = document.getElementById("date_naissance");
            const iplieu_naissance = document.getElementById("lieu_naissance");
            const ipnom_mere = document.getElementById("nom_mere");
            const ipprofession = document.getElementById("profession");
            const ipsexe = document.getElementById("sexe");
            const ipdate_emission = document.getElementById("date_emission");
            const ipdate_expiration =
              document.getElementById("date_expiration");
            const ipadresse = document.getElementById("adresse");
            const ipnncni = document.getElementById("ncni");

            var nom =
              parsedData[0].C4 +
              " " +
              parsedData[0].C5 +
              " " +
              parsedData[0].C6;
            var date_naissance = parsedData[0].C7;
            var lieu_naissance = parsedData[0].C8;
            var nom_mere = parsedData[0].C10 + " " + parsedData[0].C11;
            var profession = "";
            var sexe = parsedData[0].C9;
            var date_emission = "";
            var date_expiration = "";
            var adresse = parsedData[0].C12;
            var ncni = parsedData[0].C1;

            // Extract year, month, and day from the input string
            const year = date_naissance.substring(0, 4);
            const month = date_naissance.substring(4, 6);
            const day = date_naissance.substring(6, 8);

            // Create a JavaScript Date object with the extracted values
            const date = new Date(`${year}-${month}-${day}`);

            // Format the date as "dd-mm-yyyy"
            const formattedDate = `${date
              .getDate()
              .toString()
              .padStart(2, "0")}-${(date.getMonth() + 1)
              .toString()
              .padStart(2, "0")}-${date.getFullYear()}`;

            ipnom.value = nom;
            ipdate_naissance.value = formattedDate;
            iplieu_naissance.value = lieu_naissance;

            ipnom_mere.value = nom_mere;
            ipprofession.value = profession;
            ipsexe.value = sexe;
            ipdate_emission.value = date_emission;
            ipdate_expiration.value = date_expiration;
            ipadresse.value = adresse;
            ipnncni.value = ncni;

            resultdiv.style.display = "block";
            alertdiv.style.display = "none";
          } else if (contentType && contentType.includes("text/html")) {
            const htmlContent = await response.text();
            spinner.style.display = "none";
            jsondiv.style.display = "none";
            alertdiv.style.display = "block";
            alertdiv.innerHTML = htmlContent;
          } else {
            /* resultdiv.style.display = "none";
            alertdiv.innerHTML = "Error ";
            alertdiv.style.display = "block";
            console.log(response.status);
            console.log(response); */
          }
        }
      } catch (error) {
        console.log("Error ", error);

        // Hide the spinner in case of an error
        spinner.style.display = "none";
      }
    });

  loadButton.addEventListener("click", function () {
    var formData = {};

    // Get the values of each input field and store them in the object
    formData.nom = document.getElementById("nom").value;
    formData.nom_mere = document.getElementById("nom_mere").value;
    formData.date_naissance = document.getElementById("date_naissance").value;
    formData.lieu_naissance = document.getElementById("lieu_naissance").value;
    formData.date_emission = document.getElementById("date_emission").value;
    formData.date_expiration = document.getElementById("date_expiration").value;
    formData.profession = document.getElementById("profession").value;
    formData.adresse = document.getElementById("adresse").value;
    formData.sexe = document.getElementById("sexe").value;
    formData.ncni = document.getElementById("ncni").value;

    // Convert the JavaScript object to a JSON string
    var fData = JSON.stringify(formData);

    // Display the JSON data (you can customize this part)
    //console.log(formData);
    if (fData) {
      // Envoyer les données au content script
      chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        chrome.tabs.sendMessage(tabs[0].id, {
          action: "loadData",
          data: fData,
        });
      });
    }
  });
});
