const wrapper = document.querySelector('.wrapper');
const inputPart = document.querySelector('.input-part');
const infoText = document.querySelector('.info-txt');
const inputField = document.querySelector('input');
const locationBtn = document.querySelector('button');
const wIcon = document.querySelector('.weather-part img');
const arrowBack = document.querySelector('header i');

inputField.addEventListener('keyup', e=>{
    if(e.key == "Enter" && inputField.value != ""){
        requestApi(inputField.value);
    }
});

locationBtn.addEventListener('click', ()=>{
    if(navigator.geolocation){  //if borwser supports geolocation api
        navigator.geolocation.getCurrentPosition(onSuccess, onError);
    } else {
        alert('Your browser does not support geolocation')
    }
});

function onSuccess(position){
    console.log(position);
    const {latitude, longitude} = position.coords;
    let api = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&appid=ab616fcc2a430a72a921ebf576001368`;
    fetchData(api);
}

function onError(error){
    infoText.innerText = error.message;
    infoText.classList.add('error')
}

function requestApi(city){
    let api = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=ab616fcc2a430a72a921ebf576001368`;
    fetchData(api);
}

function fetchData(api){
    fetch(api).then(response => response.json()).then(result =>weatherDetails(result));
    infoText.innerText = "Getting weather info..."
    infoText.classList.add('pending')
}

function weatherDetails(info){
    infoText.classList.replace('pending', 'error')
    if(info.cod == '404'){
        infoText.innerText = info.message
    } else {
        const city = info.name;
        const country = info.sys.country;
        const {description, id} = info.weather[0];
        const {feels_like, humidity, temp} = info.main;

        if(id == 800){
            wIcon.src = 'Weather Icons/clear.svg'
        } else if(id >= 200 && id <= 232){
            wIcon.src = 'Weather Icons/storm.svg'
        } else if(id >= 300 && id <= 321){
            wIcon.src = 'Weather Icons/rain.svg'
        } else if(id >= 600 && id <= 622){
            wIcon.src = 'Weather Icons/snow.svg'
        } else if(id >= 700 && id <= 781){
            wIcon.src = 'Weather Icons/haze.svg'
        } else if(id >= 801 && id <= 804){
            wIcon.src = 'Weather Icons/cloud.svg'
        }

        wrapper.querySelector('.temp .numb').innerText = Math.floor(temp);
        wrapper.querySelector('.weather').innerText = description;
        wrapper.querySelector('.location span').innerText = `${city}, ${country}`;
        wrapper.querySelector('.temp .numb-2').innerText = Math.floor(feels_like);
        wrapper.querySelector('.humidity span').innerText = `${humidity}%`;

        infoText.classList.remove('pending', 'error')
        wrapper.classList.add('active')
    }
    console.log(info);
}

arrowBack.addEventListener('click', ()=>{
    wrapper.classList.remove('active')
});