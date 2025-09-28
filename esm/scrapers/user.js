// esm/scrapers/user.js
import { registerScraper } from '../dotfa-core.js';

function getUser(){  return window._userdata || window.userdata || {}; }
function getLang(){  return window._lang || null; }
function getBoard(){ return window._board || null; }

function num(v, d=0){ const n = Number(v); return Number.isFinite(n) ? n : d; }

function scrapeUser(){
  const u = getUser();

  // Campos base que ya tienes en _userdata
  const user_id           = num(u.user_id, null);
  const session_logged_in = !!u.session_logged_in;    // 1 cuando logueado en tu dump
  const username          = u.username || null;
  const avatar_link       = u.avatar_link || null;

  // Roles (FA típico: 1 = admin, 2 = mod)
  const lvl        = String(u.user_level ?? '').trim();
  const is_admin   = lvl === '1' || u.is_admin === true;
  const is_mod     = lvl === '2' || u.is_mod === true;

  // PMs no leídos: en tu foro es user_nb_privmsg
  const unread_pms = num(u.user_nb_privmsg ?? u.unread_privmsg ?? u.unread_pms ?? u.pms_unread, 0);

  // Flag de login robusto
  const is_logged_in = session_logged_in || (!!user_id && user_id !== -1);

  // Grupos (si algún día los añades)
  const groups = Array.isArray(u.groups) ? u.groups : [];

  return {
    user: {
      // espejo por si necesitas todo lo original
      ...u,
      // normalizado y seguro para plantillas
      user_id,
      username,
      avatar_link,
      is_logged_in,
      is_admin,
      is_mod,
      unread_pms,
      groups
    },
    lang : getLang(),   // tienes _lang cargado
    board: getBoard()   // tienes _board cargado
  };
}

registerScraper('user', scrapeUser);
export default scrapeUser;
