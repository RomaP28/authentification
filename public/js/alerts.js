export const hideAlert = () => {
    const el = document.querySelector('.alert');
    el.className = 'alert';
    el.innerHTML = '';
}


export const showAlert = (type, msg) => {
    const el = document.querySelector('.alert');
    el.innerHTML = msg;
    el.classList.add(`${type}`);
    el.classList.add('show');
    window.setTimeout(hideAlert, 4500);
}
