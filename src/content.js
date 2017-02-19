document.addEventListener('DOMContentLoaded', () => {
    chrome.storage.sync.get('emag-only-is-active', storageCallback);

    function storageCallback(data) {
        var isEmagOnlyEnabled = data['emag-only-is-active'] != false;

        var status = document.createElement('span');
        status.textContent = 'only';
        status.className = 'emag-only-status ' + (isEmagOnlyEnabled ? 'on' : 'off');

        status.addEventListener('click', function() {
            isEmagOnlyEnabled = !isEmagOnlyEnabled;
            chrome.storage.sync.set({ 'emag-only-is-active': isEmagOnlyEnabled });
            window.location.href = isEmagOnlyEnabled ? window.location.href : window.location.href.replace('/vendor/emag', '');
        });

        var catalog_page_logo = document.getElementsByClassName('emg-fluid-header-left-col')[0];
        if (catalog_page_logo != undefined) {
            catalog_page_logo.appendChild(status);
        }

        var product_page_logo = document.getElementsByClassName('navbar-branding')[0];
        if (product_page_logo != undefined) {
            product_page_logo.appendChild(status);
        }
    }
});
