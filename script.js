document.addEventListener('DOMContentLoaded', () => {
  var cityInput = document.querySelector('.city-input');
  var searchBtn = document.querySelector('.search-btn');
  var weatherInfoSection = document.querySelector('.weather-info');
  var notFoundSection = document.querySelector('.not-found');
  var searchCitySection = document.querySelector('.search-city');
  var apiKey = 'ee3f694b9eb8f0ba113c33f32c461852';

  var counteyTxt = document.querySelector('.countey-txt');
  var tempTxt = document.querySelector('.temp-txt');
  var conditionTxt = document.querySelector('.condition-txt');
  var humidityValueTxt = document.querySelector('.humidity-value-txt');
  var windValueTxt =document.querySelector('.wind-value-txt');
  var weatherSummarImg = document.querySelector('.weather-summar-img');
  var counteyDateTxt = document.querySelector('.countey-date-txt');

  // updateWeatherInfo関数をイベントリスナーの外に移動
  async function updateWeatherInfo(city) {
    var weatherDate = await getFetchDate('weather', city);
    if(weatherDate.cod != 200){
      showDisplaySection(notFoundSection);
      return;
    }
    showDisplaySection(weatherInfoSection); //天気情報セクションを表示
    console.log(weatherDate);

    const {
      name,
      main: { temp, feels_like, humidity, pressure },
      weather: [{ description, icon }],
      wind: { speed },
    } = weatherDate;

    counteyTxt.textContent = name;
    tempTxt.textContent = `${Math.round(temp)}°C`;
    conditionTxt.textContent = description;
    humidityValueTxt.textContent = `${humidity}%`;
    windValueTxt.textContent = `${speed}M/s`;

    counteyDateTxt.textContent = getCurrentDate();
    weatherSummarImg.src = `assets/${getWeatherIcon(weatherDate.weather[0].id)}`;
  
    
  }


  function showDisplaySection(section){
    // すべてのセクションを非表示
    [weatherInfoSection, searchCitySection, notFoundSection]
      .forEach(element => {
        if (element) {
          element.style.display = 'none';
        }
      });
    // 指定されたセクションを表示
    if (section) {
      section.style.display = 'flex';
    }
  }

  // showDisplaySection関数もイベントリスナーの外に移動
  searchBtn.addEventListener('click', () => {
    if(cityInput.value.trim() != ''){
      updateWeatherInfo(cityInput.value);
      cityInput.value = '';
      cityInput.blur();
    }
  });

  cityInput.addEventListener('keydown', (e) => {
    if(e.key == 'Enter' && cityInput.value.trim() != ''){
      updateWeatherInfo(cityInput.value);
      cityInput.value = '';
      cityInput.blur();
    }
  });
  async function getFetchDate(endPoint, city) {
    var apiUrl = `https://api.openweathermap.org/data/2.5/${endPoint}?q=${city}&appid=${apiKey}&units=metric`;
    var response = await fetch(apiUrl);
    return response.json();
  }

  //5日間
  async function updateWeatherInfo(city) {
    var weatherDate = await getFetchDate('weather', city);
    if(weatherDate.cod != 200){
      showDisplaySection(notFoundSection);
      return;
    }
    
    // 現在の天気情報を更新
    showDisplaySection(weatherInfoSection);
    
    const {
      name,
      main: { temp, feels_like, humidity, pressure },
      weather: [{ description, icon }],
      wind: { speed },
    } = weatherDate;
  
    counteyTxt.textContent = name;
    tempTxt.textContent = `${Math.round(temp)}°C`;
    conditionTxt.textContent = description;
    humidityValueTxt.textContent = `${humidity}%`;
    windValueTxt.textContent = `${speed}M/s`;
  
    counteyDateTxt.textContent = getCurrentDate();
    weatherSummarImg.src = `assets/${getWeatherIcon(weatherDate.weather[0].id)}`;
  
    // 天気予報データを取得
    var forecastData = await getFetchDate('forecast', city);
    updateForecastInfo(forecastData.list);
  }
  
  // 天気予報を更新する関数を追加
  function updateForecastInfo(forecastList) {
    const forecastContainer = document.querySelector('.forecast-items-container');
    forecastContainer.innerHTML = '';
  
    // 24時間ごとのデータを取得（4日分）
    for(let i = 0; i < forecastList.length; i += 8) {
      const forecast = forecastList[i];
      const forecastDate = new Date(forecast.dt * 1000);
      const dayTemp = Math.round(forecast.main.temp);
      const weatherId = forecast.weather[0].id;
  
      const forecastItem = document.createElement('div');
      forecastItem.classList.add('forecast-item');
      forecastItem.innerHTML = `
        <h5 class="forecast-item-date regular-txt">${forecastDate.toLocaleDateString('ja-JP', {month: 'short', day: '2-digit'})}</h5>
        <img src="assets/${getWeatherIcon(weatherId)}" class="forecast-item-img">
        <h5 class="forecast-item-temp">${dayTemp}°C</h5>`;
      forecastContainer.appendChild(forecastItem);
    }
  }

  function getWeatherIcon(id){
    if(id <= 232) return 'thunderstorm.png';
    if(id <= 321) return 'Drizzle.png';
    if(id <= 531) return 'Rain.png';
    if(id <= 622) return 'Snow.png';
    if(id <= 781) return 'Tornado.png';
    if(id <= 800) return 'Clear.png';
    else return 'clouds.png'
  }


  function getCurrentDate(){
    var getCurrentDate = new Date();
    var options = {
      weekeday: 'short',
      day: '2-digit',
      month: 'short',
    }
    return getCurrentDate.toLocaleDateString('jp-JP', options);
  }
});










