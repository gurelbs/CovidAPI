// create & get Element
const $ = x => document.querySelector(x)
const $1 = x => document.createElement(x)
    // api
const countriesApi = `https://api.codetabs.com/v1/proxy?quest=https://restcountries.herokuapp.com/api/v1`
    // global vars
const listOfCountriesByRegion = {}
const btnWrap = $('.btns')
const countriesWrap = $('.countries')
    // fetch
const fetchAllcountries = () => {
        fetch(countriesApi)
            .then(res => res.json())
            .then(data => {
                data.forEach(countries => {
                    !listOfCountriesByRegion[countries.region] ?
                        listOfCountriesByRegion[countries.region] = [countries.region] :
                        listOfCountriesByRegion[countries.region].push({
                            name: countries.name.common,
                            code: countries.cca2
                        })
                });
                listOfCountriesByRegion['world'] = listOfCountriesByRegion['']
                delete listOfCountriesByRegion['']
                logCountriesByRegion()
                createRegionBtns()
            })
    }
    // logCountries
const logCountriesByRegion = () => console.log(listOfCountriesByRegion)
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
    listOfCountriesByRegion[e.target.innerHTML].forEach(e => {
        if (e.name !== undefined) {
            let countriesLink = $1('a')
            countriesLink.href = '#'
            countriesLink.innerHTML = ` ${e.name} `
            countriesWrap.appendChild(countriesLink)
        }
    })
}
const handleClickByRegion = e => {
    if (countriesWrap.textContent === '') {
        createCountriesNames(e)
    } else {
        countriesWrap.innerHTML = ''
        createCountriesNames(e)
    }
}

btnWrap.addEventListener('click', handleClickByRegion)