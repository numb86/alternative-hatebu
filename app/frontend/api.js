const API_BASE_URL = '/api/v1';
const LOGIN_API_URL = '/login';
const LOGOUT_API_URL = '/logout';
const FETCH_BOOKMARK_COUNT_API_URL = '/bookmarks/count';
const FETCH_BOOKMARK_LIST_API_URL = '/bookmarks';
const FETCH_TAG_LIST_API_URL = '/tags';
const IMPORT_BOOKMARK_LIST_API_URL = '/bookmarks/import';

async function apiRequest({method, url, data}) {
  const csrfToken = document.getElementsByName('csrf-token')[0].content;

  const fetchUrl = `${window.location.origin}${API_BASE_URL}${url}`;
  let fetchOptions = {
    method,
    headers: {
      'X-CSRF-Token': csrfToken,
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
  };
  if (data && method === 'post') {
    fetchOptions = {...fetchOptions, ...{body: JSON.stringify(data)}};
  }

  const response = await fetch(fetchUrl, fetchOptions);

  const {status} = response;
  const json = await response.json();

  if (status === 401) throw new Error(401);
  if (status >= 400 && status < 600) throw new Error(json.message);
  return json;
}

/**
 *
 * @param {string} userName ユーザーネーム
 * @param {string} password パスワード
 * @return {Object} {result: 'success login.'}
 */
export async function loginApi(userName, password) {
  const result = await apiRequest({
    method: 'post',
    url: LOGIN_API_URL,
    data: {name: userName, password},
  });
  return result;
}

/**
 *
 * @return {Object} {result: 'success logout.'}
 */
export async function logoutApi() {
  const result = await apiRequest({
    method: 'post',
    url: LOGOUT_API_URL,
  });
  return result;
}

/**
 * ブックマーク数を取得する
 * @return {Object} {result: ユーザーが登録したブックマーク総数}
 */
export async function fetchBookmarkCountApi() {
  const result = await apiRequest({
    method: 'get',
    url: FETCH_BOOKMARK_COUNT_API_URL,
  });
  return result;
}

/**
 * タグ一覧を取得する
 * @return {Object} {result: タグの配列}
 */
export async function fetchTagListApi() {
  const result = await apiRequest({
    method: 'get',
    url: FETCH_TAG_LIST_API_URL,
  });
  return result;
}

/**
 * ブックマークを取得する
 * @param {Object} searchCondition {keyword, tags}
 * @param {number} page 対象となるページ数
 * @return {Object} {displayList, totalNumber, page: {total, current}}
 */
export async function fetchBookmarkListApi(searchCondition = {}, page = 1) {
  const {keyword, tags} = searchCondition;
  let url = `${FETCH_BOOKMARK_LIST_API_URL}?page=${page}`;
  if (keyword) url += `&q=${keyword}`;
  if (tags.length > 0) url += `&tags=${tags}`;

  const result = await apiRequest({
    method: 'get',
    url,
  });
  return result;
}

/**
 * ブックマークをDBに保存する
 * @param {Array} bookmarkList DBに保存するブックマークのリスト
 * @return {Object} {result: 'success import.'}
 */
export async function importBookmarkListApi(bookmarkList) {
  await apiRequest({
    method: 'post',
    url: IMPORT_BOOKMARK_LIST_API_URL,
    data: {bookmarkList},
  });
  return {result: 'success'};
}
