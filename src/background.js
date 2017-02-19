var isEmagOnlyEnabled;

chrome.storage.sync.get("emag-only-is-active", function (data) {
    isEmagOnlyEnabled = data['emag-only-is-active'] != false;
});

chrome.storage.onChanged.addListener(function(changes, area) {
    if (area == 'sync' && 'emag-only-is-active' in changes) {
        isEmagOnlyEnabled = changes['emag-only-is-active'].newValue;
    }
});

chrome.webRequest.onBeforeRequest.addListener(function (request) {
    if (!isEmagOnlyEnabled) {
        return;
    }

    var url = getLocation(request.url);
    var path_tokens = url.pathname.split('/');

    function getLocation(href) {
        var url = document.createElement('a');
        url.href = href;
        return url;
    }

    function is_page_filterable_by_vendor() {
        return ['label', 'search'].indexOf(path_tokens[1]) != -1 ||
               ['all-products', 'c', 'listall'].indexOf(path_tokens[path_tokens.length - 1]) != -1;
    }

    function get_vendor_filter_index() {
        return path_tokens.indexOf('vendor')
    }

    function compute_vendor_filter_index() {
        return [/\/rating,star-[1-5]\//, /\/p[0-9]+\//]
          .map(function(pattern) { return pattern.test(request.url) ? 1 : 0 })
          .reduce(function(acc, val) { return acc - val }, path_tokens.length - 1);
    }

    if (!is_page_filterable_by_vendor()) {
        return;
    }

    vendor_filter_index = get_vendor_filter_index();

    if (vendor_filter_index != -1) {
        if (path_tokens[vendor_filter_index + 1] == 'emag') {
            return;
        }
        path_tokens[vendor_filter_index + 1] = 'emag';
    } else {
        path_tokens.splice(compute_vendor_filter_index(), 0, 'vendor', 'emag');
    }

    return { redirectUrl: url.href.replace(url.pathname, path_tokens.join('/')) }
}, { urls: ['<all_urls>'] }, ['blocking']);
