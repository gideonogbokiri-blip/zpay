function createButton(
    label: string,
    className: string,
    onClick: (event: MouseEvent) => void
): HTMLButtonElement {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = `btn ${className}`;
    button.textContent = label;
    button.addEventListener('click', onClick);
    return button;
}

document.addEventListener('DOMContentLoaded', () => {
    const app = document.getElementById('app');

    if (!app) {
        throw new Error('App root element not found');
    }

    const container = document.createElement('div');
    container.className = 'container';

    const title = document.createElement('h1');
    title.className = 'title';
    title.innerHTML = 'Welcome to <span>Zpay</span>';

    const tagline = document.createElement('p');
    tagline.className = 'tagline';
    tagline.textContent = 'Money, Simplified';

    const loginButton = createButton('Login', 'btn-login', () => {
        alert('Login clicked');
    });

    const createAccountButton = createButton('Create Account', 'btn-create', () => {
        alert('Create Account clicked');
    });

    const terms = document.createElement('p');
    terms.className = 'terms';
    terms.innerHTML = 'By continuing, you agree to our <a href="#">Terms and Conditions</a>';

    container.append(title, tagline, loginButton, createAccountButton, terms);
    app.appendChild(container);
});