import './css/styles.css';
import { fetchCountries } from './fetchCountries';
import debounce from 'lodash.debounce';
import {Notify} from 'notiflix';

const DEBOUNCE_DELAY = 300;

const refs = {
    inputSearchBox: document.querySelector('input#search-box'),
    countryList: document.querySelector('.country-list'),
    countryInfo: document.querySelector('.country-info'),
}

const { inputSearchBox, countryList, countryInfo } = refs;

const trimmedInputValue = () => inputSearchBox.value.trim();

const searchCountry = () => {
    if (trimmedInputValue() === '') {
        clearHtml();
        return Notify.info('Put a country name');
    } else {
        (fetchCountries(trimmedInputValue()))
        .then(countries =>
            renderCountries(countries))
                .catch(() => {
                    return Notify.failure('Oops, there is no country with that name');
            })
    }
}

const clearListContent = () => {
    countryList.innerHTML = '';
    countryList.classList.add('hiddenStyle');
}

const clearInfoContent = () => {
    countryInfo.innerHTML = '';
    countryInfo.classList.add('hiddenStyle');
}

const clearHtml = () => {
    clearListContent();
    clearInfoContent();
}

function renderCountries(countries) {
    if (countries.length > 10) {
        clearHtml();
        return Notify.info('Too many matches found. Please enter a more specific name.')
    };

    if (countries.length > 1) {
        const markupFewCountries = countries.map(({ name, flags }) => {
            return `<li class='country-list__item'><img src="${flags.svg}" width="50"/>${name.official}</li>`;
        }).join('');
        clearInfoContent();
        countryList.classList.remove('hiddenStyle');
        countryList.innerHTML = markupFewCountries;
    }

    if (countries.length === 1) {
        const markupOneCountry = countries.map(({ name, flags, capital, population, languages }) => {
            return `<li class='country-info__item'><img src="${flags.svg}" width="90" />${name.official}</li>
            <p class='country-info__paragraph-info'> Capital: <span>${capital}</span></p>
            <p class='country-info__paragraph-info'> Population: <span>${population}</span></p>
            <p class='country-info__paragraph-info'> Languages: <span>${Object.values(languages).join(', ')}</span></p>`;
        }).join('');
    clearListContent();
    countryInfo.classList.remove('hiddenStyle');
    countryInfo.innerHTML = markupOneCountry;
    }
}

inputSearchBox.addEventListener('input', debounce(searchCountry, DEBOUNCE_DELAY));