const axios = require('axios')
const cheerio = require('cheerio')
const { pins } = require("./pin.js");

async function pindl(url) {
  try {
    const { data } = await axios.get('https://www.expertsphp.com/download.php', {
      params: { url },
      headers: { 'User-Agent': 'Mozilla/5.0' }
    })
    const $ = cheerio.load(data)
    let result = []
    $('table tbody tr').each((i, el) => {
      let url = $(el).find('td a').attr('href')
      if (url && url.includes('pinimg')) result.push(url)
    })
    return result[0]
  } catch {
    throw 'Link error / bukan link pinterest'
  }
}

async function ytdl(url, type = 'mp4') {
  try {
    const { data } = await axios.get(`https://api.ryzendesu.vip/api/downloader/ytmp4?url=${url}`)
    if (!data.url) throw 'Gagal fetch'
    return {
      title: data.title,
      thumb: data.thumbnail,
      url: type === 'mp3'? data.audio : data.video,
      size: data.size
    }
  } catch {
    const { data } = await axios.post('https://www.y2mate.com/mates/analyzeV2/ajax', new URLSearchParams({
      k_query: url,
      k_page: 'home',
      hl: 'en',
      q_auto: 0
    }))
    const $ = cheerio.load(data.result)
    let link = type === 'mp3'
     ? $('#mp3 table tbody tr').eq(0).find('td').eq(2).find('a').attr('href')
      : $('#mp4 table tbody tr').eq(0).find('td').eq(2).find('a').attr('href')
    return { url: link, title: $('div.caption h3').text() }
  }
}

async function translate(text, to = 'id', from = 'autodetect') {
  let { data } = await axios.get(`https://api.mymemory.translated.net/get`, {
    params: { q: text, langpair: `${from}|${to}` }
  })
  if (data.responseStatus !== 200) throw data.responseDetails
  return {
    text: data.responseData.translatedText,
    from: data.responseData.detectedLanguage || from
  }
}

module.exports = {
  pins,
  pindl,
  ytdl,
  translate
       }
