// CSS for scroll snapping
const scrollContainer = document.querySelector('#container');
const snapSections = document.querySelectorAll('.section');

let currentSectionIndex = 0; // Variable to store current section index

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      currentSectionIndex = Array.from(snapSections).indexOf(entry.target);
      console.log('Current Section:', currentSectionIndex);


      //toggle snapping
      if (currentSectionIndex > 0) {
        container = document.getElementById("container");
        container.style.setProperty('scroll-snap-type', 'y');
      } else {
        container = document.getElementById("container");
        console.log(container)
        container.style.setProperty('scroll-snap-type', 'y mandatory');
      }
      //Show menu bar
      const logo = document.querySelector('.logo');
      const topBar = document.querySelector('.top-bar');
      if (currentSectionIndex > 0) {
        // When scrolled past half the page
        topBar.style.top = '0';
        logo.style.opacity = '0';
        logo.style.transform = 'scale(0.5)';
      } else {
        topBar.style.top = '-100vh';
        logo.style.opacity = '1';
        logo.style.transform = 'scale(1)';
      }
    }
  });
}, {
  root: scrollContainer,
  threshold: 0.5 // Trigger when 50% of section is visible
});

// Observe all sections
snapSections.forEach(section => observer.observe(section));


//MENU
document.getElementById('menuButton').addEventListener('click', function () {
  //this.classList.toggle('active');
  const chapterMenu = document.getElementById('chapter-menu');
  const menuButton = document.getElementById('menuButton');
  chapterMenu.classList.toggle('is-active');
  menuButton.classList.toggle('active');

  //close when chapter selected
  chapterMenu.addEventListener('click', (event) => {
    if (event.target.tagName === 'A') {
      chapterMenu.classList.remove('is-active');
      menuButton.classList.remove('active');
    }
  });
});



//smooth scrolling
function scrollToId() {
  container = document.getElementById("container");
  container.style.setProperty('scroll-snap-type', 'y');
  document.querySelector('#Contact').scrollIntoView({
    behavior: 'smooth',
    block: 'start'
  });

};

//KOntakt - setting
function CheckColors(val) {
  var settingText = document.getElementById('setting-text');
  var settingLabel = document.getElementById('setting-label');
  if (val == '') {
    settingText.style.display = 'none';
    settingLabel.style.display = 'block';
  } else if (val == 'Sonstiges') {
    settingText.style.display = 'block';
    settingLabel.style.display = 'none';
  } else {
    settingText.style.display = 'none';
    settingLabel.style.display = 'none';
  }

}


//KOMNTAKT-PAGE
(function () {
  "use strict";
  /*
   * Form Validation
   */

  // Fetch all the forms we want to apply custom validation styles to
  const forms = document.querySelectorAll(".needs-validation");
  const result = document.getElementById("result");
  // Loop over them and prevent submission
  Array.prototype.slice.call(forms).forEach(function (form) {
    form.addEventListener(
      "submit",
      function (event) {



        //CHECKS VALIDITY
        if (!form.checkValidity()) {
          event.preventDefault();
          event.stopPropagation();

          form.querySelectorAll(":invalid")[0].focus();
        } else {
          /*
           * Form Submission using fetch()
           */

          const formData = new FormData(form);
          console.log(formData)

          //MAKE EMAIL PRETTY
          const name = formData.get('name');
          const date = formData.get('date');
          const setting = formData.get('setting');
          const settingText = formData.get('setting-text');

          const subject = `Request for ${setting + settingText} for the ${date}`;

          const from_name = name;
          //EMAIL METADATA
          formData.append('from_name', from_name);
          formData.append('subject', subject);


          event.preventDefault();
          event.stopPropagation();
          const object = {};
          formData.forEach((value, key) => {
            object[key] = value;
          });
          const json = JSON.stringify(object);
          result.innerHTML = "Please wait...";

          fetch("https://api.web3forms.com/submit", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Accept: "application/json"
            },
            body: json
          })
            .then(async (response) => {
              let json = await response.json();
              if (response.status == 200) {
                result.innerHTML = json.message;
                result.classList.remove("text-gray-500");
                result.classList.add("text-green-500");
              } else {
                console.log(response);
                result.innerHTML = json.message;
                result.classList.remove("text-gray-500");
                result.classList.add("text-red-500");
              }
            })
            .catch((error) => {
              console.log(error);
              result.innerHTML = "Something went wrong!";
            })
            .then(function () {
              form.reset();
              form.classList.remove("was-validated");
              result.innerHTML = "SUCCESSSSSS";
              setTimeout(() => {
                result.style.display = "none";
              }, 5000);
            });
        }
        form.classList.add("was-validated");
      },
      false
    );
  });
})();
