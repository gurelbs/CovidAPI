// create & get Element
const $ = x => document.querySelector(x)
const $1 = x => document.createElement(x)
    // api
const countriesAPI = `https://api.codetabs.com/v1/proxy?quest=https://restcountries.herokuapp.com/api/v1`
const covidAPI = `https://corona-api.com/countries`
    // global vars
const listOfCountriesByRegion = {}
const btnsControl = $('.btns-control')
const btnWrap = $('.btns')
const countriesWrap = $('.countries')
const statusBtnWrap = $('.status-btn')
const confirmedBtn = $('.confirmed')
const countries = $('.countries')
const chartWrap = $('.chart-wrap')
const countriesDataWrap = $('.countries-data')
const ctx = document.getElementById('myChart').getContext('2d')
let myChart = '';
// fetch
const fetchAllcountries = () => {
        fetch(countriesAPI)
            .then(res => res.json())
            .then(data => {
                listOfCountriesByRegion['world'] = []
                data.forEach(countries => {
                    listOfCountriesByRegion['world'].push(countries.name.common)
                    if (!listOfCountriesByRegion[countries.region]) {
                        listOfCountriesByRegion[countries.region] = [countries.region]
                    } else {
                        listOfCountriesByRegion[countries.region].push({
                            name: countries.name.common,
                            code: countries.cca2
                        })
                    }
                });
                delete listOfCountriesByRegion['']
                createRegionBtns()

            })
    }
    // logCountries
    // const logCountriesByRegion = () => console.log(listOfCountriesByRegion)
fetchAllcountries()
    // create button
const createRegionBtns = () => {
    Object.entries(listOfCountriesByRegion).forEach(e => {
        let btn = $1('button')
        let region = e[0].toLowerCase()
        btn.classList.add('btn', region)
        btn.innerHTML = e[0]
        btnWrap.appendChild(btn)
    })
}
const createCountriesNames = e => {
    if (e.target.innerHTML === 'world') {
        listOfCountriesByRegion[e.target.innerHTML].forEach(e => {
            let countriesLink = $1('a')
            let countriesLinkWrap = $1('div')
            countriesLink.href = '#'
            countriesLink.innerHTML = ` ${e} `
            countriesLinkWrap.appendChild(countriesLink)
            countriesWrap.appendChild(countriesLinkWrap)
        })
    } else {
        if (listOfCountriesByRegion[e.target.innerHTML] !== undefined) {
            listOfCountriesByRegion[e.target.innerHTML].forEach(e => {
                if (e.name !== undefined) {
                    let countriesLink = $1('a')
                    let countriesLinkWrap = $1('div')
                    countriesLink.href = '#'
                    countriesLink.innerHTML = ` ${e.name} `
                    countriesLinkWrap.appendChild(countriesLink)
                    countriesWrap.appendChild(countriesLinkWrap)
                }
            })
        }
    }
}
countriesDataWrap.classList.add('unvisible')
const handleClickByRegion = e => {
    countriesDataWrap.classList.add('unvisible')
    chartWrap.classList.remove('unvisible')
    if (!e.target.classList.contains('btns')) {
        btnWrap.childNodes.forEach(btn => {
            if (!btn.classList.contains('selected-btn')) {
                e.target.classList.add('selected-btn')
            } else {
                btn.classList.remove('selected-btn')
                e.target.classList.add('selected-btn')
            }
        })
        statusBtnWrap.childNodes.forEach(statusBtn => {
            statusBtn.classList.remove('selected-btn')
        })
        const statusBtns = () => {
            let statusName = ['confirmed', 'recovered', 'critical', 'deaths']
            for (let i = 0; i < statusName.length; i++) {
                let btn = $1('button')
                btn.classList.add(statusName[i])
                btn.textContent = statusName[i]
                statusBtnWrap.insertAdjacentElement('afterbegin', btn)
            }

        }
        if (countriesWrap.textContent === '') {
            statusBtnWrap.textContent = ''
            createCountriesNames(e)
            statusBtns()
            createChart(e)
        } else {
            countriesWrap.innerHTML = ''
            createCountriesNames(e)
            myChart.destroy()
            createChart(e)
        }
    }
}

