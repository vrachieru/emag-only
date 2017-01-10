// ==UserScript==
// @name eMag only
// @version 1.0
// @description Filter out external vendors on eMag
// @author Victor Rachieru
// @match http*://emag.ro/*
// @grant none
// ==/UserScript==

var path_tokens = window.location.pathname.split('/')

function is_category() {
    return path_tokens.slice(-1)[0] == 'c'
}

function get_vendor_filter_index() {
  return path_tokens.indexOf('vendor')
}

function compute_vendor_filter_index() {
    return path_tokens.length - path_tokens.slice(-2)[0].startsWith('rating') ? 2 : 1
}

function emag_only() {
  if(!is_category()) {
    return;
  }

  vendor_filter_index = get_vendor_filter_index();

  if(vendor_filter_index != -1) {
    if (path_tokens[vendor_filter_index + 1] == 'emag') {
      return;
    }
    path_tokens[vendor_filter_index + 1] = 'emag';
  } else {
    path_tokens.splice(compute_vendor_filter_index(), 0, 'vendor', 'emag');
  }

  console.log(path_tokens.join('/'));
  window.open(path_tokens.join('/') + window.location.search, '_self');
}

emag_only()
