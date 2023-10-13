document.addEventListener('DOMContentLoaded', () => {
    const contentDiv = document.getElementById('content');

    const routes: { [key: string]: string } = {
        'home': '<h1>Welcome Home</h1>',
        'about': '<h1>About Us</h1>'
    };

    function render(route: string) {
        contentDiv.innerHTML = routes[route] || '<h1>Not Found</h1>';
    }

    document.getElementById('home')!.addEventListener('click', () => render('home'));
    document.getElementById('about')!.addEventListener('click', () => render('about'));

    render('home');  // Default content
});

