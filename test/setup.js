import { JSDOM } from 'jsdom'

export default function setup(markup){
    const dom = (new JSDOM(markup || '<!DOCTYPE html><html><head></head><body></body></html>'))
    global.window = dom.window;
    global.document = dom.window.document;
}



