let uplaodButton = document.getElementById("uploadImage");
let selectImage = document.getElementById("selectImage");
let form = document.forms['upload'];
let editForm = document.forms['editForm'];
console.log(editForm);
let imageDatabase = "images"
let tagsDatabase = "tags"
let uploadedImages = document.getElementById("uploadedImages");
let uploadText = document.getElementById("uploadText");
let CVtext = document.getElementById("CVtext");

let editPreferences = document.getElementById("editPreferences");
let suggestionsSection = document.getElementById("suggestionsSection");

let usernameCloudant = "b3e64e71-3522-484d-9bf6-7e7595cba22c-bluemix"
let passwordCloudant = "a98e26011f29480df796b247c94790debd4ea40c5138e6dec34bec83c62f0b19"


const cloudantURL = new URL("https://" + usernameCloudant + ":" + passwordCloudant + "@" + usernameCloudant + ".cloudant.com");

const apiUrl = 'https://609a4395.us-south.apigw.appdomain.cloud/guestbook';
const cvURL = 'https://aeea40b2.us-south.apigw.appdomain.cloud/furniture';

const CVData = {
  get() {
    // return $.ajax({
    //   type: 'GET',
    //   url: `${cvURL}/furniture/cv`,
    //   dataType: 'json',
    //   contentType: "application/json"
    // });

    
            CVtext.innerHTML += "<p>The CV component detected Sofa, Table, Chair, Table lamp</p>"


        console.log(editPreferences);
        editPreferences.classList.remove("d-none");

        editPreferences.classList.add("d-block");
  }
}
var modal = document.getElementById('id01');

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
}


function uploadImage() {
  var image = selectImage.files[0];
 
  // name is .name, type is .type
  var fileReader = new FileReader();
  fileReader.readAsDataURL(selectImage.files[0]);
  fileReader.onload = function (readerEvent) {
    // base64 encoded
    // console.log(readerEvent.target.result.split(',')[1])
    var cloudantDocument = {
      "name": image.name,
      "_attachments": {}
    };
    var attachment = {}
    attachment.content_type = image.type
    attachment.data = readerEvent.target.result.split(',')[1]
    cloudantDocument._attachments.image = attachment
    console.log(cloudantDocument);
    loadImageToBrowser(cloudantDocument, selectImage.files[0]);
    // uploadToCloudant(cloudantDocument);
  }
}

function loadImageToBrowser(doc, imageToLoad) {

  console.log(uploadText);
  uploadText.classList.remove("d-none");

  uploadText.classList.add("d-block");


  var fileReader = new FileReader();
  var image = new Image();

  var imageSection = document.createElement('div');
  var imageHolder = document.createElement('div');
  imageSection.className = "imageSection"
  imageHolder.className = "imageHolder"
  // imageHolder.setAttribute('style', "display:inline;");
  fileReader.readAsDataURL(imageToLoad);
  fileReader.onload = function (readerEvent) {
    image.src = readerEvent.target.result;
    image.style.height = '50%';
    image.style.width = '50%';
    image.className = "uploadedImage";
    imageHolder.appendChild(image);
    imageSection.appendChild(imageHolder);
    uploadedImages.prepend(imageSection);
    uploadToCloudant(doc);
  }
}

function uploadToCloudant(doc) {
  console.log(doc)
  console.log(cloudantURL.origin)
  $.ajax({
      url: cloudantURL.origin + "/" + imageDatabase,
      type: "POST",
      data: JSON.stringify(doc),
      headers: {
        "Authorization": "Basic " + btoa(cloudantURL.username + ":" + cloudantURL.password)
      },
      dataType: 'json',
      contentType: 'application/json',
      success: function (data) {

        // alert("Uploaded the Image Successfully to Cloudant");

    //     var imageSection = document.createElement('div');
    //     var imageHolder = document.createElement('p');
    //     imageSection.className = "detectedCVDiv";
    //     imageHolder.className = "detectedCVP";
    //     src = "The CV component detected Sofa, Table, Chair, Table lamp";
    //     // image.className = "CVdetectedText";
    //     imageHolder.appendChild(src);
    //     imageSection.appendChild(imageHolder);
    // CVtext.prepend(imageSection);

        // get tags from cloudant
        // add 1.5s delay to give time for serverless function to execute
        setTimeout(function () {
          alert("getCVComponent ....")
          getCVComponent();
          // getDocumentWithId(data.id, doc, 0);
        }, 15000);

      },
      error: function (jqXHR, textStatus, errorThrown) {
        console.log(errorThrown);
        console.log(textStatus);
        console.log(jqXHR);
      }
  });
}

