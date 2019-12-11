let uplaodButton = document.getElementById("uploadImage");
let selectImage = document.getElementById("selectImage");
let form = document.forms['upload'];
let imageDatabase = "images"
let tagsDatabase = "tags"
let uploadedImages = document.getElementById("uploadedImages");

let usernameCloudant = "b3e64e71-3522-484d-9bf6-7e7595cba22c-bluemix"
let passwordCloudant = "a98e26011f29480df796b247c94790debd4ea40c5138e6dec34bec83c62f0b19"

const cloudantURL = new URL("https://" + usernameCloudant + ":" + passwordCloudant + "@" + usernameCloudant + ".cloudant.com");
const apiUrl = 'https://609a4395.us-south.apigw.appdomain.cloud/guestbook';



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
    // loadImageToBrowser(cloudantDocument, selectImage.files[0]);
    uploadToCloudant(cloudantDocument);
  }
}

function loadImageToBrowser(doc, imageToLoad) {
  var fileReader = new FileReader();
  var image = new Image();

  var imageSection = document.createElement('div');
  var imageHolder = document.createElement('div');
  imageSection.className = "imageSection"
  imageHolder.className = "imageHolder"
  fileReader.readAsDataURL(imageToLoad);
  fileReader.onload = function (readerEvent) {
    image.src = readerEvent.target.result
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

        alert("Uploaded the Image Successfully to Cloudant");

        // get tags from cloudant
        // add 1.5s delay to give time for serverless function to execute
        setTimeout(function () {
          // getDocumentWithId(data.id, doc, 0);
        }, 1500);

      },
      error: function (jqXHR, textStatus, errorThrown) {
        console.log(errorThrown);
        console.log(textStatus);
        console.log(jqXHR);
      }
  });
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
  var jqxhr = $.getJSON( "sofa.json", function(value) {
        console.log( "success" );
         var i = 0;
         let markup = ``
         let container = document.getElementById("suggestions-class")
         // alert("Created container")
         if (value.length%3==1){
          value.pop();
         }
         elif (value.length%3==2){
          value.pop();
          value.pop();
         }
         for(let i = 0; i < value.length; i++){
            // alert(i)
            let markup = `<div class="row" id="suggestions-class">
          <div class="col-lg-3 mx-auto text-center product-listing">
            <a href="http://google.com">
              <div class="row">
                <div class="col-lg-8">
                  <img class="picture-listing" src=`+value[i].Image+`alt="Smiley face">
                </div>
                <div class="col-lg-4 text-center">
                  <div class="center-text-class">
                    <p>`+value[i].Brand+`</p> 
                    <p>`+value[i].Seller+`</p>
                  </div>
                </div>


              </div>
            </a>
          </div>
          <div class="col-lg-3 mx-auto text-center product-listing">
            <a href="http://google.com">
              <div class="row">
                <div class="col-lg-8">
                  <img class="picture-listing" src=`+value[i+1].Image+`alt="Smiley face">
                </div>
                <div class="col-lg-4 text-center">
                  <div class="center-text-class">
                    <p>`+value[i+1].Brand+`</p> 
                    <p>`+value[i+1].Seller+`</p>
                  </div>
                </div>


              </div>
            </a>
          </div>
          <div class="col-lg-3 mx-auto text-center product-listing">
            <a href="http://google.com">
              <div class="row">
                <div class="col-lg-8">
                  <img class="picture-listing" src=`+value[i+2].Image+`alt="Smiley face">
                </div>
                <div class="col-lg-4 text-center">
                  <div class="center-text-class">
                    <p>`+value[i+2].Brand+`</p> 
                    <p>`+value[i+2].Seller+`</p>
                  </div>
                </div>


              </div>
            </a>
          </div>
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

form.onsubmit = function() {
  
  uploadImage()

    // $.ajax({
    //   type: 'GET',
    //   url: `${apiUrl}/entries`,
    //   dataType: 'json',
    //   success: function(data){
    //     alert("retrieved")
    //   }
    // });
  recommendation()

  return false;
}
