var searchform = document.querySelector("#searchbar") 
var searchanswer = document.querySelector("#searchoutput") 
var searchbtn = document.querySelector("#searchbutton") 
var tomorrowsweather = document.querySelector("#forecast") ;
var Citydata = document.querySelector("#MainCity") ; 
var container1 = document.querySelector("#container") ; 
var cities = [] 

var loadCities = function() {
  var citiesLoaded = localStorage.getItem("cities")
  if(!citiesLoaded) {
      return false;
  }
  
  citiesLoaded = JSON.parse(citiesLoaded);
  
  for (var i=0; i < citiesLoaded.length; i++) {
      createbutton(citiesLoaded[i])
      cities.push(citiesLoaded[i])  // whats the point of this line??
  }
}

var saveCities = function() {
  localStorage.setItem("cities", JSON.stringify(cities));
} 


var searchfunction = function(event) {  
    
  event.preventDefault();  
  

  var city = searchanswer.value.trim(); 

 
  
  if (city) { 
    
    getcitydata(city);

    tomorrowsweather.textcontent = "";  
    forecast.replaceChildren(); 

    searchanswer.value = ""; 
    
  } else {
    alert("Please enter a real city");
  }
}; 

var getcitydata = function (city) { 
  console.log(city);
    var apiURL =  "https://api.openweathermap.org/data/2.5/weather?q=" + city + ",USA&APPID=cfe0b2658aec5af16bf8115cfd986eca";

 // make a get request to url
 fetch(apiURL)
 .then(function(response) {
   // request was successful
   if (response.ok) {
     response.json().then(function(data) {
      weatherdash(data, city); // why does this break everything?? 
       
     }); 
     

     var prevSearch = cities.includes(city)
     if (!prevSearch) {
         cities.push(city)
         saveCities()
         createbutton(city); 
     }
     

   } else {
     alert("Error: " + response.statusText);
   }
 })
 .catch(function(error) {
   alert("Unable to connect to GitHub");
 });
}; 




var weatherdash = function (data, city) { 
   console.log(city)  
  

var CityTemp = document.querySelector("#MainTemp") ;
var CityWind = document.querySelector("#MainWind") ;
var CityHumidity = document.querySelector("#MainHumidity") ;

  
Citydata.innerHTML = city; 
CityTemp.innerHTML = (((data.main.temp) - 273.15) * 9/5 + 32).toFixed(1) ;  

CityWind.innerHTML = data.wind.deg; 
CityHumidity.innerHTML = data.main.humidity; 

let lon = data.coord.lon ;
let lat = data.coord.lat ;


  fivedayforecast (lat, lon)
} 

var fivedayforecast = function (lat, lon) { 
    

    var apiURL =  "https://api.openweathermap.org/data/2.5/onecall?lat=" + lat + "&lon=" + lon + "&exclude=hourly,minutely&appid=cfe0b2658aec5af16bf8115cfd986eca";

// make a get request to url
fetch(apiURL)
.then(function(response) {
  // request was successful
  if (response.ok) {
    
    response.json().then(function(data) {
      
      
      var CityMainUV = document.querySelector("#MainUV") ; 
      CityMainUV.innerHTML = data.current.uvi;  
      CityMainUV.classList.add("UVindexgreen")
      
      if (data.current.uvi > 2) { 
          CityMainUV.classList.add("UVindexyellow")
      } 

      else if (data.current.uvi > 7) { 
        CityMainUV.classList.add("UVindexred")

      } 

      finalforecast(data); 
    }); 

    

  } else {
    alert("Error: " + response.statusText);
  }
})
.catch(function(error) {
  alert("Unable to connect to GitHub");
});
}; 


var finalforecast = function (data) {
  console.log(data) 



 for (var i = 1; i < 6; i++) { 
     var daily = data.daily[i]
      

     var seconddiv = document.createElement("div"); 
     seconddiv.classList = "height2"; 

     var title = document.createElement("h3"); 
     

     var mili = daily.dt * 1000; 
     var robodate = new Date(mili); 
     var humandate = robodate.toLocaleString("en-US", {weekday: "long"})
     
    
     title.innerHTML = humandate;
     seconddiv.appendChild(title); 

     var temptext = document.createElement("p") 
     temptext.innerHTML = "Temp: " + (((daily.temp.day) - 273.15) * 9/5 + 32).toFixed(1) ;

     seconddiv.appendChild(temptext); 

     var windtext = document.createElement("p") 
     windtext.innerHTML = "Wind: " + daily.wind_deg
     seconddiv.appendChild(windtext); 

     var humiditytext = document.createElement("p") 
     humiditytext.innerHTML = "Humidity: " + daily.humidity
     seconddiv.appendChild(humiditytext); 

     tomorrowsweather.appendChild(seconddiv)
 }  

} 



var createbutton = function (city) { 
  
  console.log(city); 
  var line1 = document.querySelector("#line") ;
  line1.classList.remove("hide"); 

  var button = document.createElement("button") 
   button.classList.add("UI"); 
   button.textContent = city; 
   
 
   container1.appendChild(button);  
   button.addEventListener("click",  function() {  
    forecast.replaceChildren();
        getcitydata(city);
   });
  
}

 
// get weather icons 
// update issues 

//load previously searched cities on page load 
loadCities()

searchbtn.addEventListener("click", searchfunction);