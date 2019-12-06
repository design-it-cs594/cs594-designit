let uplaodButton = document.getElementById("uploadImage");
let selectImage = document.getElementById("selectImage");
let form = document.forms['upload'];
let imageDatabase = "images"
let tagsDatabase = "tags"
let uploadedImages = document.getElementById("uploadedImages");

let usernameCloudant = "b3e64e71-3522-484d-9bf6-7e7595cba22c-bluemix"
let passwordCloudant = "a98e26011f29480df796b247c94790debd4ea40c5138e6dec34bec83c62f0b19"

const cloudantURL = new URL("https://" + usernameCloudant + ":" + passwordCloudant + "@" + usernameCloudant + ".cloudant.com");

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

        alert("Uploaded the Image Successfully in Cloudant");

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
  alert("in recommendation");
  var jqxhr = $.getJSON( "sofa.json", function(data) {
        // console.log( "success" );
         var i = 0;
        $.each(data, function(key, value){
            console.log(value[i].Brand);
            console.log(value[i].Price);
            console.log(value[i].Seller);
            console.log(value[i].Image);
            console.log(value[i].ProductLink);

            // html += '<div class="dcell">';
            // html += '<img src='+value[i].Image+'/>';
            // html += '<label for="'+value[i].Image+'">'+value[i].Price+':</label>';
            // // html += '<input type="text" id="'+value.product+'" name="'+value.product+'" value="0" stock="'+value.stock+'" price="'+value.price+'" required>';
            // html += '</div>';
            i = i + 1;
        });
    // $('#yourContainerId').html(html);
    
      //   for(let i = 0; i < data.length; i++){
      //     console.log( data[i].ProductLink );
      //     displayProducts(data[i]);
      //   }
      // })
      //   .done(function() {
      //     console.log( "done - success" );
      //   })
      //   .fail(function() {
      //     console.log( "error" );
      //               console.log("Error loading json file"); 
      //   })
      //   .always(function() {
      //     console.log( "complete" );
        });
  // var obj = JSON.parse("sofa.json");
  // console.log(obj)
  // $.ajax({
  //   type: "GET",
  //   url: "recommendation_engine.php",
  //   success: function(data){
  //     // alert("kfdvbkh")
  //     alert(data)
  //   },
  //     error: function (jqXHR, textStatus, errorThrown) {
  //         console.log(errorThrown);
  //         console.log(textStatus);
  //         console.log(jqXHR);
  //         alert('errorThrown');
  //     }
  //   var data;
    // $.ajax({
    //     type: "GET",
    //     url: "js-tutorials.com_sample_file.csv",
    //     dataType: "text",
    //     success: function(response)
    //     {
    //         data = $.csv.toArrays(response);
    //         generateHtmlTable(data);
    //     }
    // });

    // $.getJSON('sofa.json', function(data) {
    //     //do stuff with your data here
    //     // console.log(typeof data)
    //     // console.log(typeof data.length) 
    //     var obj = JSON.parse(data, function (key, value) {
    //         console.log(key)
    //     });
    //     // alert(data[0])
    //     // var mydata = JSON.parse(data);
    //     // alert(mydata.length);
    //     // for(var i = 0;i < data.length; i++)
    //     // {
    //     //   alert(data[i])
    //     //     // console.log(data[i])
    //     //     // div.innerHTML = div.innerHTML + "<p class='inner' id="+i+">"+ mydata[i].name +"</p>" + "<br>";
    //     // }
    // });
}

form.onsubmit = function() {
  alert("Hi THis is an ALERT");
  recommendation()
  // uploadImage()
  return false;
}

// getDocumentWithId("0724dabd80bc2102e8e5e1f9fdbb3a60",0);
