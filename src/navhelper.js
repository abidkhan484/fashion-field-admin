export function activeNav(navigation) {
    return (window.location.href.indexOf(navigation) !== -1) ? true : false;
}