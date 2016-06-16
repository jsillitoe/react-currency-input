import jsdom from 'jsdom'

export default function setup(markup){


    global.document = jsdom.jsdom(markup || '<!doctype html><html><body></body></html>');
    global.window = document.defaultView;

}