btnWrap.addEventListener('click', handleClickByRegion)

// fetch CovidAPI
let covidStatusPerCountry = []
const fetchCovidApi = () => {
    fetch(covidAPI)
        .then(res => res.json())
        .then(covid => {
            covid.data.forEach(countries => {
                covidStatusPerCountry.push({
                    name: countries.name,
                    code: countries.code,
                    confirmed: countries.latest_data.confirmed,
                    recovered: countries.latest_data.recovered,
                    critical: countries.latest_data.critical,
                    deaths: countries.latest_data.deaths,
                    newCases: countries.today.confirmed,
                    newDeaths: countries.today.deaths,
                })
            })
            console.log(covidStatusPerCountry);
        })
}
fetchCovidApi()

const createChart = e => {
    myChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: [],
            datasets: [{
                label: `covid data for ${e.target.textContent}`,
                data: [],
                backgroundColor: handleBGColor,
                borderColor: handleBGColor,
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                yAxes: [{
                    ticks: {
                        beginAtZero: true
                    }
                }]
            }
        }
    });
}

const handleBGColor = () => {
    const randomColor = () => Math.floor(Math.random() * 255)
    const arrOfColors = []
    for (let i = 0; i < dynamicData.length; i++) {
        arrOfColors.push(`rgba(${randomColor()},${randomColor()},${randomColor()},0.5)`)
    }
    return arrOfColors
}

let dynamicData = []
let dynamicLabel = []
const handleData = e => {
    chartWrap.classList.remove('unvisible')
    countriesDataWrap.classList.add('unvisible')
    let chartData = myChart.data.datasets[0].data
    let chartLabel = myChart.data.labels
    dynamicData = []
    dynamicLabel = []
    chartData.splice(0, chartData.length)
    chartLabel.splice(0, chartLabel.length)
    myChart.update();
    if (!e.target.classList.contains('status-btn')) {
        statusBtnWrap.childNodes.forEach(statusBtn => {
            if (!statusBtn.classList.contains('selected-btn')) {
                e.target.classList.add('selected-btn')
            } else {
                statusBtn.classList.remove('selected-btn')
                e.target.classList.add('selected-btn')
            }
        })
    }
    btnWrap.childNodes.forEach(btn => {
        if (btn.classList.contains('selected-btn')) {
            console.log(e.target.textContent, btn.textContent);
            if (btn.textContent === 'world') {
                listOfCountriesByRegion[btn.textContent].forEach(country => {
                    covidStatusPerCountry.forEach(covidData => {
                        if (country === covidData.name) {
                            dynamicLabel.push(country)
                            dynamicData.push(covidData[e.target.textContent])
                        }
                    })
                })
            } else {
                listOfCountriesByRegion[btn.textContent].forEach(country => {
                    covidStatusPerCountry.forEach(covidData => {
                        if (country.name === covidData.name) {
                            dynamicLabel.push(country.name)
                            dynamicData.push(covidData[e.target.textContent])
                        }
                    })
                })
            }
        }
    })

    chartLabel.push(...dynamicLabel)
    chartData.push(...dynamicData)
    myChart.update();
}

statusBtnWrap.addEventListener('click', e => handleData(e))


const handleCountriesData = e => {
    let country = e.target.textContent.trim()
    covidStatusPerCountry.forEach(countryData => {
        if (country === countryData.name) {
            chartWrap.classList.add('unvisible')
            countriesDataWrap.classList.remove('unvisible')
            countriesDataWrap.textContent = ''
            Object.entries(countryData).forEach(dataEl => {
                let dataDiv = $1('div')
                dataDiv.classList.add('country-data')
                dataDiv.textContent = dataEl.join(': ')
                countriesDataWrap.appendChild(dataDiv)
            })
        }
    })
}

countries.addEventListener('click', e => handleCountriesData(e))