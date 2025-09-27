// esm/scrapers/user.js
import { registerScraper } from '../dotfa-core.js';

function getUser(){  return window._userdata || window.userdata || null; }
function getLang(){  return window._lang || null; }
function getBoard(){ return window._board || null; }

/**
 * Devuelve datos globales del foro listos para plantillas doT.
 * Estructura: { user, lang, board }
 */
function scrapeUser(){
  return {
    user : getUser(),
    lang : getLang(),
    board: getBoard()
  };
}

registerScraper('user', scrapeUser);
export default scrapeUser;
