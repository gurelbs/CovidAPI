const countriesApi = `https://cors-proxy.htmldriven.com/?url=https://restcountries.herokuapp.com/api/v1`

const fetchAllcountries = () => {
    fetch(countriesApi)
        .then(res => res.json())
        .then(data => console.log(data))
}

fetchAllcountries()