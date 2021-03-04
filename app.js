// create & get Element
const $ = x => document.querySelector(x)
const $1 = x => document.createElement(x)
    // api
const countriesAPI = `https://api.codetabs.com/v1/proxy?quest=https://restcountries.herokuapp.com/api/v1`
const covidAPI = `https://corona-api.com/countries`
    // global vars
const listOfCountriesByRegion = {}
const btnWrap = $('.btns')
const countriesWrap = $('.countries')
const statusBtnWrap = $('.status-btn')
const ctx = document.getElementById('myChart')
let myChart = '';
console.log(myChart === '');
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


const handleClickByRegion = e => {
    const statusBtns = () => {
        let statusName = ['confirmed', 'recovered', 'critical', 'deaths']
        for (let i = 0; i < statusName.length; i++) {
            let btn = $1('button')
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
        myChart.destroy();
        createChart(e)
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

const handleChartLabels = e => {
    const labels = []
    if (e.target.innerHTML === 'world') {
        listOfCountriesByRegion[e.target.innerHTML].forEach(countries => {
            covidStatusPerCountry.forEach(e => {
                if (e.name === countries) {
                    labels.push(countries)
                }
            });

        })
    } else {
        listOfCountriesByRegion[e.target.innerHTML].forEach(countries => {
            covidStatusPerCountry.forEach(e => {
                if (e.name === countries.name) {
                    labels.push(countries.name)
                }
            });
        })
    }
    return labels
}

const createChart = e => {
    myChart = new Chart(ctx.getContext('2d'), {
        type: 'bar',
        data: {
            labels: handleChartLabels(e),
            datasets: [{
                label: `covid data for ${e.target.textContent}`,
                data: handleData(e),
                backgroundColor: [...handleBackgroundColor(handleChartLabels(e).length)],
                borderColor: [...handleBackgroundColor(handleChartLabels(e).length)],
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

const randomColor = () => Math.floor(Math.random() * 255)
const handleBackgroundColor = x => {
    let arrOfColors = []
    for (let i = 0; i < x; i++) {
        arrOfColors.push(`rgba(${randomColor()},${randomColor()},${randomColor()},0.5)`)
    }
    return arrOfColors
}
const handleData = x => {
    let handleNumbersData = []
    handleChartLabels(x).forEach(name => {
        covidStatusPerCountry.forEach(el => {
            if (name === el.name) {
                handleNumbersData.push(el.confirmed)
            }
        })
    })
    return handleNumbersData
}