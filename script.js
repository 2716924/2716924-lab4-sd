async function getData(name) {
    let url = `https://restcountries.com/v3.1/name/${name}`;
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error('Country not found. Please check the name and try again.');
        }

        const json = await response.json();
        if (json.length === 0) {
            throw new Error('Country not found. Please check the name and try again.');
        }
        
        const country = json[0];

        const capital = country.capital ? country.capital[0] : "No capital info";
        const population = country.population || "No population info";
        const region = country.region || "No region info";
        const flag = country.flags.png || country.flags[0] || "";
        const borders = country.borders || [];

        displayCountryInfo(capital, population, region, flag);
        displayBorders(borders);

    } catch (error) {
        displayErrorMessage(error.message);
    }
}

function displayCountryInfo(capital, population, region, flag) {
    const countryInfoSection = document.getElementById('country-info');
    countryInfoSection.innerHTML = '';

    const capitalElement = document.createElement('p');
    capitalElement.textContent = `Capital: ${capital}`;
    const populationElement = document.createElement('p');
    populationElement.textContent = `Population: ${population}`;
    const regionElement = document.createElement('p');
    regionElement.textContent = `Region: ${region}`;
    const flagElement = document.createElement('img');
    flagElement.src = flag;
    flagElement.alt = 'Country Flag';
    flagElement.style.width = '100px';

    countryInfoSection.appendChild(capitalElement);
    countryInfoSection.appendChild(populationElement);
    countryInfoSection.appendChild(regionElement);
    countryInfoSection.appendChild(flagElement);
}

function displayBorders(borders) {
    const borderingSection = document.getElementById('bordering-countries');
    borderingSection.innerHTML = '';

    const bordersHeading = document.createElement('h3');
    bordersHeading.textContent = 'Bordering Countries:';
    borderingSection.appendChild(bordersHeading);

    if (borders.length === 0) {
        borderingSection.textContent = 'No neighboring countries found.';
        return;
    }

    borders.forEach(async (border) => {
        let url = `https://restcountries.com/v3.1/alpha/${border}`;
        try {
            const response = await fetch(url);
            const borderCountry = await response.json();

            const borderName = borderCountry[0].name.common;
            const borderFlag = borderCountry[0].flags.png || borderCountry[0].flags[0];

            const borderElement = document.createElement('div');
            borderElement.classList.add('border-country');
            const borderInfo = document.createElement('p');
            borderInfo.textContent = `${borderName}`;
            const borderFlagElement = document.createElement('img');
            borderFlagElement.src = borderFlag;
            borderFlagElement.alt = `${borderName} Flag`;
            borderFlagElement.style.width = '50px';

            borderElement.appendChild(borderInfo);
            borderElement.appendChild(borderFlagElement);
            borderingSection.appendChild(borderElement);

        } catch (error) {
            console.error("Error fetching border country:", error);
        }
    });
}

// Function to display the error message
function displayErrorMessage(message) {
    const countryInfoSection = document.getElementById('country-info');
    countryInfoSection.innerHTML = `<p style="color: red;">${message}</p>`;
}