function getCVComponent() {
  // body...
  alert("before CVData get....")

  CVData.get().done(function (result) {
    // body...
    alert("CVData ....")
    if (!result) {
      return;
    }

    console.log(result);
  });
  alert("after CVData get....")

}
function getDocumentWithId(id, dom, tries) {
  $.ajax({
      url: cloudantURL.origin + "/" + tagsDatabase + "/" + id,
      type: "GET",
      headers: {
        "Authorization": "Basic " + btoa(cloudantURL.username + ":" + cloudantURL.password)
      },
      success: function (data) {
        displayTags(data, dom)
      },
      error: function (jqXHR, textStatus, errorThrown) {
        console.log(errorThrown);
        console.log(textStatus);
        console.log(jqXHR);
        if (tries+1 < 20) {

          // try again in 3 seconds
          setTimeout(function() {
            getDocumentWithId(id, dom, tries+1)
          },3000);
        } else {
          console.log("No document found after 20 tries")
        }
      }
  });
}

function displayTags(data, dom) {
  dom.id = data._id;
  var tags = document.createElement('div');
  tags.className = "imageLabels";
  for (var index in data.watsonResults[0].classes) {
    var tag = document.createElement('div');
    tag.className = "imageLabel";
    tag.innerHTML = data.watsonResults[0].classes[index].class
    tags.appendChild(tag);
  }
  dom.appendChild(tags)
}

function recommendation(){
  // alert("in recommendation");
  console.log(suggestionsSection);
  suggestionsSection.classList.remove("d-none");
  suggestionsSection.classList.add("d-block");
  
  var jqxhr = $.getJSON( "sofa.json", function(value) {
        console.log( "success" );
         var i = 0;
         let markup = ``
         let container = document.getElementById("suggestions-class")
         // alert("Created container")
         if (value.length%2==1){
          value.pop();
         }
         for(let i = 0; i < value.length; i++){
            // alert(i)
            let markup = `<div class="row text-center row-0-gutter">
          <div class="col-lg-6 ">
          <a href="`+value[i].ProductLink+`" target="_blank">
            <div class="ot-portfolio-item ">
              <figure class="effect-bubba">
                <img src=`+value[i].Image+` alt="img02" class="img-responsive" style="width: 100%; height: "></img>
                <figcaption>
                  <h2>`+value[i].Brand+`</h2>
                  <p> Brought to you by `+value[i].Seller+`</p>
                </figcaption>
              </figure>
            </div>
            </a>
          </div>
          <br />
          
          <div class="col-lg-6 ">
          <a href="`+value[i+1].ProductLink+`" target="_blank">
            <div class="ot-portfolio-item">
              <figure class="effect-bubba" style="border-radius: 30px;">
                <img src=`+value[i+1].Image+` alt="img02" class="img-responsive" style="width: 100%;"/>
                
                <figcaption>
                  <h2>`+value[i+1].Brand+`</h2>
                  <p> Brought to you by `+value[i+1].Seller+`</p>
                </figcaption>
              </figure>
            </div>
          </div>
          </a>
        </div> <br />`
        i = i+1
        container.innerHTML += markup


        console.log(value[i].Brand);
        console.log(value[i].Price);
        console.log(value[i].Seller);
        console.log(value[i].Image);
        console.log(value[i].ProductLink);

        }
        });
}

// editForm.onclick = function() {
//     recommendation();
//     return false;
// }

form.onsubmit = function() {
  
  // Showing all d-none classes

  uploadImage()

    // $.ajax({
    //   type: 'GET',
    //   url: `${apiUrl}/entries`,
    //   dataType: 'json',
    //   success: function(data){
    //     alert("retrieved")
    //   }
    // });
recommendation();
  return false;
}
