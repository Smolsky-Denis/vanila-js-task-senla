export function infoBox(type, description, count) {
    const infoBoxElement = document.createElement('div');
    infoBoxElement.classList.add('infoBox');

    const container = document.createElement('div');

    const typeElement = document.createElement('div');
    typeElement.classList.add('type');
    typeElement.innerHTML = type;

    const descriptionElement = document.createElement('div');
    descriptionElement.classList.add('description');
    descriptionElement.innerHTML = description;

    const countElement = document.createElement('div');
    countElement.classList.add('count');
    countElement.innerHTML = count;

    container.appendChild(typeElement);
    container.appendChild(descriptionElement);

    infoBoxElement.appendChild(container);
    infoBoxElement.appendChild(countElement);

    return infoBoxElement;
}