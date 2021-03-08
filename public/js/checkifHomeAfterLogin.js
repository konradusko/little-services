function checkWhichRoute(url){
    const nav = document.querySelector('.nav_container');
    const footer = document.querySelector('.footer_container');
    const content_container = document.querySelector('.content_container');
    if(url == '/home'){
        nav.style.display = 'none';
        footer.style.display = 'none';
        content_container.style.height = 100 +'vh';
    }
}