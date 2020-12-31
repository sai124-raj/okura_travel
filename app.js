const menuList = 'snippet/main_list.html';
const cityHome = 'snippet/city_home.html';
const cityPage = 'snippet/city_page.html';
const Awayflights = ['Tokyo','Melbourne','Singapore','New York','Dubai','Rio de Janeiro'];
const cities = ["Budapest","Braga","Paris","Monte Isola","Vienna","Poznan","Málaga","Geneva","Rijeka","Rome"];

// document loaded
document.addEventListener('DOMContentLoaded', addList)


const insertHTML = function (snippet, wheretoInsert) {
  document.querySelector(wheretoInsert).innerHTML = snippet;
}

const insertProperty = function (strig, propName, propValue) {
  let propToReplace = '{{' + propName + '}}';
  strig = strig.replace(new RegExp(propToReplace, 'g'), propValue);
  return strig
}


function EasyHTTP() {
  this.http = new XMLHttpRequest()
}

EasyHTTP.prototype.get = function (url, isJson) {
  let ed = this;
  return new Promise(function (resolve, reject) {
    ed.http.open('GET', url, true)
    let self = ed;
    ed.http.onload = function () {
      if (self.http.status == 200 && self.http.readyState == 4) {
        if (isJson == true) {
          let data = JSON.parse(self.http.responseText);
          resolve(data)
        } else {
          resolve(self.http.responseText);
        }

      } else {
        reject('errror found !')
      }
    }
    ed.http.send()
  })
}

function insertHomeList(data) {
  output = '';
  num = 0;
  Array.from(data).forEach(function (dataOne) {
    const http = new EasyHTTP();
    http.get(menuList, false).then(function (snippet) {
      let nameProp = dataOne.name
      let idProp = dataOne.id
      let descriptionProp = dataOne.description
      let imageProp = dataOne.image
      let bestProp = dataOne.best
      let flightProp = dataOne.flight
      num += 1
      snippet = insertProperty(snippet, "num", num)
      snippet = insertProperty(snippet, "name", nameProp)
      snippet = insertProperty(snippet, "id", idProp)
      snippet = insertProperty(snippet, "description", descriptionProp)
      snippet = insertProperty(snippet, "image", imageProp)
      snippet = insertProperty(snippet, "best", bestProp)
      snippet = insertProperty(snippet, "flight", flightProp)
      output += snippet;
      return output
    }).then(function (output) {
      insertHTML(output, "#city-container");
    })
  })
}

function addList() {
  const http = new EasyHTTP();
  http.get('o_json/joo.json', true).then(function (data) {
    insertHomeList(data)
  }).catch(function (ree) {
    console.log(ree);
  })
}

function insertCityHomeBackground(data){
  const http = new EasyHTTP();
  http.get(cityHome,false).then(function(snippet){
    let homeImageProp = data.homeImage;
    snippet = insertProperty(snippet,"home-image",homeImageProp)
    return snippet
  }).then(function(output){
    insertHTML(output,".bkg");
  })
}

function insertCityHotel(hotels){
  houtput = '';
  Array.from(hotels).forEach(function(hotel){
    const http = new EasyHTTP();
    http.get('snippet/city_hotel.html',false).then(function(snippet){
      snippet = insertProperty(snippet,"hotel-image",hotel.hotelImage)
      snippet = insertProperty(snippet,"hotel-name",hotel.hotelName)
      snippet = insertProperty(snippet,"hotel-price",hotel.hotelPrice)
      snippet = insertProperty(snippet,"hotel-price",hotel.hotelPrice)
      snippet = insertProperty(snippet,"location",hotel.location)
      snippet = insertProperty(snippet,"ratings",hotel.ratings)
      snippet = insertProperty(snippet,"advantage",hotel.advantage)
      houtput+= snippet;
      return houtput
    }).then(function(output){
      insertHTML(output,'#hotel')
    })
  })
}

function insertCityFlight(data){
  foutput = '';

  for (let index = 0; index < Awayflights.length; index++) {
    const http = new EasyHTTP();
    http.get('snippet/city_flight.html',false).then(function(snippet){
      snippet = insertProperty(snippet,"flightImage",data.flightImage[index])
      snippet = insertProperty(snippet,"title",data.title)
      snippet = insertProperty(snippet,"away-flight",Awayflights[index])
      snippet = insertProperty(snippet,"flight-price",data.flights[index])
      index+=1
      foutput+= snippet;
      return foutput
    }).then(function(output){
      insertHTML(output,'#flight')
    })
    
  }
}

function insertCityPage(data){
  const http = new EasyHTTP();
  http.get(cityPage,false).then(function(snippet){
    snippet = insertProperty(snippet,"title",data.title);
    snippet = insertProperty(snippet,"homeIcon",data.homeIcon);
    snippet = insertProperty(snippet,"home-link",data.homeLink);
    snippet = insertProperty(snippet,"facebook-link",data.facebookLink);
    snippet = insertProperty(snippet,"instagram-link",data.instagramLink);
    snippet = insertProperty(snippet,"youtube-link",data.youtubeLink);
    snippet = insertProperty(snippet,"twitter-link",data.twitterLink);
    snippet = insertProperty(snippet,"description",data.description);
    snippet = insertProperty(snippet,"embedded-map",data.embeddedMap);
    insertCityHotel(data.hotel)
    insertCityFlight(data)
    return snippet
  }).then(function(output){
    insertHTML(output,'#main-container')
  })
}

loadCityPage = function (theValue) {
  let city=theValue.parentElement.id
  let url = 'o_json/'+city+'.json';
  const http = new EasyHTTP();
  http.get(url,true).then(function (data){
    insertCityHomeBackground(data);
    insertCityPage(data);
  })
}
