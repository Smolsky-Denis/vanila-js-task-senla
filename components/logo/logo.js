export function logo() {
    const logo = document.createElement('img');

    logo.classList.add('logo');
    logo.src = './icons/senla.svg';

    return logo
}