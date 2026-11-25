function navigateTo(viewName) {
    state.activeView = viewName;
    renderHeaderNav();
    updateQAAssistantContext();

    const container = document.getElementById('main-container');
    container.innerHTML = '';

    switch (viewName) {
        case 'catalog':
            renderCatalogView(container);
            break;
        case 'login':
            renderLoginView(container);
            break;
        case 'register':
            renderRegisterView(container);
            break;
        case 'forgot-password':
            renderForgotPasswordView(container);
            break;
        case 'cart':
            renderCartView(container);
            break;
        case 'checkout':
            renderCheckoutView(container);
            break;
        case 'orders':
            renderOrdersView(container);
            break;
        case 'profile':
            renderProfileView(container);
            break;
        default:
            renderCatalogView(container);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Global App Initialization Entry Point
document.addEventListener('DOMContentLoaded', () => {
    initApp();
});