// STARMUSICS — frontend prototype; production authorization requires a trusted backend

const DATA = window.STARMUSICS_Catalog.getLegacyData();
const Catalog = window.STARMUSICS_Catalog;
const AudioSourceAdapter = window.STARMUSICS_AudioSourceAdapter;

// Localization and dedicated editorial detail sheets.
const I18N={
 en:{Home:'Home',Explore:'Explore',Library:'Library',Playlists:'Playlists',Artists:'Artists',Albums:'Albums',Genres:'Genres',Discussions:'Discussions','Liked Songs':'Liked Songs','Recently Played':'Recently Played','Your Playlists':'Your Playlists','Saved Albums':'Saved Albums',Featured:'Featured','Featured Playlists':'Featured Playlists','New Releases':'New Releases','Popular Artists':'Popular Artists','View discussions':'View discussions','Your Library':'Your Library',Topics:'Topics','Choose a topic':'Choose a topic','Add to the conversation':'Add to the conversation','Post comment':'Post comment','Display name':'Display name',Biography:'Biography','Save profile':'Save profile','Your achievements':'Your achievements','Your playlists':'Your playlists','Interface language':'Interface language','Popular tracks':'Popular tracks','Related discovery':'Related discovery'},
 ru:{Home:'Главная',Explore:'Обзор',Library:'Медиатека',Playlists:'Плейлисты',Artists:'Артисты',Albums:'Альбомы',Genres:'Жанры',Discussions:'Обсуждения','Liked Songs':'Любимые треки','Recently Played':'Недавно прослушано','Your Playlists':'Ваши плейлисты','Saved Albums':'Сохранённые альбомы',Featured:'Рекомендуем','Featured Playlists':'Подборки редакции','New Releases':'Новые релизы','Popular Artists':'Популярные артисты','View discussions':'Все обсуждения','Your Library':'Ваша медиатека',Topics:'Темы','Choose a topic':'Выберите тему','Add to the conversation':'Присоединиться к разговору','Post comment':'Опубликовать комментарий','Display name':'Отображаемое имя',Biography:'О себе','Save profile':'Сохранить профиль','Your achievements':'Ваши достижения','Your playlists':'Ваши плейлисты','Interface language':'Язык интерфейса','Popular tracks':'Популярные треки','Related discovery':'Похожие находки'},
 fa:{Home:'خانه',Explore:'کاوش',Library:'کتابخانه',Playlists:'پلی‌لیست‌ها',Artists:'هنرمندان',Albums:'آلبوم‌ها',Genres:'سبک‌ها',Discussions:'گفت‌وگوها','Liked Songs':'آهنگ‌های پسندیده','Recently Played':'اخیراً پخش‌شده','Your Playlists':'پلی‌لیست‌های شما','Saved Albums':'آلبوم‌های ذخیره‌شده',Featured:'منتخب','Featured Playlists':'پلی‌لیست‌های منتخب','New Releases':'انتشارهای تازه','Popular Artists':'هنرمندان محبوب','View discussions':'مشاهده گفت‌وگوها','Your Library':'کتابخانه شما',Topics:'موضوع‌ها','Choose a topic':'یک موضوع انتخاب کنید','Add to the conversation':'به گفت‌وگو بپیوندید','Post comment':'ارسال دیدگاه','Display name':'نام نمایشی',Biography:'درباره شما','Save profile':'ذخیره پروفایل','Your achievements':'دستاوردهای شما','Your playlists':'پلی‌لیست‌های شما','Interface language':'زبان رابط کاربری','Popular tracks':'آهنگ‌های محبوب','Related discovery':'پیشنهادهای مرتبط'}
};
Object.assign(I18N.en, {
 'Your music':'Your music','Your achievements':'Your achievements','Your collection':'Your collection','Your playlists':'Your playlists',
 'Liked songs':'Liked songs','Recently played':'Recently played','Saved albums':'Saved albums','Return to previous player mode':'Return to previous player mode',
 'Expand player':'Expand player','Choose language':'Choose language','Your Library':'Your Library','Artists':'Artists','Albums':'Albums','Genres':'Genres',
 'Interface language':'Interface language','Dock':'Dock','Page':'Page','Mini':'Mini','Now Playing':'Now Playing','Play':'Play','Pause':'Pause',
 'Your personal collection, gathered here in one place.':'Your personal collection, gathered here in one place.','About us':'About us','The developer':'The developer','What we build':'What we build','Contact & notes':'Contact & notes'
});
Object.assign(I18N.ru, {
 'Your music':'Ваша музыка','Your achievements':'Ваши достижения','Your collection':'Ваша коллекция','Your playlists':'Ваши плейлисты',
 'Liked songs':'Любимые треки','Recently played':'Недавно прослушано','Saved albums':'Сохранённые альбомы','Return to previous player mode':'Вернуться к предыдущему режиму',
 'Expand player':'Развернуть плеер','Choose language':'Выбрать язык','Your Library':'Ваша медиатека','Artists':'Артисты','Albums':'Альбомы','Genres':'Жанры',
 'Interface language':'Язык интерфейса','Dock':'Панель','Page':'Страница','Mini':'Мини','Now Playing':'Сейчас играет','Play':'Играть','Pause':'Пауза',
 'Your personal collection, gathered here in one place.':'Ваша личная коллекция — всё в одном месте.','About us':'О нас','The developer':'Разработчик','What we build':'Что мы создаём','Contact & notes':'Контакты и заметки'
});
Object.assign(I18N.fa, {
 'Your music':'موسیقی شما','Your achievements':'دستاوردهای شما','Your collection':'مجموعه شما','Your playlists':'پلی‌لیست‌های شما',
 'Liked songs':'آهنگ‌های پسندیده','Recently played':'پخش‌های اخیر','Saved albums':'آلبوم‌های ذخیره‌شده','Return to previous player mode':'بازگشت به حالت قبلی پخش‌کننده',
 'Expand player':'باز کردن پخش‌کننده','Choose language':'انتخاب زبان','Your Library':'کتابخانه شما','Artists':'هنرمندان','Albums':'آلبوم‌ها','Genres':'سبک‌ها',
 'Interface language':'زبان رابط کاربری','Dock':'پایین صفحه','Page':'تمام‌صفحه','Mini':'کوچک','Now Playing':'در حال پخش','Play':'پخش','Pause':'مکث',
 'Your personal collection, gathered here in one place.':'مجموعه شخصی موسیقی شما، در یک جا.','About us':'درباره ما','The developer':'توسعه‌دهنده','What we build':'آنچه می‌سازیم','Contact & notes':'تماس و یادداشت‌ها'
});
const extraTranslations = {
 'The sound of a new generation.':['Звук нового поколения.','صدای نسل جدید.'],
 'Featured Playlists':['Подборки редакции','پلی‌لیست‌های منتخب'],
 'See all':['Все','مشاهده همه'],
 'New Releases':['Новые релизы','انتشارهای تازه'],
 'Popular Artists':['Популярные артисты','هنرمندان محبوب'],
 'Conversations worth having':['Разговоры, которые стоит вести','گفت‌وگوهای ارزشمند'],
 'Explore':['Обзор','کاوش'],
 'Discover new genres, moods, and scenes from around the world.':['Открывайте жанры, настроения и сцены со всего мира.','سبک‌ها، حال‌وهواها و جریان‌های موسیقی جهان را کشف کنید.'],
 'Trending Now':['В тренде','ترندهای امروز'],
 'Discussion':['Обсуждение','گفت‌وگو'],
 'New Discussion':['Новая тема','گفت‌وگوی جدید'],
 'Only the owner can create new topics.':['Создавать новые темы может только владелец.','فقط مدیر می‌تواند موضوع جدید ایجاد کند.'],
 'Music, with intention.':['Музыка со смыслом.','موسیقی، با معنا.'],
 'Your listening identity, library, and milestones.':['Ваш музыкальный вкус, коллекция и достижения.','هویت شنیداری، کتابخانه و دستاوردهای شما.'],
 'YOUR SPACE':['ВАШЕ ПРОСТРАНСТВО','فضای شما'],
 'YOUR MUSIC':['ВАША МУЗЫКА','موسیقی شما'],
 'MILESTONES':['ДОСТИЖЕНИЯ','دستاوردها'],
 'YOUR COLLECTION':['ВАША КОЛЛЕКЦИЯ','مجموعه شما'],
 'Earned by how you listen and curate. This section belongs to your profile.':['Достижения за прослушивание и подбор музыки. Они отображаются в профиле.','این دستاوردها از شنیدن و گردآوری موسیقی به دست می‌آیند و در پروفایل شما نمایش داده می‌شوند.'],
 'Choose a display name':['Выберите имя профиля','یک نام نمایشی انتخاب کنید'],
 'A little about your taste in music…':['Расскажите немного о своём музыкальном вкусе…','کمی از سلیقه موسیقی خود بگویید…'],
 'Display name':['Имя профиля','نام نمایشی'],
 'Biography':['О себе','زندگی‌نامه'],
 'Save profile':['Сохранить профиль','ذخیره پروفایل'],
 'Queue':['Очередь','صف پخش'],
 'Now playing':['Сейчас играет','در حال پخش'],
 'Next up':['Далее','آهنگ بعدی'],
 'LYRICS':['ТЕКСТ','متن ترانه'],
 'Share lyrics card':['Поделиться карточкой текста','اشتراک‌گذاری کارت متن'],
 'Lyrics haven’t been added for this track. Add authorized lyrics in the track data to display them here.':['Для этого трека пока нет текста. Добавьте разрешённый текст в данные трека.','متن مجاز این آهنگ هنوز اضافه نشده است. برای نمایش، متن دارای مجوز را در اطلاعات آهنگ قرار دهید.'],
 'Share original or licensed lyrics, or permitted excerpts with attribution.':['Публикуйте оригинальный или лицензированный текст либо разрешённые фрагменты с указанием автора.','فقط متن اصلی یا دارای مجوز، یا بخش‌های مجاز همراه با ذکر منبع را منتشر کنید.'],
 'Choose audio file':['Выбрать аудиофайл','انتخاب فایل صوتی'],
 'Play audio you have permission to use.':['Выбирайте аудио, на использование которого у вас есть разрешение.','فقط فایل صوتی‌ای را پخش کنید که اجازه استفاده از آن را دارید.'],
 'Recently Played':['Недавно прослушано','اخیراً پخش‌شده'],
 'Liked Songs':['Любимые треки','آهنگ‌های پسندیده'],
 'Saved Albums':['Сохранённые альбомы','آلبوم‌های ذخیره‌شده'],
 'Artists':['Артисты','هنرمندان'],
 'Albums':['Альбомы','آلبوم‌ها'],
 'Genres':['Жанры','سبک‌ها'],
 'Search artists, tracks, albums, lyrics...':['Поиск артистов, треков, альбомов и текстов...','جست‌وجوی هنرمند، آهنگ، آلبوم و متن ترانه...'],
 'Search artists, tracks, albums, lyrics...':['Поиск артистов, треков, альбомов и текстов...','جست‌وجوی هنرمند، آهنگ، آلبوم و متن ترانه...'],
 'Type to search tracks, artists & playlists':['Введите название трека, артиста или плейлиста','نام آهنگ، هنرمند یا پلی‌لیست را جست‌وجو کنید'],
 'No results found':['Ничего не найдено','نتیجه‌ای پیدا نشد'],
 'Save profile':['Сохранить профиль','ذخیره پروفایل'],
 'Related discovery':['Похожие находки','کشف‌های مرتبط'],
 'Popular tracks':['Популярные треки','آهنگ‌های محبوب'],
 'Featured':['Рекомендуем','منتخب'],
 'Create playlist':['Создать плейлист','ساخت پلی‌لیست'],
 'Your playlists':['Ваши плейлисты','پلی‌لیست‌های شما'],
 '＋ Create playlist':['＋ Создать плейлист','＋ ساخت پلی‌لیست'],
 'Owner':['Владелец','مدیر'],
 'STARMUSICS EDIT':['ВЫБОР STARMUSICS','منتخب STARMUSICS'],
 'A close-up of the new Persian sound, selected for discovery.':['Новый взгляд на современное персидское звучание.','نگاهی به صدای تازه موسیقی فارسی، برای کشف بیشتر.'],
 'Play mix':['Слушать микс','پخش میکس'],
 'Start with a sound':['Начните со звучания','با یک سبک شروع کنید'],
 'Browse all':['Все жанры','مشاهده همه'],
 'QUICK DISCOVERY':['БЫСТРОЕ ОТКРЫТИЕ','کشف سریع'],
 'Recent projects across the catalogue.':['Свежие релизы из каталога.','تازه‌های موسیقی در کاتالوگ.'],
 'Curated paths into different scenes.':['Подборки из разных музыкальных сцен.','پلی‌لیست‌هایی از جریان‌های متنوع موسیقی.'],
 'People shaping the sound right now.':['Артисты, формирующие звук сегодня.','هنرمندانی که صدای امروز را شکل می‌دهند.'],
 'A few topics from the community.':['Несколько тем сообщества.','چند موضوع از گفت‌وگوهای جامعه.'],
 'Saved editorial picks':['Сохранённые подборки редакции','منتخب‌های ذخیره‌شده'],
 'Editorial pick':['Редакционная подборка','منتخب سردبیر'],
 'Curated by STARMUSICS':['Подборка STARMUSICS','منتخب STARMUSICS'],
 'Selections you chose to keep.':['Подборки, которые вы решили сохранить.','منتخب‌هایی که ذخیره کرده‌اید.'],
 'Saved on this device':['Сохранено на этом устройстве','ذخیره‌شده روی این دستگاه']
};
Object.assign(extraTranslations, {
 'Saved albums':['Сохранённые альбомы','آلبوم‌های ذخیره‌شده'],
 'Albums you chose to keep in your library.':['Альбомы, которые вы сохранили в медиатеке.','آلبوم‌هایی که در کتابخانه خود ذخیره کرده‌اید.'],
 'Save album':['Сохранить альбом','ذخیره آلبوم'],
 '＋ Save album':['＋ Сохранить альбом','＋ ذخیره آلبوم'],
 '✓ Saved to library':['✓ Сохранено в медиатеке','✓ در کتابخانه ذخیره شد'],
 'AUDIO NOT CONNECTED':['АУДИО НЕ ПОДКЛЮЧЕНО','صدا متصل نیست'],
 'TRACKLIST IN CURATION':['ТРЕК-ЛИСТ СОБИРАЕТСЯ','فهرست آهنگ در حال آماده‌سازی'],
 'Audio source not configured':['Источник аудио не настроен','منبع صدا پیکربندی نشده است'],
 'Tracklist pending verification':['Трек-лист ожидает проверки','فهرست آهنگ در انتظار تأیید است'],
 'Explore mix':['Открыть подборку','مشاهده میکس'],
 'Album details · tracklist pending verification':['Информация об альбоме · трек-лист не проверен','اطلاعات آلبوم · فهرست آهنگ تأیید نشده'],
 'Editorial playlist · verified tracklist pending':['Редакционная подборка · трек-лист не проверен','پلی‌لیست منتخب · فهرست آهنگ تأیید نشده'],
 'Listen to audio for the first time':['Прослушайте аудио впервые','برای نخستین بار به صدا گوش دهید'],
 'You played audio for the first time':['Вы впервые прослушали аудио','شما برای نخستین بار صدا پخش کردید']
});
for (const [label, translations] of Object.entries(extraTranslations)) {
  I18N.en[label] ??= label;
  I18N.ru[label] ??= translations[0];
  I18N.fa[label] ??= translations[1];
}
const languageOriginals = new WeakMap();
let languageObserver = null;
function storedLanguage(){try{const raw=localStorage.getItem('starmusics.language');if(!raw)return activeLanguage;try{const parsed=JSON.parse(raw);if(I18N[parsed])return parsed;}catch{}return I18N[raw]?raw:activeLanguage;}catch{return activeLanguage;}}
function translateTextNode(node) {
  if (!node || node.nodeType !== Node.TEXT_NODE) return;
  if (!languageOriginals.has(node)) languageOriginals.set(node, node.nodeValue);
  const original = languageOriginals.get(node) || '';
  const key = original.trim();
  if (!key) return;
  const translated = I18N[activeLanguage]?.[key];
  if (translated) node.nodeValue = original.replace(key, translated);
  else if (activeLanguage === 'en') node.nodeValue = original;
}
function translateSubtree(node) {
  if (!node) return;
  if (node.nodeType === Node.TEXT_NODE) translateTextNode(node);
  else if (node.nodeType === Node.ELEMENT_NODE || node.nodeType === Node.DOCUMENT_FRAGMENT_NODE) {
    const walker = document.createTreeWalker(node, NodeFilter.SHOW_TEXT);
    let textNode;
    while ((textNode = walker.nextNode())) translateTextNode(textNode);
    if (node.nodeType === Node.ELEMENT_NODE && node.matches?.('[placeholder],[aria-label],[title]')) translateAttributes(node);
    node.querySelectorAll?.('[placeholder],[aria-label],[title]').forEach(translateAttributes);
  }
}
function translateAttributes(el) {
  for (const attr of ['placeholder','aria-label','title']) {
    if (!el.hasAttribute(attr)) continue;
    const dataKey = `data-original-${attr}`;
    const key = el.getAttribute(dataKey) || el.getAttribute(attr);
    if (!el.hasAttribute(dataKey)) el.setAttribute(dataKey, key);
    const translated = I18N[activeLanguage]?.[key];
    if (translated) el.setAttribute(attr, translated);
    else if (activeLanguage === 'en') el.setAttribute(attr, key);
  }
}
function installLanguageObserver() {
  if (languageObserver || typeof MutationObserver !== 'function' || !document.body) return;
  languageObserver = new MutationObserver(records => {
    for (const record of records) record.addedNodes.forEach(translateSubtree);
  });
  languageObserver.observe(document.body, { childList: true, subtree: true });
}
function applyLanguage(lang,persist=true){
  if(!I18N[lang])lang='en';
  activeLanguage=lang;
  document.documentElement.lang=lang;
  document.documentElement.dir=lang==='fa'?'rtl':'ltr';
  document.documentElement.dataset.language=lang;
  if(persist){try{localStorage.setItem('starmusics.language',JSON.stringify(lang))}catch{}}
  translateSubtree(document.body);
  document.querySelectorAll('[placeholder],[aria-label],[title]').forEach(translateAttributes);
  document.querySelectorAll('#language-menu [data-language]').forEach(b=>b.setAttribute('aria-checked',String(b.dataset.language===lang)));
  const menu=$('#language-menu');if(menu)menu.hidden=true;$('#btn-language')?.setAttribute('aria-expanded','false');
  installLanguageObserver();
}
let lastEntityTrigger=null;
function openEntity(kind,name){
 const panel=$('#entity-detail');if(!panel)return;
 if(panel.hidden && !document.querySelector('#entity-detail').contains(document.activeElement))lastEntityTrigger=document.activeElement;
 let title=String(name||''),img='',kicker='',description='',meta=[],tracks=[],relatedMarkup='',artNote='Catalogue artwork';
 const trackRows=(records)=>records.map(t=>({id:t.id,title:t.title,artist:t.artist,img:t.artworkUrl||t.img||'',duration:t.duration||Math.round((t.durationMs||200000)/1000)}));
 const entityStatus=(record)=>record?.metadataStatus==='verified'?'Verified metadata':'Demo metadata · verification pending';
 if(kind==='artist'){
  const artist=Catalog.getArtist(name);if(!artist)return;
  title=artist.name;img=artist.artworkUrl||'';kicker='ARTIST PROFILE';artNote='Artist artwork';
  tracks=Catalog.getTracks().filter(t=>t.artistId===artist.id);
  const albums=Catalog.source.albums.filter(a=>a.artistId===artist.id);
  description=artist.biography||'Artist profile in the STARMUSICS catalogue. A verified biography and editorial notes have not been added yet.';
  meta=[`${tracks.length} linked ${tracks.length===1?'track':'tracks'}`,`${albums.length} linked ${albums.length===1?'album':'albums'}`,entityStatus(artist)];
  relatedMarkup=albums.length?albums.map(a=>`<button type="button" class="entity-related-card" data-open-album="${escapeHTML(a.title)}"><span class="entity-related-art" style="background-image:url('${escapeHTML(a.artworkUrl||'')}')"></span><strong>${escapeHTML(a.title)}</strong><small>Album · ${a.trackIds?.length||0} linked tracks</small></button>`).join(''):'<p class="page-description entity-empty-related">No albums are linked to this artist in the current catalogue.</p>';
 }else if(kind==='album'){
  const album=Catalog.getAlbum(name);if(!album)return;
  title=album.title;img=album.artworkUrl||'';kicker='ALBUM';artNote='Album artwork';
  tracks=(album.trackIds||[]).map(id=>Catalog.getTrack(id)).filter(Boolean);
  const artist=Catalog.source.artists.find(a=>a.id===album.artistId);
  const artistName=Catalog.artistName(album.artistId);
  const year=album.releaseDate?String(album.releaseDate).slice(0,4):'';
  description=album.description||`Explore ${album.title} in the STARMUSICS catalogue. Track information is shown only when tracks are linked and metadata is verified.`;
  meta=[artistName,...(year?[year]:[]),`${tracks.length} linked ${tracks.length===1?'track':'tracks'}`,tracks.length?'Tracklist linked':'Tracklist pending',entityStatus(album)];
  relatedMarkup=artist?`<button type="button" class="entity-related-card" data-open-artist="${escapeHTML(artist.name)}"><span class="entity-related-art" style="background-image:url('${escapeHTML(artist.artworkUrl||'')}')"></span><strong>${escapeHTML(artist.name)}</strong><small>Artist profile</small></button>`:'<p class="page-description entity-empty-related">No artist profile is linked to this album yet.</p>';
 }else if(kind==='playlist'){
  const playlist=Catalog.getPlaylist(name);if(!playlist)return;
  title=playlist.title;img=playlist.artworkUrl||'';kicker='CURATED PLAYLIST';artNote='Playlist artwork';
  description=playlist.description||'An editorial listening path from STARMUSICS.';
  tracks=(playlist.trackIds||[]).map(id=>Catalog.getTrack(id)).filter(Boolean);
  meta=[playlist.curator||'STARMUSICS editorial',`${tracks.length} linked ${tracks.length===1?'track':'tracks'}`,tracks.length?'Tracklist linked':'Tracklist pending'];
  relatedMarkup='<p class="page-description entity-empty-related">Related selections will appear as this playlist is connected to the catalogue.</p>';
 }else{
  const genre=Catalog.getGenre(name);if(!genre)return;
  title=genre.name;img=DATA.playlists.find(p=>p.title.toLowerCase().includes(genre.name.toLowerCase()))?.img||DATA.releases[0]?.img||'';kicker='GENRE GUIDE';artNote='Discovery artwork';
  description=genre.description||`Explore music tagged ${genre.name} in the STARMUSICS catalogue. Genre coverage will grow as entries are verified.`;
  tracks=Catalog.getTracks().filter(t=>(t.genreIds||[]).includes(genre.id));
  const artistIds=[...new Set(tracks.map(t=>t.artistId))];
  meta=[`${tracks.length} linked ${tracks.length===1?'track':'tracks'}`,`${artistIds.length} linked ${artistIds.length===1?'artist':'artists'}`,entityStatus(genre)];
  relatedMarkup=artistIds.length?Catalog.source.artists.filter(a=>artistIds.includes(a.id)).map(a=>`<button type="button" class="entity-related-card" data-open-artist="${escapeHTML(a.name)}"><span class="entity-related-art" style="background-image:url('${escapeHTML(a.artworkUrl||'')}')"></span><strong>${escapeHTML(a.name)}</strong><small>Artist</small></button>`).join(''):'<p class="page-description entity-empty-related">No artist profiles are linked to this genre yet.</p>';
 }
 const normalizedTracks=tracks.map(t=>t.artist?t:{id:t.id,title:t.title,artist:Catalog.artistName(t.artistId),img:t.artworkUrl||'',duration:Math.round((t.durationMs||200000)/1000)});
 $('#entity-title').textContent=title;
 $('#entity-kicker').textContent=kicker;
 $('#entity-description').textContent=description;
 $('#entity-meta').innerHTML=meta.map((value,index)=>`<span class="entity-meta-chip${index===meta.length-1?' entity-meta-status':''}">${escapeHTML(value)}</span>`).join('');
 $('#entity-art-note').textContent=artNote;
 $('#entity-art').style.backgroundImage=img?`url("${img}")`:'none';
 panel.dataset.entityKind=kind;
 panel.classList.toggle('entity-detail--artist',kind==='artist');
 panel.classList.toggle('entity-detail--album',kind==='album');
 $('#entity-list-title').textContent=kind==='genre'?'Essential listening':kind==='playlist'?'Playlist tracks':kind==='album'?'Tracklist':'Popular tracks';
 $('#entity-track-list').innerHTML=normalizedTracks.length?normalizedTracks.map(t=>`<button type="button" class="track-row entity-track" data-title="${escapeHTML(t.title)}" data-artist="${escapeHTML(t.artist)}" data-img="${escapeHTML(t.img||'')}" data-duration="${t.duration||200}" data-id="${escapeHTML(t.id)}"><img src="${escapeHTML(t.img||'')}" alt="" loading="lazy"><span><strong>${escapeHTML(t.title)}</strong><small>${escapeHTML(t.artist)}</small></span><span class="entity-track-play" aria-hidden="true">▶</span></button>`).join(''):`<div class="entity-empty-state"><span class="entity-empty-symbol" aria-hidden="true">${kind==='album'?'▧':kind==='artist'?'✦':'♫'}</span><strong>${kind==='album'?'Tracklist not connected yet':kind==='artist'?'No linked tracks yet':'No tracks linked yet'}</strong><p>${kind==='album'?'This album has no verified track relationships in the current catalogue.':kind==='artist'?'Tracks will appear here when verified catalogue entries are linked to this artist.':'Tracks will appear here as the catalogue is completed.'}</p></div>`;
 $('#entity-related').innerHTML=relatedMarkup;
 const saveAlbumButton=$('#btn-save-entity-album');
 if(saveAlbumButton){saveAlbumButton.hidden=kind!=='album';saveAlbumButton.dataset.albumId=kind==='album'?(Catalog.getAlbum(name)?.id||''):'';updateEntitySaveAlbumButton();}
 panel.hidden=false;document.body.classList.add('entity-open');
 $('#entity-detail-sheet')?.focus({preventScroll:true});
}
function closeEntity(){const panel=$('#entity-detail');if(!panel||panel.hidden)return;panel.hidden=true;document.body.classList.remove('entity-open');if(lastEntityTrigger?.isConnected&&!panel.contains(lastEntityTrigger))lastEntityTrigger.focus({preventScroll:true});lastEntityTrigger=null;}

function readRawLocal(key, fallback = null) { try { return localStorage.getItem(key) ?? fallback; } catch { return fallback; } }
let activeLanguage = 'en';
const SEARCH_COPY = {
 en: { resultsFor: q => `Results for “${q}”`, noResults: 'No results found', noMatches: 'No matches yet', tryAnother: 'Try another spelling, artist, track, album, playlist, or genre.', zero: '0 matches', allCount: n => `${n} ${n === 1 ? 'match' : 'matches'}`, filteredCount: (n,total) => `${n} of ${total} matches`, types: {Track:'Track',Artist:'Artist',Album:'Album',Playlist:'Playlist',Genre:'Genre'} },
 ru: { resultsFor: q => `Результаты по запросу «${q}»`, noResults: 'Ничего не найдено', noMatches: 'Совпадений пока нет', tryAnother: 'Попробуйте изменить запрос или указать другого артиста, трек, альбом, плейлист или жанр.', zero: 'Совпадений: 0', allCount: n => `Результатов: ${n}`, filteredCount: (n,total) => `${n} из ${total} результатов`, types: {Track:'Трек',Artist:'Артист',Album:'Альбом',Playlist:'Плейлист',Genre:'Жанр'} },
 fa: { resultsFor: q => `نتایج جست‌وجوی «${q}»`, noResults: 'نتیجه‌ای پیدا نشد', noMatches: 'هنوز نتیجه‌ای وجود ندارد', tryAnother: 'املای دیگری را امتحان کنید یا نام هنرمند، آهنگ، آلبوم، پلی‌لیست یا سبک را جست‌وجو کنید.', zero: '۰ نتیجه', allCount: n => `${n.toLocaleString('fa-IR')} نتیجه`, filteredCount: (n,total) => `${n.toLocaleString('fa-IR')} از ${total.toLocaleString('fa-IR')} نتیجه`, types: {Track:'آهنگ',Artist:'هنرمند',Album:'آلبوم',Playlist:'پلی‌لیست',Genre:'سبک'} }
};
const SEARCH_SUBTITLE_COPY = {
 ru: {'Artist profile':'Профиль артиста','Explore this sound':'Исследуйте этот жанр','Curated by STARMUSICS':'Подборка STARMUSICS','Global':'Мировая сцена','International':'Международная сцена','For You':'Для вас'},
 fa: {'Artist profile':'پروفایل هنرمند','Explore this sound':'کشف این سبک','Curated by STARMUSICS':'منتخب STARMUSICS','Global':'جهانی','International':'بین‌المللی','For You':'برای شما'}
};
function searchCopy(key,...args){const copy=SEARCH_COPY[activeLanguage]||SEARCH_COPY.en;const value=copy[key]??SEARCH_COPY.en[key];return typeof value==='function'?value(...args):value;}
function searchSubtitle(h){
 if(h.source==='personal'){
  const n=Number(h.trackCount)||0;
  if(activeLanguage==='ru')return `Ваш плейлист · ${n} треков`;
  if(activeLanguage==='fa')return `پلی‌لیست شما · ${n.toLocaleString('fa-IR')} آهنگ`;
 }
 return SEARCH_SUBTITLE_COPY[activeLanguage]?.[h.subtitle]||h.subtitle||'';
}

const savedVolume = Number(readRawLocal('starmusics.volume', '70'));
let likedTrackMetadata = new Map();
const state = {
  playing: false,
  hasPlayedAudio: loadLocal('starmusics.hasPlayedAudio', false) === true,
  current: null,
  progress: 0,
  volume: Number.isFinite(savedVolume) ? Math.min(100, Math.max(0, savedVolume)) : 70,
  liked: new Set(),
  shuffle: false,
  repeat: false,
  queue: [...DATA.trending.slice(1)],
  queueBeforeShuffle: null,
  previousTracks: [],
  forwardTracks: [],
  selectedDiscussion: 0,
  selectedPlaylistIndex: null,
  timer: null,
  history: [],
  playerMode: ['dock','page','mini'].includes(readRawLocal('starmusics.playerMode')) ? readRawLocal('starmusics.playerMode') : 'dock',
  playerModeBeforeMini: ['dock','page'].includes(readRawLocal('starmusics.playerModeBeforeMini')) ? readRawLocal('starmusics.playerModeBeforeMini') : 'dock',
  audioObjectUrl: null,
  localAudioSources: new Map(),
  playerFocusReturn: null,
  mediaSessionTrackId: null,
};

const $ = (s, p = document) => p.querySelector(s);
const $$ = (s, p = document) => [...p.querySelectorAll(s)];
let activeSearchFilter = 'all';
let lastSearchQuery = '';
let discussionSearchQuery = '';
let discussionSort = 'active';
let commentSort = 'oldest';

function fmt(sec) {
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60);
  return `${m}:${s.toString().padStart(2, '0')}`;
}

function playerIcon(name) {
  const paths = {
    play: '<path d="M8.5 5.25v13.5L19 12 8.5 5.25Z" fill="currentColor" stroke="none"/>',
    pause: '<path d="M7 5.5h3.8v13H7zM13.2 5.5H17v13h-3.8z" fill="currentColor" stroke="none"/>',
    heart: '<path d="M20.3 8.7c0 4.2-8.3 9.3-8.3 9.3S3.7 12.9 3.7 8.7A4.2 4.2 0 0 1 12 6.9a4.2 4.2 0 0 1 8.3 1.8Z"/>',
    restore: '<path d="M4 11a8 8 0 1 1 2.3 5.7M4 5v6h6"/><path d="M12 8v4l2.8 1.6"/>',
    expand: '<path d="M8 4H4v4M16 4h4v4M4 16v4h4M20 16v4h-4"/>',
    shuffle: '<path d="M16 3h5v5M4 5h2.5c4.5 0 6.5 9 11 9H21M16 16l5 5v-5M4 19h2.5c1.6 0 2.8-1 3.8-2.4M14 7c1-1.3 2.1-2 3.5-2H21"/>',
    previous: '<path d="M5 5v14M19 5 8 12l11 7z"/>',
    next: '<path d="M19 5v14M5 5l11 7-11 7z"/>',
    repeat: '<path d="M17 2l4 4-4 4M3 11V9a3 3 0 0 1 3-3h15M7 22l-4-4 4-4M21 13v2a3 3 0 0 1-3 3H3"/>',
    'volume-up': '<path d="M4 9v6h4l5 4V5L8 9H4Z"/><path d="M16 9a5 5 0 0 1 0 6M18.5 6.5a8.5 8.5 0 0 1 0 11"/>',
    'volume-down': '<path d="M4 9v6h4l5 4V5L8 9H4Z"/><path d="M16 9a5 5 0 0 1 0 6"/>',
    'volume-mute': '<path d="M4 9v6h4l5 4V5L8 9H4Z"/><path d="m17 9 5 6m0-6-5 6"/>',
    queue: '<path d="M4 6h16M4 11h16M4 16h10M4 21h10"/>',
    lyrics: '<path d="M5 4h14v16H5zM8 8h8M8 12h8M8 16h5"/>',
    maximize: '<path d="M8 3H3v5M16 3h5v5M3 16v5h5M21 16v5h-5"/>',
    tablet: '<rect x="6" y="2.5" width="12" height="19" rx="1.7"/><path d="M11 18.5h2"/>',
    compress: '<path d="M9 3v6H3M15 3v6h6M3 15h6v6M21 15h-6v6"/>',
  };
  return `<svg class="player-icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false">${paths[name] || paths.play}</svg>`;
}


function toast(msg) {
  const el = $('#toast');
  el.textContent = msg;
  el.hidden = false;
  clearTimeout(el._t);
  el._t = setTimeout(() => { el.hidden = true; }, 2200);
}

function updateVolumeUI() {
  const audio = $('#audio-engine');
  const muted = Boolean(audio?.muted);
  const percent = Math.round(state.volume);
  const bar = $('#volume-bar');
  const muteButton = $('#btn-volume');
  const range = $('#np-volume-range');
  if (bar) {
    $('#volume-fill').style.width = `${percent}%`;
    bar.setAttribute('aria-valuenow', String(percent));
    bar.setAttribute('aria-valuetext', muted ? 'Muted' : `${percent} percent`);
  }
  if (range && Number(range.value) !== percent) range.value = String(percent);
  if (muteButton) {
    muteButton.classList.toggle('active', muted);
    muteButton.setAttribute('aria-pressed', String(muted));
    muteButton.setAttribute('aria-label', muted ? 'Unmute' : 'Mute');
    muteButton.title = muted ? 'Unmute' : 'Mute';
    muteButton.innerHTML = playerIcon(muted ? 'volume-mute' : percent < 35 ? 'volume-down' : 'volume-up');
  }
}

function setVolume(value, persist = true) {
  const next = Number(value);
  state.volume = Math.round(Math.max(0, Math.min(100, Number.isFinite(next) ? next : 70)));
  const audio = $('#audio-engine');
  if (audio) {
    audio.volume = state.volume / 100;
    if (state.volume > 0 && audio.muted) audio.muted = false;
  }
  updateVolumeUI();
  if (persist) { try { localStorage.setItem('starmusics.volume', String(state.volume)); } catch {} }
}

function queueItemKey(item) { return String(item?.rank ?? item?.id ?? item?.track ?? item?.title ?? ''); }

function syncPlaybackControlState() {
  $('#btn-shuffle')?.classList.toggle('active', state.shuffle);
  $('#btn-shuffle')?.setAttribute('aria-pressed', String(state.shuffle));
  $('#btn-repeat')?.classList.toggle('active', state.repeat);
  $('#btn-repeat')?.setAttribute('aria-pressed', String(state.repeat));
  $$('.np-controls [data-action="shuffle"]').forEach(button => { button.classList.toggle('active', state.shuffle); button.setAttribute('aria-pressed', String(state.shuffle)); });
  $$('.np-controls [data-action="repeat"]').forEach(button => { button.classList.toggle('active', state.repeat); button.setAttribute('aria-pressed', String(state.repeat)); });
}

function setShuffle(enabled) {
  const nextEnabled = Boolean(enabled);
  if (nextEnabled === state.shuffle) return;
  if (nextEnabled) {
    state.queueBeforeShuffle = state.queue.slice();
    for (let i = state.queue.length - 1; i > 0; i -= 1) {
      const j = Math.floor(Math.random() * (i + 1));
      [state.queue[i], state.queue[j]] = [state.queue[j], state.queue[i]];
    }
  } else if (state.queueBeforeShuffle) {
    const remaining = new Set(state.queue.map(queueItemKey));
    state.queue = state.queueBeforeShuffle.filter(item => remaining.has(queueItemKey(item)));
    state.queueBeforeShuffle = null;
  }
  state.shuffle = nextEnabled;
  syncPlaybackControlState();
  updateQueueUI();
  toast(nextEnabled ? 'Shuffle on' : 'Shuffle off');
}

function renderCards(container, items, isRelease) {
  if (!container) return;
  container.innerHTML = items.map(item => {
    const title = escapeHTML(item.title || 'Untitled');
    const subtitle = escapeHTML(item.subtitle || 'STARMUSICS catalogue');
    const image = escapeHTML(item.img || '');
    const itemId = escapeHTML(item.canonicalId || item.id || '');
    const albumCard = Boolean(isRelease && item.releaseType !== 'single');
    const track = isRelease && !albumCard ? Catalog.getTrack(item.canonicalId || item.id) : null;
    const playable = Boolean(track && AudioSourceAdapter.resolveCatalogTrack(Catalog, track.id));
    if (!isRelease) {
      return `<article class="card curated-playlist-card" data-open-curated-playlist="${title}" data-id="${itemId}" tabindex="0" role="button" aria-label="Open editorial playlist ${title}">
        <div class="card-cover" style="background-image:url('${image}')"><span class="card-state-badge">TRACKLIST IN CURATION</span><span class="card-open-mark" aria-hidden="true">↗</span></div>
        <h3>${title}</h3><p>${subtitle}</p><small class="card-status-note">Editorial playlist · verified tracklist pending</small>
      </article>`;
    }
    if (albumCard) {
      return `<article class="card album-release-card" data-open-album="${title}" data-id="${itemId}" tabindex="0" role="button" aria-label="Open album ${title}">
        <div class="card-cover" style="background-image:url('${image}')"><span class="card-open-mark" aria-hidden="true">↗</span></div>
        <h3>${title}${item.tag ? ` <span class="tag">${escapeHTML(item.tag)}</span>` : ''}</h3><p>${subtitle}</p><small class="card-status-note">Album details · tracklist pending verification</small>
      </article>`;
    }
    return `<article class="card catalogue-track-card" data-id="${itemId}" data-title="${title}" data-artist="${subtitle}" data-img="${image}" data-duration="${Number(item.duration) || 200}" data-track-id="${itemId}">
      <div class="card-cover" style="background-image:url('${image}')">
        <div class="play-overlay"><button class="play-btn" type="button" aria-label="${playable ? `Play ${title}` : `Select ${title}; audio source unavailable`}" title="${playable ? 'Play track' : 'Select track; audio source unavailable'}">${playable ? playerIcon('play') : '<svg class="player-icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 5v14M5 12h14"/></svg>'}</button></div>
        ${playable ? '' : '<span class="card-state-badge">AUDIO NOT CONNECTED</span>'}
      </div>
      <h3>${title}${item.tag ? ` <span class="tag">${escapeHTML(item.tag)}</span>` : ''}</h3><p>${subtitle}</p>
    </article>`;
  }).join('');
}

function renderArtists() {
  $('#artists-row').innerHTML = DATA.artists.map(a => `<button type="button" class="artist entity-open-artist" data-open-artist="${escapeHTML(a.name)}"><span class="artist-avatar" style="background-image:url('${a.img}')"></span><strong>${escapeHTML(a.name)}</strong></button>`).join('');
}

function renderArtistsPage() {
  const el = $('#artists-page-row');
  if (!el) return;
  el.innerHTML = DATA.artists.map(a => `<button type="button" class="artist entity-open-artist" data-open-artist="${escapeHTML(a.name)}"><span class="artist-avatar" style="background-image:url('${a.img}')"></span><strong>${escapeHTML(a.name)}</strong><small>Artist profile</small></button>`).join('');
}

function renderTrending() {
  $('#trending-list').innerHTML = DATA.trending.map(t => `
    <li data-id="${t.rank}" data-title="${escapeHTML(t.track)}" data-artist="${escapeHTML(t.artist)}" data-img="${escapeHTML(t.img)}" data-duration="${t.duration}">
      <span class="rank">${t.rank}</span>
      <img src="${t.img}" alt="" />
      <div>
        <strong>${t.artist}</strong>
        <span>${t.track} ${t.tag ? `<span class="tag">${t.tag}</span>` : ''}</span>
      </div>
    </li>
  `).join('');
}

function discussionCount(index) {
  const topic = communityTopics[index];
  if (communityBackendReady && topic) return Number(topic.commentCount) || 0;
  return localCommunityComments.filter(comment => comment.topic === index).length;
}

function renderDiscussions() {
  const el = $('#discussion-list');
  if (!el) return;
  el.innerHTML = communityTopics.slice(0, 6).map((topic, i) => `
    <li data-open-topic="${i}" tabindex="0" role="button">
      <div class="avatars">${Array(Math.min(3, Number(topic.avatars)||1)).fill('<span></span>').join('')}</div>
      <div>
        <strong>${escapeHTML(topic.title)}</strong>
        <span>${discussionCount(i)} ${discussionCount(i) === 1 ? 'comment' : 'comments'}</span>
      </div>
    </li>
  `).join('');
}

function renderHomeDiscussions() {
  const el = $('#home-discussion-list');
  if (!el) return;
  el.innerHTML = communityTopics.slice(0, 2).map((topic, i) => `<button type="button" class="home-discussion-card" data-open-topic="${i}"><span class="discussion-kicker">In the conversation</span><strong>${escapeHTML(topic.title)}</strong><span>${discussionCount(i)} ${discussionCount(i) === 1 ? 'comment' : 'comments'}</span></button>`).join('');
}
function updateEntitySaveAlbumButton() {
  const button = $('#btn-save-entity-album');
  if (!button) return;
  const id = button.dataset.albumId || '';
  const album = Catalog.getAlbum(id);
  const saved = Boolean(album && savedAlbumIds.has(album.id));
  button.hidden = !album;
  button.textContent = saved ? '✓ Saved to library' : '＋ Save album';
  button.setAttribute('aria-pressed', String(saved));
  button.setAttribute('aria-label', saved ? `Remove ${album?.title || 'album'} from saved albums` : `Save ${album?.title || 'album'} to library`);
}
function renderSavedAlbums() {
  const section = $('#library-saved-albums-section');
  const row = $('#library-saved-albums-row');
  if (!section || !row) return;
  const albums = [...savedAlbumIds].map(id => Catalog.getAlbum(id)).filter(Boolean);
  section.hidden = albums.length === 0;
  const count = $('#saved-albums-count');
  if (count) count.textContent = `${albums.length} ${albums.length === 1 ? 'album' : 'albums'}`;
  row.innerHTML = albums.map(album => `<article class="saved-album-card"><button type="button" class="saved-album-open" data-open-album="${escapeHTML(album.title)}"><span class="saved-album-art" style="background-image:url('${escapeHTML(album.artworkUrl || '')}')" aria-hidden="true"></span><span class="saved-album-copy"><strong>${escapeHTML(album.title)}</strong><small>${escapeHTML(Catalog.artistName(album.artistId))}</small></span></button><button class="saved-album-remove" type="button" data-unsave-album="${escapeHTML(album.id)}" aria-label="Remove ${escapeHTML(album.title)} from saved albums" title="Remove album">×</button></article>`).join('');
}
function renderSavedFeatured() {
  const section = $('#library-saved-picks-section');
  const row = $('#library-saved-picks-row');
  if (!section || !row) return;
  section.hidden = !featuredSaved;
  if (!featuredSaved) { row.innerHTML = ''; return; }
  const pick = DATA.playlists[0];
  const copy = key => I18N[activeLanguage]?.[key] || key;
  row.innerHTML = `<button type="button" class="saved-pick-card" data-open-curated-playlist="${escapeHTML(pick.title)}"><span class="saved-pick-art" style="background-image:url('${escapeHTML(pick.img)}')" aria-hidden="true"></span><span class="saved-pick-copy"><strong>${escapeHTML(pick.title)}</strong><small>${escapeHTML(copy('Editorial pick'))} · ${escapeHTML(copy('Saved on this device'))}</small></span><span class="saved-pick-arrow" aria-hidden="true">↗</span></button>`;
}
function updateFeaturedSaveButton() {
  const button = $('#btn-save-featured');
  if (!button) return;
  button.textContent = featuredSaved ? '✓' : '＋';
  button.setAttribute('aria-pressed', String(featuredSaved));
  button.setAttribute('aria-label', featuredSaved ? 'Remove Persian Trap playlist from your library' : 'Save Persian Trap playlist');
  button.title = featuredSaved ? 'Remove from your library' : 'Save playlist';
  button.classList.toggle('is-saved', featuredSaved);
}
function renderLibrary() {
  const likedList = $('#library-liked-list');
  const likedEmpty = $('#library-liked-empty');
  if (likedList && likedEmpty) {
    const items = likedTrackItems();
    likedList.innerHTML = items.map(t => `<div class="track-row" data-id="${escapeHTML(t.id)}" data-title="${escapeHTML(t.title)}" data-artist="${escapeHTML(t.artist)}" data-img="${escapeHTML(t.img || '')}" data-duration="${t.duration || 200}"><img src="${escapeHTML(t.img || '')}" alt="" /><div><strong>${escapeHTML(t.title)}</strong><span>${escapeHTML(t.artist)}</span></div></div>`).join('');
    likedEmpty.hidden = items.length > 0;
  }
  renderPlaylistCards($('#library-playlists-row'));
  renderSavedAlbums();
  renderSavedFeatured();
}

function renderGenres() {
  const g = $('#genre-grid');
  if (!g) return;
  g.innerHTML = DATA.genres.map(name => `<button type="button" class="genre-chip" data-open-genre="${escapeHTML(name)}">${escapeHTML(name)}</button>`).join('');
}

function updatePlayerUI() {
  const c = state.current;
  const player = $('#music-player');
  document.body.classList.toggle('has-active-player', Boolean(c));
  syncPlaybackControlState();
  if (!c) { if (player) player.hidden = true; updateVolumeUI(); return; }
  if (player) player.hidden = false;
  $('#player-art').src = c.img || '';
  $('#player-title').textContent = c.title;
  $('#player-artist').textContent = c.artist;
  const audio = $('#audio-engine');
  syncMediaSession(c, audio);
  const duration = Number.isFinite(audio?.duration) && audio.duration > 0 ? audio.duration : c.duration || 0;
  if (Number.isFinite(audio?.currentTime) && audio.src) state.progress = audio.currentTime;
  $('#time-total').textContent = fmt(duration);
  $('#time-current').textContent = fmt(state.progress);
  const pct = duration ? Math.min(100, (state.progress / duration) * 100) : 0;
  $('#progress-fill').style.width = pct + '%';
  $('#progress-thumb').style.left = pct + '%';
  $('#progress-bar').setAttribute('aria-valuenow', Math.round(pct));
  $('#progress-bar').setAttribute('aria-valuetext', `${fmt(state.progress)} of ${fmt(duration)}`);
  const npProgress = $('#np-progress-bar');
  if (npProgress) {
    npProgress.setAttribute('aria-valuenow', String(Math.round(pct)));
    npProgress.setAttribute('aria-valuetext', `${fmt(state.progress)} of ${fmt(duration)}`);
  }
  $('#np-queue-count') && ($('#np-queue-count').textContent = String(state.queue.length));
  updateVolumeUI();
  const playIcon = playerIcon('play');
  const pauseIcon = playerIcon('pause');
  $('#btn-play').innerHTML = state.playing ? pauseIcon : playIcon;
  $('#btn-play').title = state.playing ? 'Pause' : 'Play';
  $('#btn-play').setAttribute('aria-label', state.playing ? 'Pause' : 'Play');
  $('#btn-player-mode')?.setAttribute('title', `Player mode: ${state.playerMode}`);
  $('#btn-player-mode').innerHTML = state.playerMode === 'dock' ? playerIcon('maximize') : state.playerMode === 'page' ? playerIcon('tablet') : playerIcon('compress');
  syncPlaybackControlState();
  const npLyrics = $('#lyrics-placeholder');
  if (npLyrics) npLyrics.textContent = 'Lyrics haven’t been added for this track. The exported card will show track information only until authorized lyrics are available.';
  const modal = $('#now-playing-modal');
  if (modal) modal.style.setProperty('--np-artwork', c.img ? `url("${String(c.img).replace(/["\\]/g, '\\$&')}")` : 'none');
  $('#np-art')?.classList.toggle('is-playing', state.playing);
  $('#np-sheet')?.classList.toggle('is-playing', state.playing);
  const miniPlay = $('#btn-mini-play');
  if (miniPlay) {
    miniPlay.innerHTML = state.playing ? playerIcon('pause') : playerIcon('play');
    miniPlay.setAttribute('aria-label', state.playing ? 'Pause' : 'Play');
    miniPlay.title = state.playing ? 'Pause' : 'Play';
  }
  const eq = $('#eq-sidebar'), eqMini = $('#eq-mini');
  eq?.classList.toggle('playing', state.playing); eqMini?.classList.toggle('playing', state.playing);
  $('#btn-like').classList.toggle('liked', state.liked.has(c.id));
  if (!$('#now-playing-modal').hidden) {
    const npArt = $('#np-art');
    if (npArt) {
      const cover = String(c.img || '').replace(/["\\]/g, '\\$&');
      npArt.style.backgroundColor = '#d6dce6';
      npArt.style.backgroundImage = c.img
        ? `linear-gradient(145deg, rgba(255,255,255,.16), rgba(20,27,40,.25)), radial-gradient(circle at 24% 18%, rgba(255,255,255,.44), transparent 43%), radial-gradient(ellipse at 76% 78%, rgba(108,123,150,.34), transparent 54%), url("${cover}")`
        : 'radial-gradient(circle at 24% 18%, rgba(255,255,255,.92), transparent 31%), radial-gradient(ellipse at 76% 78%, rgba(108,123,150,.42), transparent 52%), linear-gradient(145deg, #eef1f6, #c6cedb)';
    }
    $('#np-title').textContent = c.title; $('#np-artist').textContent = c.artist;
    $('#np-time-cur').textContent = fmt(state.progress); $('#np-time-tot').textContent = fmt(duration);
    $('.np-bar .progress-fill').style.width = pct + '%';
    const modalPlay = $('.np-controls [data-action="play"]');
    if (modalPlay) {
      modalPlay.innerHTML = state.playing ? playerIcon('pause') : playerIcon('play');
      modalPlay.setAttribute('aria-label', state.playing ? 'Pause' : 'Play');
      modalPlay.title = state.playing ? 'Pause' : 'Play';
    }
  }
}

function setPlayerMode(mode) {
  if (!['dock', 'page', 'mini'].includes(mode)) return;
  const previous = state.playerMode;
  const modalWasOpen = Boolean($('#now-playing-modal') && !$('#now-playing-modal').hidden);
  if (mode === 'page' && !modalWasOpen && state.current) state.playerFocusReturn = document.activeElement;
  if (mode === 'mini' && previous !== 'mini') {
    state.playerModeBeforeMini = previous;
    try { localStorage.setItem('starmusics.playerModeBeforeMini', previous); } catch {}
  }
  state.playerMode = mode;
  try { localStorage.setItem('starmusics.playerMode', mode); } catch {}
  const player = $('#music-player');
  const modal = $('#now-playing-modal');
  player?.classList.toggle('player-mini', mode === 'mini');
  const miniActions = $('.mini-player-actions');
  if (miniActions) miniActions.style.setProperty('display', mode === 'mini' ? 'flex' : 'none', 'important');
  player?.classList.toggle('player-page-mode', mode === 'page');
  modal?.classList.toggle('np-page-mode', mode === 'page');
  if (modal) {
    modal.hidden = !(mode === 'page' && state.current);
    modal.setAttribute('aria-hidden', String(modal.hidden));
  }
  $$('[data-player-mode]').forEach(b => {
    b.classList.toggle('active', b.dataset.playerMode === mode);
    b.setAttribute('aria-pressed', String(b.dataset.playerMode === mode));
  });
  updatePlayerUI();
  if (mode === 'page' && state.current && modal) requestAnimationFrame(() => $('#btn-close-np')?.focus({ preventScroll: true }));
  else if (previous === 'page' && modalWasOpen) {
    const target = mode === 'mini' ? $('#btn-mini-restore') : state.playerFocusReturn;
    if (target?.isConnected && typeof target.focus === 'function') requestAnimationFrame(() => target.focus({ preventScroll: true }));
    state.playerFocusReturn = null;
  }
}
function playTrack(track, options = {}) {
  const audio = $('#audio-engine');
  const rawId = track.id || track.title || track.track;
  const canonical = Catalog.getTrack(rawId) || Catalog.getTrack(track.title || track.track);
  const canonicalId = canonical?.id || rawId;
  const authorizedSource = canonical ? AudioSourceAdapter.resolveCatalogTrack(Catalog, canonical.id) : null;
  const sessionSource = state.localAudioSources.get(String(canonicalId)) || '';
  const next = { id: canonicalId, legacyId: canonical?.legacyId, title: canonical?.title || track.title || track.track,
    artist: canonical ? Catalog.artistName(canonical.artistId) : (track.artist || track.subtitle),
    img: canonical?.artworkUrl || track.img || '', duration: canonical ? Math.round(canonical.durationMs / 1000) : (track.duration || 0),
    tag: canonical?.explicit ? 'E' : track.tag, audioUrl: sessionSource || authorizedSource?.url || '' };
  const previous = state.current;
  if (!options.skipHistory && previous && String(previous.id) !== String(next.id)) {
    state.previousTracks.push(previous);
    if (state.previousTracks.length > 50) state.previousTracks.shift();
    state.forwardTracks = [];
  }
  state.current = next;
  state.history = [state.current, ...state.history.filter(t => String(t.id) !== String(state.current.id))].slice(0, 30);
  renderRecent(); state.progress = 0; state.playing = false;
  if (audio) {
    audio.pause();
    if (state.current.audioUrl) {
      audio.src = state.current.audioUrl;
      audio.play().then(() => { state.playing = true; updatePlayerUI(); }).catch(() => { state.playing = false; updatePlayerUI(); toast('Audio could not be played. Check the file or source URL.'); });
    } else {
      audio.removeAttribute('src'); audio.load();
    }
  }
  updatePlayerUI(); updateQueueUI();
  if (state.current.audioUrl) toast(`Playing ${state.current.title}`);
  else toast('Track selected. Choose an audio file to listen.');
}

function startTimer() { /* Progress is driven by the real HTML audio element. */ }

function togglePlay() {
  if (!state.current) { toast('Choose a track first'); return; }
  const audio = $('#audio-engine');
  if (!audio?.src) { $('#btn-add-audio')?.click(); return; }
  if (audio.paused) audio.play().then(() => { state.playing = true; updatePlayerUI(); }).catch(() => toast('Playback failed. Try another audio file.'));
  else { audio.pause(); state.playing = false; updatePlayerUI(); }
}

function nextTrack() {
  if (state.forwardTracks.length) {
    const next = state.forwardTracks.pop();
    if (state.current) state.previousTracks.push(state.current);
    playTrack(next, { skipHistory: true });
    return;
  }
  if (state.queue.length) {
    const next = state.queue.shift();
    playTrack({ title: next.track || next.title, artist: next.artist, img: next.img, duration: next.duration, id: next.rank || next.id, audioUrl: next.audioUrl });
  } else {
    state.playing = false; state.progress = 0; const audio=$('#audio-engine'); audio?.pause(); if(audio) audio.currentTime=0; updatePlayerUI();
  }
  updateQueueUI();
}

function prevTrack() {
  const audio = $('#audio-engine');
  if (audio?.src && audio.currentTime > 3) {
    audio.currentTime = 0; state.progress = 0; updatePlayerUI(); return;
  }
  const previous = state.previousTracks.pop();
  if (!previous) { toast('No previous track in listening history yet'); return; }
  if (state.current) state.forwardTracks.push(state.current);
  playTrack(previous, { skipHistory: true });
}

function updateQueueUI() {
  const now = $('#queue-now-track');
  const c = state.current;
  if (!now) return;
  if (!c) now.innerHTML = '<span class="page-description">Nothing is playing yet.</span>';
  else now.innerHTML = `<img src="${escapeHTML(c.img || '')}" alt="" /><div><strong>${escapeHTML(c.title)}</strong><span>${escapeHTML(c.artist)}</span></div>`;
  const queueList = $('#queue-list');
  if (queueList) {
    queueList.innerHTML = state.queue.length ? state.queue.map((t, index) => `
      <div class="queue-entry" data-queue-index="${index}">
        <button type="button" class="q-item" data-queue-play="${index}" data-id="${escapeHTML(queueItemKey(t))}" data-title="${escapeHTML(t.track || t.title)}" data-artist="${escapeHTML(t.artist)}" data-img="${escapeHTML(t.img || '')}" data-duration="${Number(t.duration) || 200}" aria-label="Play ${escapeHTML(t.track || t.title)} by ${escapeHTML(t.artist)}">
          <img src="${escapeHTML(t.img || '')}" alt="" />
          <span class="q-item-copy"><strong>${escapeHTML(t.track || t.title)}</strong><span>${escapeHTML(t.artist)}</span></span>
        </button>
        <div class="queue-entry-actions" aria-label="Actions for ${escapeHTML(t.track || t.title)}">
          <button type="button" class="queue-action" data-queue-move="up" data-queue-index="${index}" aria-label="Move ${escapeHTML(t.track || t.title)} up" title="Move up" ${index === 0 ? 'disabled' : ''}>↑</button>
          <button type="button" class="queue-action" data-queue-move="down" data-queue-index="${index}" aria-label="Move ${escapeHTML(t.track || t.title)} down" title="Move down" ${index === state.queue.length - 1 ? 'disabled' : ''}>↓</button>
          <button type="button" class="queue-action queue-remove" data-queue-remove="${index}" aria-label="Remove ${escapeHTML(t.track || t.title)} from queue" title="Remove">×</button>
        </div>
      </div>
    `).join('') : '<p class="queue-empty" role="status">Your queue is empty. Choose a track to add something to the mix.</p>';
  }
  const queueSummary = $('#queue-summary');
  if (queueSummary) queueSummary.textContent = `${state.queue.length} ${state.queue.length === 1 ? 'track' : 'tracks'} waiting`;
  $('#btn-clear-queue')?.toggleAttribute('disabled', state.queue.length === 0);
  $('#np-queue-count') && ($('#np-queue-count').textContent = String(state.queue.length));
}

function resolveTrack(id) {
  if (state.current && String(state.current.id) === String(id)) return state.current;
  const recent = state.history.find(t => String(t.id) === String(id) || String(t.legacyId || '') === String(id));
  if (recent) return recent;
  const catalogueTrack = Catalog.getTrack(id);
  if (catalogueTrack) return { id: catalogueTrack.id, legacyId: catalogueTrack.legacyId, title: catalogueTrack.title, artist: Catalog.artistName(catalogueTrack.artistId), img: catalogueTrack.artworkUrl || '', duration: Math.round(catalogueTrack.durationMs / 1000), availability: catalogueTrack.availability };
  const release = DATA.releases.find(t => String(t.id) === String(id));
  if (release) return { id: release.canonicalId || release.id, title: release.title, artist: release.subtitle, img: release.img, duration: release.duration };
  return null;
}

function likedTrackItems() {
  return [...state.liked].map(id => resolveTrack(id) || likedTrackMetadata.get(String(id))).filter(Boolean);
}

function updateLikedUI() {
  $('#liked-count').textContent = state.liked.size || '';
  const list = $('#liked-list');
  const empty = $('#liked-empty');
  if (!list) return;
  const items = likedTrackItems();
  empty.style.display = items.length ? 'none' : '';
  list.innerHTML = items.map(t => `<div class="track-row" data-id="${escapeHTML(t.id)}" data-title="${escapeHTML(t.title)}" data-artist="${escapeHTML(t.artist)}" data-img="${escapeHTML(t.img || '')}" data-duration="${t.duration || 200}"><img src="${escapeHTML(t.img || '')}" alt="" /><div><strong>${escapeHTML(t.title)}</strong><span>${escapeHTML(t.artist)}</span></div></div>`).join('');
}

function loadLocal(key, fallback) { try { const value = JSON.parse(localStorage.getItem(key)); return value ?? fallback; } catch { return fallback; } }
const savedLiked = loadLocal('starmusics.liked', []);
state.liked = new Set(Array.isArray(savedLiked) ? savedLiked.filter(v => ['string', 'number'].includes(typeof v)).map(v => Catalog.getTrack(v)?.id || String(v)) : []);
const savedLikedMetadata = loadLocal('starmusics.likedTracks', []);
likedTrackMetadata = new Map(Array.isArray(savedLikedMetadata) ? savedLikedMetadata.filter(t => t && typeof t.id === 'string' && typeof t.title === 'string').map(t => [t.id, normalizePlaylistTrack(t)]).filter(([id, track]) => track) : []);
function saveLocal(key, value) { try { localStorage.setItem(key, JSON.stringify(value)); } catch { toast('Could not save in this browser'); } }
const savedPlaylists = loadLocal('starmusics.playlists', []);
let savedAlbumIds = new Set(Array.isArray(loadLocal('starmusics.savedAlbums', [])) ? loadLocal('starmusics.savedAlbums', []).filter(id => typeof id === 'string' && Catalog.getAlbum(id)).slice(0, 500) : []);
let featuredSaved = loadLocal('starmusics.savedFeatured', false) === true;
let userPlaylists = Array.isArray(savedPlaylists) ? savedPlaylists.filter(pl => pl && typeof pl.name === 'string' && Array.isArray(pl.tracks)).map((pl, i) => ({ id: typeof pl.id === 'string' ? pl.id : `local-${i}-${String(pl.name).toLowerCase().replace(/[^a-z0-9]+/g,'-')}`, name: pl.name.slice(0,60), tracks: pl.tracks.map(normalizePlaylistTrack).filter(Boolean) })) : [];
const savedProfile = loadLocal('starmusics.profile', {});
let profile = savedProfile && typeof savedProfile === 'object' && !Array.isArray(savedProfile) ? { name: typeof savedProfile.name === 'string' ? savedProfile.name.slice(0,32) : 'Listener', bio: typeof savedProfile.bio === 'string' ? savedProfile.bio.slice(0,180) : '' } : { name: 'Listener', bio: '' };
const savedComments = loadLocal('starmusics.comments', []);
let comments = Array.isArray(savedComments) ? savedComments.filter(c => c && Number.isInteger(c.topic) && c.topic >= 0 && c.topic < DATA.discussions.length && typeof c.text === 'string').map((c, index) => ({
  id: typeof c.id === 'string' && c.id ? c.id.slice(0,100) : `legacy-${index}-${Date.parse(c.created || '') || 0}`,
  topic: c.topic,
  text: c.text.slice(0,800),
  author: typeof c.author === 'string' && c.author.trim() ? c.author.trim().slice(0,32) : (profile.name || 'Listener'),
  created: typeof c.created === 'string' && Number.isFinite(Date.parse(c.created)) ? c.created : new Date().toISOString(),
  liked: c.liked === true
})) : [];
let localCommunityComments = comments.slice();
function communityTopicId(title) {
  const slug = String(title || '').normalize('NFKD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 88);
  return `topic-${slug || 'community'}`;
}
let communityTopics = DATA.discussions.map((topic, index) => ({ ...topic, id: communityTopicId(topic.title), index, description: 'A community-curated conversation about music.', isSeeded: true, commentCount: 0 }));
let communityBackendReady = false;
let communityStatus = { enabled: false, ownerClaimAvailable: false };
let communityOwnCommentCount = 0;
let activeRemoteCommentTopicId = '';
let remoteCommentLoadVersion = 0;
let moderationReports = [];
let reportingCommentId = '';

// Phase 7 account API. The prototype keeps local-only mode available when the API is offline.
const ACCOUNT_API_BASE = typeof window.STARMUSICS_API_BASE === 'string'
  ? window.STARMUSICS_API_BASE.replace(/\/$/, '')
  : (['localhost', '127.0.0.1', '::1'].includes(window.location.hostname)
      ? `${window.location.protocol}//${window.location.hostname}:8787`
      : '');
let accountUser = null;
let accountApiAvailable = false;
let accountSyncFailed = false;
let accountLibraryTimer = null;
let accountProfileTimer = null;
let accountRequestBusy = false;

async function accountRequest(route, method = 'GET', payload = undefined) {
  const url = `${ACCOUNT_API_BASE}/api${route}`;
  const options = { method, credentials: 'include', headers: { 'Accept': 'application/json' } };
  if (payload !== undefined) {
    options.headers['Content-Type'] = 'application/json';
    options.body = JSON.stringify(payload);
  }
  const response = await fetch(url, options);
  let data = {};
  try { data = await response.json(); } catch {}
  accountApiAvailable = true;
  if (!response.ok) {
    const error = new Error(data.error || `Account request failed (${response.status})`);
    error.status = response.status;
    throw error;
  }
  return data;
}

function communityRequest(route, method = 'GET', payload = undefined) {
  return accountRequest(route, method, payload);
}
function updateCommunitySourceUI() {
  const label = $('#community-source-label');
  if (label) label.textContent = communityBackendReady ? 'Shared community · server connected' : 'Local prototype · this device only';
  const badge = $('.community-source-state');
  if (badge) badge.textContent = communityBackendReady ? 'Shared' : 'Local';
  const note = $('#community-composer-note');
  if (note) note.textContent = communityBackendReady
    ? (accountUser ? 'Your comment will be visible to other STARMUSICS listeners.' : 'Sign in to join the shared conversation. Reading is available without an account.')
    : 'Prototype only: comments and reactions are saved in this browser and are not shared with other listeners.';
}
function updateCommunityAccessControls() {
  const role = accountUser?.communityRole || 'member';
  const canModerateCommunity = Boolean(accountUser && ['owner','moderator'].includes(role));
  const panel = $('#community-moderation-panel'); if (panel) panel.hidden = !canModerateCommunity;
  const createSection = $('#community-topic-create-section'); if (createSection) createSection.hidden = !(accountUser && role === 'owner');
  const newTopicButton = $('#btn-new-discussion'); if (newTopicButton) newTopicButton.hidden = !(accountUser && role === 'owner');
  const claimPanel = $('#owner-claim-panel');
  if (claimPanel) claimPanel.hidden = !(accountUser && communityStatus.ownerClaimAvailable && role !== 'owner');
  updateCommunitySourceUI();
}
function mapRemoteComment(comment, topicIndex) {
  return { id:comment.id, topic:topicIndex, topicId:comment.topicId, text:comment.text, author:comment.author || 'Listener', authorId:comment.authorId || '', created:comment.created, liked:comment.liked === true, likesCount:Number(comment.likesCount)||0, isMine:comment.isMine === true, role:comment.role || 'member', isRemote:true };
}
async function refreshRemoteCommunityMemberStats() {
  if (!communityBackendReady || !accountUser) {
    communityOwnCommentCount = communityBackendReady ? 0 : localCommunityComments.length;
    renderProfileStats();
    return;
  }
  try {
    const result = await communityRequest('/community/me');
    communityOwnCommentCount = Number(result.commentCount) || 0;
    accountUser.communityRole = result.role || accountUser.communityRole || 'member';
    if (typeof result.ownerClaimAvailable === 'boolean') communityStatus.ownerClaimAvailable = result.ownerClaimAvailable;
  } catch {}
  updateCommunityAccessControls();
  renderProfileStats();
  renderAchievements();
  if (communityBackendReady && ['owner','moderator'].includes(accountUser?.communityRole)) void loadModerationReports();
  else { moderationReports = []; renderModerationReports(); }
}
async function refreshCommunityTopics(preserveTopicId = '') {
  if (!communityBackendReady) return;
  const selectedId = preserveTopicId || communityTopics[state.selectedDiscussion]?.id;
  const result = await communityRequest('/community/topics');
  communityTopics = (result.topics || []).map((topic,index) => ({ ...topic, index, time:topic.createdAt ? formatCommentTime(topic.createdAt) : '' }));
  const found = communityTopics.findIndex(topic => topic.id === selectedId);
  state.selectedDiscussion = found >= 0 ? found : Math.min(state.selectedDiscussion, Math.max(communityTopics.length-1,0));
  renderDiscussions(); renderHomeDiscussions(); renderDiscussionPage();
}
async function loadRemoteCommentsForSelectedTopic() {
  if (!communityBackendReady) return;
  const topic = communityTopics[state.selectedDiscussion];
  if (!topic?.id || topic.id === activeRemoteCommentTopicId) return;
  const version = ++remoteCommentLoadVersion;
  const topicId = topic.id;
  try {
    const result = await communityRequest(`/community/topics/${encodeURIComponent(topicId)}/comments`);
    if (!communityBackendReady || version !== remoteCommentLoadVersion || communityTopics[state.selectedDiscussion]?.id !== topicId) return;
    comments = (result.comments || []).map(comment => mapRemoteComment(comment,state.selectedDiscussion));
    activeRemoteCommentTopicId = topicId;
    renderComments(); renderProfileStats(); renderAchievements();
  } catch {
    const note = $('#community-composer-note');
    if (note) note.textContent = 'Could not refresh shared comments. Check the connection and try selecting the topic again.';
  }
}
async function initializeCommunityBackend() {
  if (window.location.protocol === 'file:' || !ACCOUNT_API_BASE) { updateCommunitySourceUI(); return; }
  try {
    const status = await communityRequest('/community/status');
    const result = await communityRequest('/community/topics');
    communityStatus = status;
    communityBackendReady = true;
    communityTopics = (result.topics || []).map((topic,index) => ({ ...topic, index, time:topic.createdAt ? formatCommentTime(topic.createdAt) : '' }));
    if (!communityTopics.length) communityTopics = DATA.discussions.map((topic,index) => ({ ...topic, id:communityTopicId(topic.title), index, description:'A community-curated conversation about music.', commentCount:0 }));
    state.selectedDiscussion = Math.min(state.selectedDiscussion, Math.max(communityTopics.length-1,0));
    comments = [];
    activeRemoteCommentTopicId = '';
    updateCommunityAccessControls();
    renderDiscussions(); renderHomeDiscussions(); renderDiscussionPage();
    await refreshRemoteCommunityMemberStats();
  } catch {
    communityBackendReady = false;
    communityTopics = DATA.discussions.map((topic,index) => ({ ...topic, id:communityTopicId(topic.title), index, description:'A community-curated conversation about music.', commentCount:0 }));
    comments = localCommunityComments;
    activeRemoteCommentTopicId = '';
    updateCommunityAccessControls();
    renderDiscussions(); renderHomeDiscussions(); renderDiscussionPage();
  }
}
async function loadModerationReports() {
  if (!communityBackendReady || !accountUser || !['owner','moderator'].includes(accountUser.communityRole)) return;
  const target = $('#community-report-list'); if (target) target.innerHTML = '<p class="moderation-loading">Loading reports…</p>';
  try {
    const result = await communityRequest('/community/reports');
    moderationReports = Array.isArray(result.reports) ? result.reports : [];
    renderModerationReports();
  } catch (error) {
    if (target) target.innerHTML = `<p class="moderation-loading">${escapeHTML(error.message || 'Reports could not be loaded.')}</p>`;
  }
}
function renderModerationReports() {
  const target = $('#community-report-list'); if (!target) return;
  if (!moderationReports.length) { target.innerHTML = '<p class="moderation-loading">No reports to review. The queue is clear.</p>'; return; }
  target.innerHTML = moderationReports.map(report => `<article class="community-report-card"><div class="community-report-card-head"><div><strong>${escapeHTML(report.reason)}</strong><span>${escapeHTML(report.topicTitle)} · reported by ${escapeHTML(report.reporterName)}</span></div><span class="community-report-status status-${escapeHTML(report.status)}">${escapeHTML(report.status)}</span></div><p class="community-report-comment">${escapeHTML(report.commentText)}</p>${report.details ? `<p class="community-report-details">${escapeHTML(report.details)}</p>` : ''}<div class="community-report-actions"><button type="button" class="btn-secondary" data-moderate-comment="${escapeHTML(report.commentId)}" data-action="hide" ${report.commentStatus==='hidden'?'disabled':''}>Hide comment</button><button type="button" class="btn-secondary" data-moderate-comment="${escapeHTML(report.commentId)}" data-action="restore" ${report.commentStatus==='visible'?'disabled':''}>Restore comment</button><button type="button" class="btn-secondary" data-resolve-report="${escapeHTML(report.id)}" data-status="reviewed">Mark reviewed</button><button type="button" class="btn-secondary" data-resolve-report="${escapeHTML(report.id)}" data-status="closed">Close report</button></div></article>`).join('');
}
function openReportDialog(commentId) {
  if (!commentId) return;
  if (!communityBackendReady) { toast('Reporting requires the community server to be connected.'); return; }
  if (!accountUser) { openAccountDialog(); accountMessage('Sign in to report a comment.'); return; }
  reportingCommentId = commentId;
  const dialog = $('#report-dialog');
  if (dialog?.showModal) dialog.showModal(); else dialog?.setAttribute('open','');
}
function openPublicMemberProfile(memberId) {
  if (!communityBackendReady || !memberId) return;
  void (async () => {
    try {
      const result = await communityRequest(`/community/members/${encodeURIComponent(memberId)}`);
      const member = result.member; if (!member) return;
      $('#public-profile-name').textContent = member.name || 'Listener';
      $('#public-profile-avatar').textContent = profileInitials(member.name || 'Listener');
      $('#public-profile-role').textContent = member.roleLabel || 'Community member';
      $('#public-profile-comments').textContent = `${Number(member.commentCount)||0} public comments`;
      $('#public-profile-bio').textContent = member.bio || 'This listener has not added a biography yet.';
      const roleButton = $('#btn-toggle-member-moderator');
      if (roleButton) {
        roleButton.dataset.memberId = member.id;
        roleButton.dataset.memberRole = member.role || 'member';
        roleButton.hidden = !(accountUser?.communityRole === 'owner' && member.id !== accountUser.id && member.role !== 'owner');
        roleButton.textContent = member.role === 'moderator' ? 'Revoke moderator' : 'Grant moderator';
      }
      const dialog = $('#public-profile-dialog'); if (dialog?.showModal) dialog.showModal(); else dialog?.setAttribute('open','');
    } catch { toast('Member profile could not be loaded.'); }
  })();
}

function accountMessage(message, kind = '') {
  const node = $('#account-message');
  if (!node) return;
  node.textContent = message;
  node.classList.toggle('is-error', kind === 'error');
  node.classList.toggle('is-success', kind === 'success');
}

function refreshAccountUI(message = '') {
  const signedIn = Boolean(accountUser);
  if ($('#account-form')) $('#account-form').hidden = signedIn;
  if ($('#account-signed-in')) $('#account-signed-in').hidden = !signedIn;
  if ($('#account-signed-in-email')) $('#account-signed-in-email').textContent = accountUser?.email || '';
  const retryButton = $('#btn-account-retry-sync');
  if (retryButton) retryButton.hidden = !signedIn || !accountSyncFailed;
  const status = $('#account-profile-status');
  if (status) status.textContent = signedIn ? (accountSyncFailed ? `Sync issue · ${accountUser.email}` : `Connected account · ${accountUser.email}`) : (accountApiAvailable ? 'Local profile · sign in to sync' : 'Local profile · this device only');
  $('#account-profile-strip')?.classList.toggle('is-connected', signedIn);
  const button = $('#btn-profile');
  if (button) {
    button.title = signedIn ? 'Profile' : 'Sign in or create an account';
    button.setAttribute('aria-label', signedIn ? 'Profile' : 'Sign in or create an account');
  }
  if ($('#account-sync-status')) $('#account-sync-status').textContent = message || (signedIn ? 'Profile and library changes are saved to your account.' : 'You are signed out. Your local prototype data remains on this device.');
  updateCommunityAccessControls();
}

function openAccountDialog() {
  const dialog = $('#account-dialog');
  if (!dialog) return;
  refreshAccountUI();
  accountMessage('');
  if (typeof dialog.showModal === 'function') {
    if (!dialog.open) dialog.showModal();
  } else dialog.setAttribute('open', '');
}

function remoteLibraryPayload() {
  return {
    likedTrackIds: [...state.liked].map(String),
    likedTracks: likedTrackItems().map(track => ({ id: String(track.id), title: track.title, artist: track.artist, img: track.img || '', duration: track.duration || 200 })),
    savedAlbumIds: [...savedAlbumIds],
    playlistIds: [...userPlaylists.map(pl => pl.id), ...(featuredSaved ? ['featured-persian-trap'] : [])],
    playlists: userPlaylists.map(pl => ({ id: pl.id, name: pl.name, trackIds: pl.tracks.map(track => String(track.id)), tracks: pl.tracks.map(track => ({ id: String(track.id), title: track.title, artist: track.artist, img: track.img || '', duration: track.duration || 200 })) }))
  };
}

async function persistAccountLibrary(showError = false) {
  if (!accountUser) return false;
  try {
    const result = await accountRequest('/library', 'PUT', remoteLibraryPayload());
    accountUser.library = result.library;
    accountSyncFailed = false;
    refreshAccountUI('Library synced to your account.');
    return true;
  } catch (error) {
    accountSyncFailed = true;
    refreshAccountUI('Sync failed. Your latest changes remain in this browser.');
    if (showError) toast(`Could not sync library: ${error.message}`);
    return false;
  }
}

async function persistAccountProfile(showError = false) {
  if (!accountUser) return false;
  try {
    const result = await accountRequest('/profile', 'PUT', profile);
    accountUser.profile = result.profile;
    accountSyncFailed = false;
    refreshAccountUI('Profile synced to your account.');
    return true;
  } catch (error) {
    accountSyncFailed = true;
    refreshAccountUI('Sync failed. Your latest changes remain in this browser.');
    if (showError) toast(`Could not sync profile: ${error.message}`);
    return false;
  }
}

function scheduleAccountLibrarySync() {
  if (!accountUser) return;
  clearTimeout(accountLibraryTimer);
  accountLibraryTimer = setTimeout(() => { void persistAccountLibrary(); }, 350);
}
function scheduleAccountProfileSync() {
  if (!accountUser) return;
  clearTimeout(accountProfileTimer);
  accountProfileTimer = setTimeout(() => { void persistAccountProfile(); }, 350);
}

function applyRemoteUser(user) {
  if (!user || typeof user !== 'object') return;
  accountUser = user;
  state.selectedPlaylistIndex = null;
  accountSyncFailed = false;
  const remoteProfile = user.profile && typeof user.profile === 'object' ? user.profile : {};
  profile = {
    name: typeof remoteProfile.name === 'string' ? remoteProfile.name.slice(0, 32) : 'Listener',
    bio: typeof remoteProfile.bio === 'string' ? remoteProfile.bio.slice(0, 180) : ''
  };
  const library = user.library && typeof user.library === 'object' ? user.library : {};
  savedAlbumIds = new Set(Array.isArray(library.savedAlbumIds) ? library.savedAlbumIds.filter(id => typeof id === 'string' && Catalog.getAlbum(id)).slice(0, 500) : []);
  saveLocal('starmusics.savedAlbums', [...savedAlbumIds]);
  state.liked = new Set(Array.isArray(library.likedTrackIds) ? library.likedTrackIds.map(id => Catalog.getTrack(id)?.id || String(id)).filter(id => id.length <= 120) : []);
  const remoteLikedTracks = Array.isArray(library.likedTracks) ? library.likedTracks.map(normalizePlaylistTrack).filter(Boolean) : [];
  likedTrackMetadata = new Map(remoteLikedTracks.map(track => [String(track.id), track]));
  saveLocal('starmusics.likedTracks', remoteLikedTracks);
  userPlaylists = Array.isArray(library.playlists) ? library.playlists.map((pl, i) => ({
    id: typeof pl.id === 'string' && pl.id ? pl.id : `remote-${i}`,
    name: String(pl.name || 'Playlist').slice(0, 60),
    tracks: (Array.isArray(pl.tracks) && pl.tracks.length ? pl.tracks.map(normalizePlaylistTrack).filter(Boolean) : (Array.isArray(pl.trackIds) ? pl.trackIds : []).map(id => resolveTrack(id)).filter(Boolean))
  })) : [];
  featuredSaved = Array.isArray(library.playlistIds) && library.playlistIds.includes('featured-persian-trap');
  saveLocal('starmusics.profile', profile);
  saveLocal('starmusics.liked', [...state.liked]);
  saveLocal('starmusics.playlists', userPlaylists);
  saveLocal('starmusics.savedFeatured', featuredSaved);
  if ($('#profile-name')) $('#profile-name').textContent = profile.name || 'Listener';
  if ($('#profile-display-name')) $('#profile-display-name').value = profile.name || '';
  if ($('#profile-bio')) $('#profile-bio').value = profile.bio || '';
  updateProfileCount();
  updatePlayerUI(); updateLikedUI(); renderLibrary(); renderUserPlaylists(); renderPlaylistPage(); renderAchievements();
  refreshAccountUI('Account connected. Changes will sync to this account.');
  updateCommunityAccessControls();
  if (communityBackendReady) void refreshRemoteCommunityMemberStats();
}

async function initializeAccountSession() {
  if (window.location.protocol === 'file:' || !ACCOUNT_API_BASE) {
    refreshAccountUI();
    return;
  }
  try {
    const result = await accountRequest('/me');
    if (result.user) applyRemoteUser(result.user);
    else refreshAccountUI();
  } catch (error) {
    if (error.status === 401) {
      refreshAccountUI();
      return;
    }
    refreshAccountUI('Account API unavailable. The site is running in local-only mode.');
  }
}

async function submitAccountForm(mode) {
  const form = $('#account-form');
  if (!form || accountRequestBusy || !form.reportValidity()) return;
  const email = $('#account-email').value.trim();
  const password = $('#account-password').value;
  $('#account-password').setAttribute('autocomplete', mode === 'register' ? 'new-password' : 'current-password');
  accountRequestBusy = true;
  const loginButton = $('#btn-account-login');
  const registerButton = $('#btn-account-register');
  if (loginButton) loginButton.disabled = true;
  if (registerButton) registerButton.disabled = true;
  accountMessage(mode === 'register' ? 'Creating account…' : 'Signing in…');
  try {
    const result = await accountRequest(mode === 'register' ? '/register' : '/login', 'POST', { email, password });
    if (mode === 'register') {
      accountUser = result.user;
      accountSyncFailed = false;
      // A newly created account can adopt this device's existing prototype collection.
      const profileSaved = await persistAccountProfile();
      const librarySaved = await persistAccountLibrary();
      if (!profileSaved || !librarySaved) {
        accountSyncFailed = true;
        accountMessage('Account created, but data migration is incomplete. Use Retry sync below.', 'error');
        refreshAccountUI('Account created; library migration needs a retry.');
        $('#account-password').value = '';
        return;
      }
      accountMessage('Account created. Your current profile and library were copied into it.', 'success');
    } else {
      applyRemoteUser(result.user);
      accountSyncFailed = false;
      accountMessage('Signed in. Your account profile and library have been loaded.', 'success');
    }
    $('#account-password').value = '';
    refreshAccountUI(mode === 'register' ? 'Account created and connected.' : 'Signed in and connected.');
    window.setTimeout(() => { const dialog = $('#account-dialog'); if (dialog?.open) dialog.close(); }, 350);
    toast(mode === 'register' ? 'STARMUSICS account created' : 'Signed in to STARMUSICS');
  } catch (error) {
    const copy = error.status === 401 ? 'Email or password is incorrect.' : error.status === 409 ? 'An account with these details could not be created.' : error.status === 400 ? error.message : 'The account service is unavailable. Check that the API is running.';
    accountMessage(copy, 'error');
  } finally {
    accountRequestBusy = false;
    if (loginButton) loginButton.disabled = false;
    if (registerButton) registerButton.disabled = false;
  }
}

async function signOutAccount() {
  if (!accountUser) return;
  try { await accountRequest('/logout', 'POST', {}); }
  catch {
    accountMessage('Could not reach the account service. Reconnect before signing out so the server session can be revoked.', 'error');
    refreshAccountUI('Sign-out could not be confirmed. Your session is still active.');
    return;
  }
  accountUser = null;
  // Remove account-owned cached data from this browser after the server revokes its session.
  state.liked.clear(); likedTrackMetadata.clear(); userPlaylists = []; profile = { name: 'Listener', bio: '' }; featuredSaved = false; savedAlbumIds.clear();
  state.selectedPlaylistIndex = null;
  saveLocal('starmusics.liked', []); saveLocal('starmusics.likedTracks', []); saveLocal('starmusics.playlists', []);
  saveLocal('starmusics.profile', profile); saveLocal('starmusics.savedFeatured', false); saveLocal('starmusics.savedAlbums', []);
  if ($('#profile-name')) $('#profile-name').textContent = profile.name;
  if ($('#profile-display-name')) $('#profile-display-name').value = profile.name;
  if ($('#profile-bio')) $('#profile-bio').value = '';
  renderLibrary(); updateLikedUI(); renderUserPlaylists(); renderPlaylistPage(); renderAchievements(); updateProfileCount();
  if (communityBackendReady) { activeRemoteCommentTopicId=''; comments=[]; void refreshCommunityTopics(communityTopics[state.selectedDiscussion]?.id || ''); void refreshRemoteCommunityMemberStats(); } else { comments=localCommunityComments; communityOwnCommentCount=localCommunityComments.length; }
  updateCommunityAccessControls();
  refreshAccountUI('Signed out. Account-owned cached data was cleared from this browser.');
  $('#account-dialog')?.close?.();
  toast('Signed out of STARMUSICS');
}

function escapeHTML(value) { return String(value).replace(/[&<>"']/g, ch => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch])); }

function catalogTracks() {
  return Catalog.getTracks().map(track => ({
    id: track.id, legacyId: track.legacyId, title: track.title, artist: track.artist,
    img: track.artworkUrl || track.img || '', duration: track.duration || 200,
    genreIds: track.genreIds || [], availability: track.availability, rightsStatus: track.rights?.status || 'unverified'
  }));
}
function normalizePlaylistTrack(track) {
  const rawId = track && typeof track === 'object' ? (track.id ?? track.legacyId ?? track.title ?? track.track) : track;
  const catalogueTrack = (typeof rawId === 'string' || typeof rawId === 'number') ? Catalog.getTrack(rawId) : null;
  if (catalogueTrack) {
    return { id: catalogueTrack.id, title: catalogueTrack.title.slice(0,120), artist: Catalog.artistName(catalogueTrack.artistId).slice(0,120), img: catalogueTrack.artworkUrl || '', duration: Math.max(1, Math.round(catalogueTrack.durationMs / 1000)) };
  }
  if (track && typeof track === 'object') {
    const title = typeof track.title === 'string' ? track.title : (typeof track.track === 'string' ? track.track : '');
    const artist = typeof track.artist === 'string' ? track.artist : (typeof track.subtitle === 'string' ? track.subtitle : 'Unknown artist');
    if (!title) return null;
    return { id: String(track.id || title), title: title.slice(0,120), artist: artist.slice(0,120), img: typeof track.img === 'string' ? track.img : '', duration: Math.max(1, Number(track.duration) || 200) };
  }
  return null;
}
function savePlaylists() { saveLocal('starmusics.playlists', userPlaylists); scheduleAccountLibrarySync(); }
function renderUserPlaylists() {
  const el = $('#user-playlists-row'); if (!el) return;
  if (!userPlaylists.length) { el.innerHTML = '<p class="page-description">No playlists yet. Create one to start your personal library.</p>'; return; }
  el.innerHTML = userPlaylists.map((pl, i) => `<article class="card user-playlist-card" data-open-playlist="${i}" tabindex="0" role="button" aria-label="Open playlist ${escapeHTML(pl.name)}"><div class="card-cover" style="background-image:url('${DATA.playlists[i % DATA.playlists.length].img}')"><span class="playlist-card-play">▶</span></div><h3>${escapeHTML(pl.name)}</h3><p>Personal playlist · ${pl.tracks.length} ${pl.tracks.length === 1 ? 'track' : 'tracks'}</p><button class="text-action" data-delete-playlist="${i}" type="button">Delete</button></article>`).join('');
}
function renderPlaylistCards(container) {
  if (!container) return;
  container.innerHTML = userPlaylists.length ? userPlaylists.map((pl, i) => `<article class="card user-playlist-card" data-open-playlist="${i}" tabindex="0" role="button" aria-label="Open playlist ${escapeHTML(pl.name)}"><div class="card-cover" style="background-image:url('${DATA.playlists[i % DATA.playlists.length].img}')"><span class="playlist-card-play">▶</span></div><h3>${escapeHTML(pl.name)}</h3><p>${pl.tracks.length} ${pl.tracks.length === 1 ? 'track' : 'tracks'}</p></article>`).join('') : '<p class="page-description">No playlists yet. Create one to begin.</p>';
}
function renderPlaylistDetail() {
  const section = $('#playlist-detail-section'); if (!section) return;
  const index = state.selectedPlaylistIndex;
  if (index == null || !userPlaylists[index]) { section.hidden = true; return; }
  const playlist = userPlaylists[index]; section.hidden = false;
  $('#playlist-detail-title').textContent = playlist.name;
  $('#playlist-detail-meta').textContent = `${playlist.tracks.length} ${playlist.tracks.length === 1 ? 'track' : 'tracks'} · Saved on this device`;
  $('#playlist-track-list').innerHTML = playlist.tracks.map((track, trackIndex) => `<div class="track-row playlist-track-row" data-id="${escapeHTML(track.id)}" data-title="${escapeHTML(track.title)}" data-artist="${escapeHTML(track.artist)}" data-img="${escapeHTML(track.img)}" data-duration="${track.duration}"><img src="${escapeHTML(track.img)}" alt="" /><div class="playlist-track-meta"><strong>${escapeHTML(track.title)}</strong><span>${escapeHTML(track.artist)}</span></div><button class="text-action remove-playlist-track" type="button" data-remove-playlist-track="${trackIndex}" aria-label="Remove ${escapeHTML(track.title)}">Remove</button></div>`).join('');
  $('#playlist-tracks-empty').hidden = playlist.tracks.length > 0;
  const existing = new Set(playlist.tracks.map(t => String(t.id)));
  $('#playlist-add-track-list').innerHTML = catalogTracks().map(track => `<div class="track-row add-track-row"><img src="${escapeHTML(track.img)}" alt="" /><div class="playlist-track-meta"><strong>${escapeHTML(track.title)}</strong><span>${escapeHTML(track.artist)}</span></div><button class="text-action" type="button" data-add-playlist-track="${escapeHTML(track.id)}" ${existing.has(String(track.id)) ? 'disabled' : ''}>${existing.has(String(track.id)) ? 'Added' : '＋ Add'}</button></div>`).join('');
}
function openPlaylist(index) {
  if (!userPlaylists[index]) return;
  state.selectedPlaylistIndex = index; renderPlaylistDetail();
  $('#playlist-detail-section')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
}
function updateProfileCount() {
 const count = $('.bio-character-count');
 if (count) count.textContent = `${($('#profile-bio')?.value || '').length}/180`;
}
function profileInitials(name = profile.name || 'Listener') {
  const parts = String(name).trim().split(/\s+/).filter(Boolean);
  const first = Array.from(parts[0] || 'L')[0] || 'L';
  const second = parts.length > 1 ? Array.from(parts[parts.length - 1])[0] : '';
  return `${first}${second}`.toLocaleUpperCase().slice(0, 2);
}
function renderProfileStats() {
  const values = {
    'profile-stat-liked': state.liked.size,
    'profile-stat-playlists': userPlaylists.length,
    'profile-stat-comments': communityBackendReady ? communityOwnCommentCount : localCommunityComments.length,
    'profile-stat-albums': savedAlbumIds.size
  };
  for (const [id, value] of Object.entries(values)) { const el = $(`#${id}`); if (el) el.textContent = String(value); }
  const avatar = $('#profile-avatar-initials'); if (avatar) avatar.textContent = profileInitials();
  const composerAvatar = $('#comment-composer-avatar'); if (composerAvatar) composerAvatar.textContent = profileInitials();
}
function renderAchievements() {
 const el = $('#achievement-grid');
 renderProfileStats();
 if (!el) return;
 const liked = state.liked.size;
 const myComments = communityBackendReady ? communityOwnCommentCount : localCommunityComments.length;
 const items = [
  {icon:'✦',title:'First listen',desc:state.hasPlayedAudio ? 'You played audio for the first time' : 'Listen to audio for the first time',earned:state.hasPlayedAudio===true},
  {icon:'♡',title:'Curator',desc:`${liked}/5 tracks liked`,earned:liked>=5},
  {icon:'☷',title:'Collector',desc:`${userPlaylists.length}/3 playlists created`,earned:userPlaylists.length>=3},
  {icon:'↗',title:'Conversation starter',desc:myComments ? 'You have joined a music conversation' : 'Post your first thoughtful comment',earned:myComments>=1},
  {icon:'◌',title:'Community regular',desc:`${myComments}/5 comments contributed`,earned:myComments>=5},
  {icon:'◎',title:'Album archivist',desc:`${savedAlbumIds.size}/3 albums saved`,earned:savedAlbumIds.size>=3}
 ];
 el.innerHTML = items.map(a=>`<article class="achievement ${a.earned?'is-earned':'is-locked'}"><div class="medal" aria-hidden="true">${a.earned?a.icon:'○'}</div><strong>${a.title}</strong><span>${a.desc}</span><small>${a.earned?'Earned':'In progress'}</small></article>`).join('');
}
function formatCommentTime(value) {
  const date = new Date(value);
  if (!Number.isFinite(date.getTime())) return 'Recently';
  try { return new Intl.DateTimeFormat(undefined, { dateStyle: 'medium', timeStyle: 'short' }).format(date); }
  catch { return date.toLocaleString(); }
}
function renderComments() {
 const el = $('#comments-list'); if (!el) return;
 const rows = comments.filter(comment => comment.topic === state.selectedDiscussion).slice().sort((a,b) => {
   const diff = Date.parse(a.created) - Date.parse(b.created);
   return commentSort === 'newest' ? -diff : diff;
 });
 const summary = $('#discussion-reply-summary');
 if (summary) summary.textContent = `${rows.length} ${communityBackendReady ? 'public' : 'local'} ${rows.length === 1 ? 'comment' : 'comments'}`;
 const empty = communityBackendReady
   ? '<div class="discussion-empty-state"><span aria-hidden="true">✧</span><strong>Start the conversation</strong><p>No comments have been posted to this topic yet. Be the first to share a thoughtful perspective.</p></div>'
   : '<div class="discussion-empty-state"><span aria-hidden="true">✧</span><strong>Start the conversation</strong><p>Comments saved in this prototype stay on this device until the community server is connected.</p></div>';
 el.innerHTML = rows.length ? rows.map(comment => {
   const author = escapeHTML(comment.author || 'Listener');
   const authorControl = comment.authorId && comment.isRemote
     ? `<button type="button" class="comment-author-button" data-public-profile="${escapeHTML(comment.authorId)}">${author}</button>`
     : `<strong>${author}</strong>`;
   const likeCount = Math.max(0, Number(comment.likesCount) || 0);
   const likeText = communityBackendReady ? `Like · ${likeCount}` : (comment.liked ? 'Liked' : 'Like');
   const likeButton = `<button type="button" class="comment-like-btn ${comment.liked?'is-liked':''}" data-like-comment="${escapeHTML(comment.id)}" aria-pressed="${String(comment.liked === true)}" aria-label="${comment.liked?'Unlike':'Like'} comment by ${author}"><span aria-hidden="true">${comment.liked?'♥':'♡'}</span><span>${escapeHTML(likeText)}</span></button>`;
   const reportButton = comment.isRemote && !comment.isMine ? `<button type="button" class="comment-report-btn" data-report-comment="${escapeHTML(comment.id)}">Report</button>` : '';
   const stateLabel = comment.isRemote ? 'Shared comment' : 'Local comment';
   return `<article class="comment-item" data-comment-id="${escapeHTML(comment.id)}"><div class="comment-author-avatar" aria-hidden="true">${escapeHTML(profileInitials(comment.author || 'Listener'))}</div><div class="comment-content"><header class="comment-author-line">${authorControl}<time datetime="${escapeHTML(comment.created)}">${escapeHTML(formatCommentTime(comment.created))}</time></header><p class="comment-body">${escapeHTML(comment.text)}</p><footer class="comment-actions">${likeButton}${reportButton}<span class="comment-local-mark">${stateLabel}</span></footer></div></article>`;
 }).join('') : empty;
}
function renderDiscussionPage() {
 const el = $('#discussion-page-list'); if (!el) return;
 const query = discussionSearchQuery.trim().toLocaleLowerCase();
 let topics = communityTopics.map((topic,index) => ({ ...topic, index, time: topic.time || (topic.createdAt ? formatCommentTime(topic.createdAt) : 'Curated topic') }));
 if (query) topics = topics.filter(topic => `${topic.title} ${topic.description || ''} ${topic.time || ''}`.toLocaleLowerCase().includes(query));
 if (discussionSort === 'active') topics.sort((a,b) => discussionCount(b.index) - discussionCount(a.index));
 else if (discussionSort === 'latest') topics.sort((a,b) => Date.parse(b.createdAt || 0) - Date.parse(a.createdAt || 0));
 el.innerHTML = topics.map(topic => `<li class="${topic.index===state.selectedDiscussion?'selected':''}" data-topic="${topic.index}" tabindex="0" role="button" aria-current="${topic.index===state.selectedDiscussion?'true':'false'}"><span class="topic-index" aria-hidden="true">${String(topic.index+1).padStart(2,'0')}</span><span class="topic-main"><strong>${escapeHTML(topic.title)}</strong><span class="topic-meta"><span>${discussionCount(topic.index)} ${discussionCount(topic.index) === 1 ? 'comment' : 'comments'}</span><span aria-hidden="true">·</span><span>${escapeHTML(topic.time)}</span></span></span><span class="topic-chevron" aria-hidden="true">›</span></li>`).join('');
 const resultCount = $('#discussion-result-count'); if (resultCount) resultCount.textContent = `${topics.length} ${topics.length === 1 ? 'topic' : 'topics'}`;
 const empty = $('#discussion-list-empty'); if (empty) empty.hidden = topics.length > 0;
 const statTopics = $('#discussion-stat-topics'); if (statTopics) statTopics.textContent = String(communityTopics.length);
 const statReplies = $('#discussion-stat-replies'); if (statReplies) statReplies.textContent = String(communityTopics.reduce((sum,topic,index) => sum + discussionCount(index), 0));
 const selected = communityTopics[state.selectedDiscussion];
 const title = $('#discussion-thread-title'); if (title && selected) title.textContent = selected.title;
 const description = $('#discussion-thread-description');
 if (description) description.textContent = selected?.description || (selected ? 'Join the conversation with your own perspective. Keep replies constructive and music-focused.' : 'Select a topic to read and join the discussion.');
 const search = $('#discussion-search'); if (search && search.value !== discussionSearchQuery) search.value = discussionSearchQuery;
 $$('[data-discussion-sort]').forEach(button => button.setAttribute('aria-pressed', String(button.dataset.discussionSort === discussionSort)));
 $$('[data-comment-sort]').forEach(button => button.setAttribute('aria-pressed', String(button.dataset.commentSort === commentSort)));
 renderComments();
 if (communityBackendReady) void loadRemoteCommentsForSelectedTopic();
}
function renderRecent() {
  const list = $('#recent-list');
  const empty = $('#recent-empty');
  if (!list || !empty) return;
  empty.hidden = state.history.length > 0;
  list.innerHTML = state.history.map(t => `<div class="track-row" data-title="${escapeHTML(t.title)}" data-artist="${escapeHTML(t.artist)}" data-img="${escapeHTML(t.img || '')}" data-duration="${t.duration || 200}"><img src="${escapeHTML(t.img || '')}" alt="" /><div><strong>${escapeHTML(t.title)}</strong><span>${escapeHTML(t.artist)}</span></div></div>`).join('');
}
function renderPlaylistPage() {
  renderPlaylistCards($('#playlists-page-row'));
  const discover = $('#playlists-discover-row');
  if (discover) renderCards(discover, DATA.playlists);
  const discoveryPlaylists = $('#discovery-playlists-row');
  if (discoveryPlaylists) renderCards(discoveryPlaylists, DATA.playlists);
  renderPlaylistDetail();
}

function renderAlbumPage() {
  const el = $('#albums-page-row');
  if (!el) return;
  renderCards(el, DATA.albums, true);
}

function createPlaylist() {
 const name = prompt('Name your playlist');
 if (!name || !name.trim()) return;
 const cleanName = name.trim().slice(0,60);
 if (userPlaylists.some(pl => pl.name.toLowerCase() === cleanName.toLowerCase())) { toast('A playlist with that name already exists'); return; }
 userPlaylists.push({ id: `playlist-${Date.now()}-${Math.random().toString(36).slice(2,7)}`, name: cleanName, tracks: [] });
 savePlaylists(); state.selectedPlaylistIndex = userPlaylists.length - 1;
 renderUserPlaylists(); renderPlaylistPage(); renderLibrary(); renderAchievements(); toast('Playlist created');
}
function switchView(name) {
  $$('.view').forEach(v => v.classList.remove('active'));
  const target = $(`#view-${name}`) || $('#view-home');
  target.classList.add('active');
  $$('.nav-item').forEach(n => {
    const isCurrent = n.dataset.view === name;
    n.classList.toggle('active', isCurrent);
    if (isCurrent) n.setAttribute('aria-current', 'page');
    else n.removeAttribute('aria-current');
  });
  $$('.mobile-nav-item').forEach(n => {
    const isCurrent = n.dataset.view === name;
    n.classList.toggle('active', isCurrent);
    if (isCurrent) n.setAttribute('aria-current', 'page');
    else n.removeAttribute('aria-current');
  });
  if (name === 'liked') updateLikedUI();
  if (name === 'library') renderLibrary();
  if (name === 'explore') renderGenres();
  if (name === 'playlists') renderUserPlaylists();
  if (name === 'profile') {
     $('#profile-name').textContent = profile.name || 'Listener';
     if ($('#profile-display-name')) $('#profile-display-name').value = profile.name || '';
     $('#profile-bio').value = profile.bio || '';
     updateProfileCount();
     renderAchievements();
     renderProfileStats();
     renderUserPlaylists();
   }
  if (name === 'discussions') renderDiscussionPage();
  if (name === 'playlists') { renderUserPlaylists(); renderPlaylistPage(); }
  if (name === 'artists') renderArtistsPage();
  if (name === 'albums') renderAlbumPage();
  if (name === 'genres') { renderGenres(); const g=$('#genres-page-grid'); if(g) g.innerHTML=DATA.genres.map(n=>`<button class="genre-chip" type="button" data-open-genre="${escapeHTML(n)}">${escapeHTML(n)}</button>`).join(''); }
  if (name === 'recent') renderRecent();
  applyLanguage(storedLanguage(),false);
}

function search(q) {
  const results = $('#search-popover');
  const list = $('#search-list');
  const hint = $('#search-hint');
  const discoverySection = $('#discovery-results-section');
  const discoveryResults = $('#discovery-results');
  const discoveryCount = $('#discovery-results-count');
  const discoveryTitle = $('#discovery-results-title');
  const filterBar = $('#discovery-filter-bar');
  const query = String(q ?? '').trim();
  if (!query) {
    if (hint) hint.hidden = false;
    if (list) list.innerHTML = '';
    if (discoverySection) discoverySection.hidden = true;
    if (discoveryResults) discoveryResults.innerHTML = '';
    activeSearchFilter = 'all';
    lastSearchQuery = '';
    return [];
  }

  if (query.toLocaleLowerCase() !== lastSearchQuery.toLocaleLowerCase()) activeSearchFilter = 'all';
  lastSearchQuery = query;
  if (results) results.hidden = false;
  if (discoverySection) discoverySection.hidden = false;
  if (discoveryTitle) discoveryTitle.textContent = searchCopy('resultsFor', query);
  if (hint) hint.hidden = true;

  const ql = query.toLocaleLowerCase();
  const hits = Catalog.search(query);
  userPlaylists.forEach((p, index) => {
    if (p.name.toLocaleLowerCase().includes(ql)) hits.push({ id: p.id, title: p.name, subtitle: `Your playlist · ${p.tracks.length} ${p.tracks.length === 1 ? 'track' : 'tracks'}`, trackCount: p.tracks.length, img: DATA.playlists[index % DATA.playlists.length]?.img, type: 'Playlist', source: 'personal', index });
  });

  const itemMarkup = h => {
    const action = h.type === 'Artist' ? `data-open-artist="${escapeHTML(h.title)}"`
      : h.type === 'Album' ? `data-open-album="${escapeHTML(h.title)}"`
      : h.type === 'Genre' ? `data-open-genre="${escapeHTML(h.title)}"`
      : h.type === 'Playlist' && h.source === 'personal' ? `data-open-personal-playlist="${Number(h.index)}"`
      : h.type === 'Playlist' ? `data-open-curated-playlist="${escapeHTML(h.title)}"` : '';
    const fallbackImg = 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=80&h=80&fit=crop';
    const typeLabel = SEARCH_COPY[activeLanguage]?.types?.[h.type] || h.type;
    return `<button type="button" class="search-item" data-search-type="${escapeHTML(h.type)}" data-id="${escapeHTML(h.id || h.title)}" data-title="${escapeHTML(h.title)}" data-artist="${escapeHTML(h.subtitle)}" data-img="${escapeHTML(h.img || '')}" data-duration="${h.duration || 200}" ${action}>
      <img src="${escapeHTML(h.img || fallbackImg)}" alt="" loading="lazy" />
      <span class="search-item-copy"><strong>${escapeHTML(h.title)}</strong><span>${escapeHTML(typeLabel)} · ${escapeHTML(searchSubtitle(h))}</span></span><i class="las la-arrow-up-right-from-square" aria-hidden="true"></i>
    </button>`;
  };

  if (list) list.innerHTML = hits.length ? hits.slice(0, 8).map(itemMarkup).join('') : `<p class="search-hint">${escapeHTML(searchCopy('noResults'))}</p>`;
  if (filterBar) {
    const counts = { all: hits.length };
    ['track','artist','album','playlist','genre'].forEach(type => { counts[type] = hits.filter(h => h.type.toLowerCase() === type).length; });
    filterBar.querySelectorAll('[data-search-filter]').forEach(button => {
      const type = button.dataset.searchFilter;
      const count = counts[type] ?? 0;
      const countNode = button.querySelector('[data-filter-count]');
      if (countNode) countNode.textContent = String(count);
      button.setAttribute('aria-pressed', String(type === activeSearchFilter));
      button.classList.toggle('active', type === activeSearchFilter);
      button.disabled = type !== 'all' && count === 0;
    });
  }
  const filteredHits = activeSearchFilter === 'all' ? hits : hits.filter(h => h.type.toLowerCase() === activeSearchFilter);
  if (discoveryResults) {
    if (!hits.length) discoveryResults.innerHTML = `<div class="discovery-empty"><span class="discovery-empty-mark">⌕</span><strong>${escapeHTML(searchCopy('noMatches'))}</strong><p>${escapeHTML(searchCopy('tryAnother'))}</p></div>`;
    else discoveryResults.innerHTML = filteredHits.slice(0, 30).map(itemMarkup).join('');
  }
  if (discoveryCount) {
    if (!hits.length) discoveryCount.textContent = searchCopy('zero');
    else if (activeSearchFilter === 'all') discoveryCount.textContent = searchCopy('allCount', hits.length);
    else discoveryCount.textContent = searchCopy('filteredCount', filteredHits.length, hits.length);
  }
  return hits;
}

// Init
function initializeMediaSession() {
  if (!('mediaSession' in navigator)) return;
  const handlers = {
    play: () => togglePlay(),
    pause: () => { const audio = $('#audio-engine'); if (audio && !audio.paused) audio.pause(); },
    previoustrack: () => prevTrack(),
    nexttrack: () => nextTrack(),
    seekbackward: details => { const audio = $('#audio-engine'); if (audio?.src && Number.isFinite(audio.duration)) audio.currentTime = Math.max(0, audio.currentTime - (details.seekOffset || 10)); },
    seekforward: details => { const audio = $('#audio-engine'); if (audio?.src && Number.isFinite(audio.duration)) audio.currentTime = Math.min(audio.duration, audio.currentTime + (details.seekOffset || 10)); },
    seekto: details => { const audio = $('#audio-engine'); if (audio?.src && Number.isFinite(audio.duration) && Number.isFinite(details.seekTime)) audio.currentTime = Math.max(0, Math.min(audio.duration, details.seekTime)); }
  };
  for (const [action, handler] of Object.entries(handlers)) {
    try { navigator.mediaSession.setActionHandler(action, handler); } catch { /* Unsupported media action on this browser. */ }
  }
}

function syncMediaSession(track, audio) {
  if (!('mediaSession' in navigator) || !track) return;
  try {
    const trackKey = String(track.id ?? `${track.title || ''}::${track.artist || ''}`);
    if (state.mediaSessionTrackId !== trackKey && 'MediaMetadata' in window) {
      navigator.mediaSession.metadata = new MediaMetadata({
        title: track.title || 'STARMUSICS',
        artist: track.artist || 'Unknown artist',
        album: 'STARMUSICS',
        artwork: track.img ? [{ src: track.img, sizes: '512x512' }] : []
      });
      state.mediaSessionTrackId = trackKey;
    }
    navigator.mediaSession.playbackState = audio?.src && !audio.paused ? 'playing' : 'paused';
    if (audio?.src && Number.isFinite(audio.duration) && audio.duration > 0 && typeof navigator.mediaSession.setPositionState === 'function') {
      navigator.mediaSession.setPositionState({ duration: audio.duration, playbackRate: audio.playbackRate || 1, position: Math.min(audio.currentTime || 0, audio.duration) });
    }
  } catch { /* Media Session is progressive enhancement; playback must still work without it. */ }
}

async function exportTrackCard() {
  const track = state.current;
  if (!track) { toast('Choose a track first'); return; }
  const themeName = $('#lyrics-card-theme')?.value || 'glass';
  const themes = {
    glass: { top: '#f7f9fc', bottom: '#dce5f2', ink: '#202a3b', accent: '#94a9c7', label: 'CLEAR GLASS' },
    afterglow: { top: '#f8cbbd', bottom: '#c9d9f5', ink: '#252c43', accent: '#8e9cce', label: 'AFTERGLOW' },
    paper: { top: '#fbf5e9', bottom: '#e4ded0', ink: '#292823', accent: '#b4a58a', label: 'PAPER' }
  };
  const theme = themes[themeName] || themes.glass;
  try {
    const canvas = document.createElement('canvas'); canvas.width = 1080; canvas.height = 1080;
    const ctx = canvas.getContext('2d'); if (!ctx) throw new Error('Canvas unavailable');
    const gradient = ctx.createLinearGradient(80, 0, 980, 1080); gradient.addColorStop(0, theme.top); gradient.addColorStop(1, theme.bottom);
    ctx.fillStyle = gradient; ctx.fillRect(0, 0, 1080, 1080);
    ctx.fillStyle = `${theme.accent}35`; ctx.beginPath(); ctx.arc(840, 220, 240, 0, Math.PI * 2); ctx.fill();
    ctx.strokeStyle = `${theme.accent}75`; ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(840, 220, 292, 0, Math.PI * 2); ctx.stroke();
    ctx.fillStyle = `${theme.accent}22`; ctx.beginPath(); ctx.arc(220, 850, 290, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = theme.ink; ctx.textAlign = 'left'; ctx.font = '600 22px Arial, sans-serif'; ctx.letterSpacing = '6px';
    ctx.fillText('✦ STARMUSICS', 84, 104); ctx.letterSpacing = '3px'; ctx.font = '600 18px Arial, sans-serif'; ctx.fillStyle = '#6f7888'; ctx.fillText(theme.label, 84, 178);
    ctx.fillStyle = theme.ink; ctx.letterSpacing = '-1px'; ctx.font = '700 66px Arial, sans-serif';
    const titleLines = wrapCanvasText(ctx, track.title || 'Untitled', 820);
    titleLines.slice(0, 3).forEach((line, i) => ctx.fillText(line, 84, 480 + i * 82));
    ctx.font = '400 34px Arial, sans-serif'; ctx.fillStyle = '#687284'; ctx.fillText(String(track.artist || 'Unknown artist').slice(0, 42), 88, 480 + Math.min(titleLines.length, 3) * 82 + 6);
    ctx.fillStyle = `${theme.ink}15`; ctx.fillRect(84, 850, 912, 1);
    ctx.font = '400 22px Arial, sans-serif'; ctx.fillStyle = '#687284'; ctx.fillText('Music, with intention.', 84, 916); ctx.textAlign = 'right'; ctx.fillText('TRACK CARD · LYRICS NOT INCLUDED', 996, 976);
    const blob = await new Promise(resolve => canvas.toBlob(resolve, 'image/png'));
    if (!blob) throw new Error('Unable to render image');
    const file = new File([blob], `starmusics-${String(track.title || 'track').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 48) || 'track'}.png`, { type: 'image/png' });
    if (navigator.canShare?.({ files: [file] }) && navigator.share) {
      try { await navigator.share({ files: [file], title: `${track.title} — ${track.artist}`, text: 'STARMUSICS · Music, with intention.' }); return; }
      catch (error) { if (error?.name === 'AbortError') return; }
    }
    const url = URL.createObjectURL(blob); const link = document.createElement('a'); link.href = url; link.download = file.name; link.hidden = true; document.body.appendChild(link); link.click(); link.remove(); window.setTimeout(() => URL.revokeObjectURL(url), 1000);
    toast('Track card exported as a PNG. Lyrics were not included.');
  } catch (error) {
    toast('Could not export the track card in this browser.');
  }
}

function wrapCanvasText(context, text, maxWidth) {
  const words = String(text).split(/\s+/).filter(Boolean); const lines = []; let line = '';
  for (const word of words) {
    const candidate = line ? `${line} ${word}` : word;
    if (line && context.measureText(candidate).width > maxWidth) { lines.push(line); line = word; }
    else line = candidate;
  }
  if (line) lines.push(line);
  return lines.length ? lines : ['Untitled'];
}

document.addEventListener('DOMContentLoaded', () => {
  applyLanguage(storedLanguage(),false);
  const languageTrigger = $('#btn-language');
  const languageMenu = $('#language-menu');
  languageTrigger?.addEventListener('click', e => {
    e.preventDefault(); e.stopPropagation();
    if (!languageMenu) return;
    languageMenu.hidden = !languageMenu.hidden;
    languageTrigger.setAttribute('aria-expanded', String(!languageMenu.hidden));
  });
  languageMenu?.addEventListener('click', e => {
    const option = e.target.closest('[data-language]');
    if (!option) return;
    e.preventDefault(); e.stopPropagation();
    applyLanguage(option.dataset.language, true);
    toast(option.dataset.language === 'fa' ? 'زبان فارسی انتخاب شد' : option.dataset.language === 'ru' ? 'Выбран русский язык' : 'English selected');
  });
  document.addEventListener('click', e => {
    if (!e.target.closest('.language-control') && languageMenu) {
      languageMenu.hidden = true;
      languageTrigger?.setAttribute('aria-expanded', 'false');
    }
  });
  languageTrigger?.addEventListener('keydown', e => {
    if (e.key === 'ArrowDown' || e.key === 'Enter' || e.key === ' ') {
      e.preventDefault(); languageMenu.hidden = false; languageTrigger.setAttribute('aria-expanded', 'true');
      languageMenu.querySelector('[data-language]')?.focus();
    }
  });
  languageMenu?.addEventListener('keydown', e => {
    if (e.key === 'Escape') { languageMenu.hidden = true; languageTrigger?.setAttribute('aria-expanded', 'false'); languageTrigger?.focus(); }
  });
  $('#entity-detail')?.addEventListener('click',e=>{if(e.target.closest('[data-close-entity]')){closeEntity();return;}const a=e.target.closest('[data-open-artist]');if(a){openEntity('artist',a.dataset.openArtist);return;}const b=e.target.closest('[data-open-album]');if(b){openEntity('album',b.dataset.openAlbum);return;}const t=e.target.closest('.entity-track');if(t){playTrack(t.dataset);closeEntity();return;}});
  document.addEventListener('keydown',e=>{if(e.key==='Escape')closeEntity();});
  document.addEventListener('keydown', e => {
    if (e.key !== 'Enter' && e.key !== ' ') return;
    const card = e.target.closest?.('.curated-playlist-card,.album-release-card');
    if (!card) return;
    e.preventDefault();
    if (card.dataset.openCuratedPlaylist) openEntity('playlist', card.dataset.openCuratedPlaylist);
    else if (card.dataset.openAlbum) openEntity('album', card.dataset.openAlbum);
  });
  renderCards($('#playlists-row'), DATA.playlists);
  renderCards($('#releases-row'), DATA.releases, true);
  renderArtists();
  renderTrending();
  renderDiscussions();
  renderHomeDiscussions();
  renderLibrary();
  updateFeaturedSaveButton();
  updatePlayerUI();
  updateQueueUI();
  $('#profile-name').textContent = profile.name || 'Listener';
  if ($('#profile-display-name')) $('#profile-display-name').value = profile.name || '';
  $('#profile-bio').value = profile.bio || '';
  updateProfileCount();
  renderUserPlaylists(); renderAchievements(); renderProfileStats(); renderDiscussionPage(); renderPlaylistPage(); renderAlbumPage(); renderArtistsPage(); renderRecent(); renderSavedAlbums();
  installLanguageObserver();
  void (async () => { await initializeAccountSession(); await initializeCommunityBackend(); })();

  // Nav
  $$('.nav-item[data-view]').forEach(item => {
    item.addEventListener('click', e => { e.preventDefault(); switchView(item.dataset.view); });
  });
  $$('.mobile-nav-item[data-view]').forEach(item => item.addEventListener('click', () => switchView(item.dataset.view)));
  $('#btn-create-playlist-page')?.addEventListener('click', createPlaylist);

  // Profile shortcut in the top bar
  const profileButton = $('#btn-profile');
  profileButton?.addEventListener('click', () => { if (accountUser) switchView('profile'); else openAccountDialog(); });
  $('#btn-account-manage')?.addEventListener('click', openAccountDialog);
  $('#btn-account-close')?.addEventListener('click', () => $('#account-dialog')?.close?.());
  $('#account-dialog')?.addEventListener('click', e => { if (e.target === e.currentTarget) e.currentTarget.close(); });
  $('#account-form')?.addEventListener('submit', e => { e.preventDefault(); void submitAccountForm('login'); });
  $('#btn-account-register')?.addEventListener('click', () => void submitAccountForm('register'));
  $('#btn-account-logout')?.addEventListener('click', () => void signOutAccount());
  $('#btn-account-retry-sync')?.addEventListener('click', async () => { if (!accountUser) return; const profileOk = await persistAccountProfile(); const libraryOk = await persistAccountLibrary(); accountSyncFailed = !(profileOk && libraryOk); refreshAccountUI(accountSyncFailed ? 'Sync still incomplete. Retry when the API is stable.' : 'Profile and library synced to your account.'); accountMessage(accountSyncFailed ? 'Sync incomplete. Your browser still has a local copy.' : 'Sync completed.', accountSyncFailed ? 'error' : 'success'); });

  // Play / Pause
  $('#btn-play').addEventListener('click', togglePlay);
  $('.btn-play')?.addEventListener('click', () => {
    openEntity('playlist', 'Persian Trap');
    toast('Opening the editorial mix. Its verified tracklist is still being curated.');
  });
  $('#btn-save-entity-album')?.addEventListener('click', () => {
    const albumId = $('#btn-save-entity-album').dataset.albumId;
    const album = Catalog.getAlbum(albumId);
    if (!album) return;
    if (savedAlbumIds.has(album.id)) savedAlbumIds.delete(album.id);
    else savedAlbumIds.add(album.id);
    saveLocal('starmusics.savedAlbums', [...savedAlbumIds]);
    scheduleAccountLibrarySync();
    updateEntitySaveAlbumButton();
    renderSavedAlbums();
    renderAchievements();
    toast(savedAlbumIds.has(album.id) ? `Saved “${album.title}” to your library` : `Removed “${album.title}” from saved albums`);
  });

  // Card plays
  document.addEventListener('click', e => {
    const playBtn = e.target.closest('.play-btn');
    const card = e.target.closest('.card[data-title]');
    const trend = e.target.closest('.trending-list li');
    const searchItem = e.target.closest('.search-item');
    const openCuratedPlaylist = e.target.closest('[data-open-curated-playlist]');
    const openPersonalPlaylist = e.target.closest('[data-open-personal-playlist]');
    const trackRow = e.target.closest('.track-row, .q-item');
    const queueMove = e.target.closest('[data-queue-move]');
    const queueRemove = e.target.closest('[data-queue-remove]');
    const queuePlay = e.target.closest('[data-queue-play]');
    const genreChip = e.target.closest('[data-genre]');
    const deletePlaylist = e.target.closest('[data-delete-playlist]');
    const openPlaylistCard = e.target.closest('[data-open-playlist]');
    const addPlaylistTrack = e.target.closest('[data-add-playlist-track]');
    const removePlaylistTrack = e.target.closest('[data-remove-playlist-track]');
    const openTopic = e.target.closest('[data-open-topic]');
    const goView = e.target.closest('[data-go-view]');
    const openArtist=e.target.closest('[data-open-artist]'), openAlbum=e.target.closest('[data-open-album]'), openGenre=e.target.closest('[data-open-genre]');
    const unsaveAlbum = e.target.closest('[data-unsave-album]');
    if (unsaveAlbum) {
      const albumId = unsaveAlbum.dataset.unsaveAlbum;
      const album = Catalog.getAlbum(albumId);
      if (album) {
        savedAlbumIds.delete(album.id); saveLocal('starmusics.savedAlbums', [...savedAlbumIds]);
        scheduleAccountLibrarySync(); renderSavedAlbums(); updateEntitySaveAlbumButton(); renderAchievements();
        toast(`Removed “${album.title}” from saved albums`);
      }
      return;
    }
    if (queueMove) {
      const index = Number(queueMove.dataset.queueIndex);
      const direction = queueMove.dataset.queueMove;
      const target = direction === 'up' ? index - 1 : index + 1;
      if (Number.isInteger(index) && index >= 0 && target >= 0 && target < state.queue.length) {
        [state.queue[index], state.queue[target]] = [state.queue[target], state.queue[index]];
        state.queueBeforeShuffle = null; state.shuffle = false; syncPlaybackControlState();
        updateQueueUI();
      }
      return;
    }
    if (queueRemove) {
      const index = Number(queueRemove.dataset.queueRemove);
      if (Number.isInteger(index) && index >= 0 && index < state.queue.length) {
        state.queue.splice(index, 1); state.queueBeforeShuffle = null; state.shuffle = false; syncPlaybackControlState();
        updateQueueUI(); toast('Removed from queue');
      }
      return;
    }
    if (queuePlay) {
      const index = Number(queuePlay.dataset.queuePlay);
      const selected = state.queue[index];
      if (selected && Number.isInteger(index) && index >= 0) {
        state.queue = state.queue.slice(index + 1); state.queueBeforeShuffle = null; state.shuffle = false; syncPlaybackControlState();
        playTrack({ ...selected, id: selected.rank || selected.id, title: selected.track || selected.title });
        $('#queue-panel') && ($('#queue-panel').hidden = true);
      }
      return;
    }
    if(openArtist){openEntity('artist',openArtist.dataset.openArtist);if($('#search-popover'))$('#search-popover').hidden=true;return;} if(openAlbum&&!e.target.closest('.play-btn')){openEntity('album',openAlbum.dataset.openAlbum);if($('#search-popover'))$('#search-popover').hidden=true;return;} if(openGenre){openEntity('genre',openGenre.dataset.openGenre);if($('#search-popover'))$('#search-popover').hidden=true;return;}
    if(openCuratedPlaylist){openEntity('playlist',openCuratedPlaylist.dataset.openCuratedPlaylist);if($('#search-popover'))$('#search-popover').hidden=true;return;}
    if(openPersonalPlaylist){switchView('playlists');openPlaylist(Number(openPersonalPlaylist.dataset.openPersonalPlaylist));if($('#search-popover'))$('#search-popover').hidden=true;return;}
    if (openTopic) { state.selectedDiscussion = Number(openTopic.dataset.openTopic); switchView('discussions'); return; }
    if (openPlaylistCard && !e.target.closest('[data-delete-playlist]')) { switchView('playlists'); openPlaylist(Number(openPlaylistCard.dataset.openPlaylist)); return; }
    if (addPlaylistTrack) {
      const playlist = userPlaylists[state.selectedPlaylistIndex];
      const track = catalogTracks().find(t => String(t.id) === String(addPlaylistTrack.dataset.addPlaylistTrack));
      if (!playlist || !track) return;
      if (playlist.tracks.some(t => String(t.id) === String(track.id))) { toast('Track is already in this playlist'); return; }
      playlist.tracks.push({ ...track }); savePlaylists(); renderPlaylistPage(); renderUserPlaylists(); renderLibrary(); renderAchievements(); toast(`Added “${track.title}”`); return;
    }
    if (removePlaylistTrack) {
      const playlist = userPlaylists[state.selectedPlaylistIndex]; const index = Number(removePlaylistTrack.dataset.removePlaylistTrack);
      if (!playlist || !playlist.tracks[index]) return;
      playlist.tracks.splice(index, 1); savePlaylists(); renderPlaylistPage(); renderUserPlaylists(); renderLibrary(); renderAchievements(); toast('Track removed from playlist'); return;
    }
    if (goView) { e.preventDefault(); switchView(goView.dataset.goView); return; }
    if (genreChip) { const si=$('#search-input'); const sp=$('#search-popover'); if(si){si.value=genreChip.dataset.genre;} if(sp){sp.hidden=false;} search(genreChip.dataset.genre); si?.focus(); return; }
    if (deletePlaylist && !e.target.closest('#user-playlists-row')) { const i=Number(deletePlaylist.dataset.deletePlaylist); if (userPlaylists[i] && confirm(`Delete playlist “${userPlaylists[i].name}”?`)) { userPlaylists.splice(i,1); if(state.selectedPlaylistIndex===i)state.selectedPlaylistIndex=null;else if(state.selectedPlaylistIndex>i)state.selectedPlaylistIndex--; savePlaylists(); renderUserPlaylists(); renderPlaylistPage(); renderLibrary(); renderAchievements(); } return; }

    if (playBtn && card) {
      e.stopPropagation();
      playTrack(card.dataset);
    } else if (card?.dataset.title) {
      playTrack(card.dataset);
    } else if (trend) {
      playTrack(trend.dataset);
    } else if (searchItem) {
      const type = searchItem.dataset.searchType || 'Track';
      if (type === 'Artist') { openEntity('artist', searchItem.dataset.title); }
      else if (type === 'Album') { openEntity('album', searchItem.dataset.title); }
      else if (type === 'Genre') { openEntity('genre', searchItem.dataset.title); }
      else if (type === 'Playlist') { openEntity('playlist', searchItem.dataset.title); }
      else { playTrack(searchItem.dataset); }
      const _sp=$('#search-popover'); if(_sp) _sp.hidden=true;
      if ($('#search-input')) $('#search-input').value = '';
    } else if (trackRow) {
      playTrack(trackRow.dataset);
    }
  });

  // Progress
  $('#progress-bar').addEventListener('click', e => {
    const audio = $('#audio-engine'); if (!audio?.src || !Number.isFinite(audio.duration)) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const pct = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    audio.currentTime = pct * audio.duration;
  });

  // Keyboard-accessible progress and volume sliders
  $('#progress-bar').addEventListener('keydown', e => {
    if (!state.current) return;
    let next = state.progress;
    if (e.key === 'ArrowRight' || e.key === 'ArrowUp') next += 5;
    else if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') next -= 5;
    else if (e.key === 'Home') next = 0;
    else if (e.key === 'End') next = state.current.duration;
    else return;
    e.preventDefault();
    const audio = $('#audio-engine');
    if (audio?.src && Number.isFinite(audio.duration)) audio.currentTime = Math.max(0, Math.min(audio.duration, next));
  });

  // Volume is kept in sync across desktop controls and the full player.
  $('#volume-bar').addEventListener('keydown', e => {
    let next = state.volume;
    if (e.key === 'ArrowRight' || e.key === 'ArrowUp') next += 5;
    else if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') next -= 5;
    else if (e.key === 'Home') next = 0;
    else if (e.key === 'End') next = 100;
    else return;
    e.preventDefault(); setVolume(next);
  });
  $('#volume-bar').addEventListener('click', e => {
    const rect = e.currentTarget.getBoundingClientRect();
    setVolume(Math.round(Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width)) * 100));
  });
  $('#np-volume-range')?.addEventListener('input', e => setVolume(e.currentTarget.value));

  // Like
  $('#btn-like').addEventListener('click', () => {
    if (!state.current) { toast('Choose a track first'); return; }
    const id = state.current.id;
    if (state.liked.has(id)) {
      state.liked.delete(id);
      toast('Removed from Liked Songs');
    } else {
      state.liked.add(id);
      toast('Added to Liked Songs');
    }
    if (state.liked.has(id)) { if (state.current) likedTrackMetadata.set(String(id), { ...state.current }); } else likedTrackMetadata.delete(String(id));
    saveLocal('starmusics.liked', [...state.liked]);
    saveLocal('starmusics.likedTracks', [...likedTrackMetadata.values()]);
    scheduleAccountLibrarySync();
    updatePlayerUI();
    updateLikedUI(); renderAchievements(); renderLibrary();
  });

  // Shuffle / Repeat
  $('#btn-shuffle').addEventListener('click', () => setShuffle(!state.shuffle));
  $('#btn-volume')?.addEventListener('click', () => {
    const audio = $('#audio-engine'); if (!audio) return;
    audio.muted = !audio.muted; updateVolumeUI();
    toast(audio.muted ? 'Muted' : 'Volume on');
  });
  $('#btn-repeat').addEventListener('click', () => {
    state.repeat = !state.repeat;
    syncPlaybackControlState();
    toast(state.repeat ? 'Repeat on' : 'Repeat off');
  });
  $('#btn-next').addEventListener('click', nextTrack);
  $('#btn-prev').addEventListener('click', prevTrack);

  // Queue
  $('#btn-queue').addEventListener('click', () => {
    const p = $('#queue-panel');
    p.hidden = !p.hidden;
    if (!p.hidden) updateQueueUI();
  });
  $('#btn-close-queue').addEventListener('click', () => { $('#queue-panel').hidden = true; });
  $('#btn-clear-queue')?.addEventListener('click', () => { state.queue = []; state.queueBeforeShuffle = null; state.shuffle = false; syncPlaybackControlState(); updateQueueUI(); toast('Queue cleared'); });

  // Keep keyboard focus inside the expanded player while it behaves as a modal dialog.
  $('#now-playing-modal')?.addEventListener('keydown', event => {
    if (event.key !== 'Tab' || $('#now-playing-modal').hidden) return;
    const focusable = [...$('#np-sheet').querySelectorAll('button:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])')].filter(node => node.offsetParent !== null);
    if (!focusable.length) { event.preventDefault(); $('#np-sheet').focus(); return; }
    const first = focusable[0], last = focusable[focusable.length - 1];
    if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
    else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
  });

  // Now Playing modal controls are consolidated below so mode state cannot drift.
  $$('.np-controls .ctrl').forEach(btn => {
    btn.addEventListener('click', () => {
      const a = btn.dataset.action;
      if (a === 'play') togglePlay();
      if (a === 'next') nextTrack();
      if (a === 'prev') prevTrack();
      if (a === 'shuffle') $('#btn-shuffle').click();
      if (a === 'repeat') $('#btn-repeat').click();
    });
  });

  // STARMUSICS uses the approved light, monochrome design system; theme switching is intentionally disabled.

  // Search — compact field; results dropdown under it
  const searchInput = $('#search-input');
  const searchPopover = $('#search-popover');
  function openSearch() {
    if (searchPopover) searchPopover.hidden = false;
  }
  function closeSearch() {
    if (searchPopover) searchPopover.hidden = true;
  }
  const discoveryInput = $('#discovery-search-input');
  $('#discovery-filter-bar')?.addEventListener('click', e => {
    const button = e.target.closest('[data-search-filter]');
    if (!button || button.disabled) return;
    activeSearchFilter = button.dataset.searchFilter || 'all';
    search(discoveryInput?.value || searchInput?.value || '');
    if (searchPopover) searchPopover.hidden = true;
  });
  searchInput?.addEventListener('input', () => {
    openSearch();
    if (discoveryInput && discoveryInput.value !== searchInput.value) discoveryInput.value = searchInput.value;
    search(searchInput.value);
  });
  // The toolbar search is a compact global entry point. Enter moves the user
  // into Explore, where the full discovery results live; it does not relocate
  // navigation or turn the toolbar into the main page layout.
  searchInput?.addEventListener('keydown', e => {
    if (e.key === 'Enter') {
      e.preventDefault();
      const query = searchInput.value.trim();
      switchView('explore');
      if (discoveryInput) discoveryInput.value = query;
      search(query);
      closeSearch();
      discoveryInput?.focus();
    }
    if (e.key === 'Escape') closeSearch();
  });
  discoveryInput?.addEventListener('input', () => {
    if (searchInput) searchInput.value = discoveryInput.value;
    search(discoveryInput.value);
    if (searchPopover) searchPopover.hidden = true;
  });
  discoveryInput?.addEventListener('keydown', e => {
    if (e.key === 'Enter') { e.preventDefault(); if (searchInput) searchInput.value = discoveryInput.value; search(discoveryInput.value); if (searchPopover) searchPopover.hidden = true; }
    if (e.key === 'Escape') { discoveryInput.value = ''; search(''); }
  });
  document.addEventListener('click', e => {
    const quick = e.target.closest('[data-discovery-query]');
    if (!quick) return;
    const value = quick.dataset.discoveryQuery || '';
    if (discoveryInput) discoveryInput.value = value;
    if (searchInput) searchInput.value = value;
    search(value);
    if (searchPopover) searchPopover.hidden = true;
    discoveryInput?.focus();
  });
  searchInput?.addEventListener('focus', () => {
    openSearch();
    if (searchInput.value) search(searchInput.value);
  });
  document.addEventListener('click', e => {
    if (!e.target.closest('.search-shell')) closeSearch();
  });
  document.addEventListener('keydown', e => {
    const playlistCard = e.target.closest?.('[data-open-playlist]');
    if (playlistCard && (e.key === 'Enter' || e.key === ' ') && !e.target.closest('button')) { e.preventDefault(); switchView('playlists'); openPlaylist(Number(playlistCard.dataset.openPlaylist)); }
    if (e.code === 'Space' && e.target === document.body) {
      e.preventDefault();
      togglePlay();
    }
    if (e.key === 'Escape') {
      closeSearch();
      $('#queue-panel') && ($('#queue-panel').hidden = true);
      if ($('#now-playing-modal') && !$('#now-playing-modal').hidden) setPlayerMode('dock');
    }
  });

  // Misc
  $('#btn-create-playlist')?.addEventListener('click', createPlaylist);
  $('#btn-create-playlist-main')?.addEventListener('click', createPlaylist);
  $$('.profile-library-icon').forEach(button => button.addEventListener('click', () => {
    const destination = button.dataset.profileShortcut;
    if (destination === 'playlists') {
      $('#profile-playlists')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      $('#profile-playlists')?.classList.add('profile-section-focus');
      window.setTimeout(() => $('#profile-playlists')?.classList.remove('profile-section-focus'), 900);
      return;
    }
    if (destination) switchView(destination);
  }));
  $('#btn-new-discussion')?.addEventListener('click', () => toast('Topic creation requires administrator authentication on a server'));
  $('#profile-display-name')?.addEventListener('input', e => { const preview = $('#profile-name'); if (preview) preview.textContent = e.target.value.trim().slice(0,32) || 'Listener'; });
  $('#profile-bio')?.addEventListener('input', updateProfileCount);
  $('#btn-save-profile')?.addEventListener('click', async () => { profile.name = ($('#profile-display-name')?.value || '').trim().slice(0,32) || 'Listener'; profile.bio = $('#profile-bio').value.trim().slice(0,180); saveLocal('starmusics.profile', profile); $('#profile-name').textContent = profile.name; if ($('#profile-display-name')) $('#profile-display-name').value = profile.name; renderProfileStats(); renderAchievements(); renderDiscussionPage(); updateProfileCount(); if (accountUser) { const ok = await persistAccountProfile(false); toast(ok ? 'Profile saved to your account' : 'Profile saved on this device'); } else toast('Profile saved on this device'); });
  $('#discussion-page-list')?.addEventListener('click', e => { const row=e.target.closest('[data-topic]'); if(!row)return; state.selectedDiscussion=Number(row.dataset.topic); renderDiscussionPage(); });
  $('#discussion-page-list')?.addEventListener('keydown', e => { if(e.key==='Enter'||e.key===' '){ const row=e.target.closest('[data-topic]'); if(row){e.preventDefault();state.selectedDiscussion=Number(row.dataset.topic);renderDiscussionPage();}} });
  $('#discussion-search')?.addEventListener('input', e => { discussionSearchQuery = e.currentTarget.value.slice(0,100); renderDiscussionPage(); });
  $('#discussion-search')?.addEventListener('keydown', e => { if (e.key === 'Escape' && e.currentTarget.value) { e.currentTarget.value = ''; discussionSearchQuery = ''; renderDiscussionPage(); } });
  $$('[data-discussion-sort]').forEach(button => button.addEventListener('click', () => { discussionSort = button.dataset.discussionSort || 'active'; renderDiscussionPage(); }));
  $$('[data-comment-sort]').forEach(button => button.addEventListener('click', () => { commentSort = button.dataset.commentSort === 'newest' ? 'newest' : 'oldest'; renderDiscussionPage(); }));
  $('#comment-form')?.addEventListener('submit', async e => {
    e.preventDefault();
    const text = $('#comment-input')?.value.trim().slice(0,800);
    if (!text) return;
    if (communityBackendReady) {
      if (!accountUser) { openAccountDialog(); accountMessage('Sign in to post to the shared community.'); return; }
      const topic = communityTopics[state.selectedDiscussion];
      if (!topic) return;
      try {
        const result = await communityRequest(`/community/topics/${encodeURIComponent(topic.id)}/comments`,'POST',{text});
        $('#comment-input').value='';
        const currentIndex=state.selectedDiscussion;
        const mapped=mapRemoteComment(result.comment,currentIndex);
        if (activeRemoteCommentTopicId===topic.id) comments.push(mapped);
        communityOwnCommentCount += 1;
        topic.commentCount = Number(topic.commentCount||0)+1;
        renderDiscussionPage(); renderDiscussions(); renderHomeDiscussions(); renderAchievements();
        toast('Comment shared with the community');
        void refreshRemoteCommunityMemberStats();
      } catch (error) { toast(error.status===401 ? 'Sign in to post a comment' : (error.message || 'Comment could not be posted')); }
      return;
    }
    const author = (profile.name || 'Listener').trim().slice(0,32) || 'Listener';
    const id = (window.crypto && typeof window.crypto.randomUUID === 'function') ? window.crypto.randomUUID() : `comment-${Date.now()}-${Math.random().toString(36).slice(2,9)}`;
    const localComment={ id, topic:state.selectedDiscussion, text, author, created:new Date().toISOString(), liked:false, isRemote:false };
    localCommunityComments.push(localComment); comments=localCommunityComments;
    saveLocal('starmusics.comments', localCommunityComments);
    $('#comment-input').value='';
    renderDiscussionPage(); renderDiscussions(); renderHomeDiscussions(); renderAchievements();
    toast('Comment saved on this device');
  });
  $('#comments-list')?.addEventListener('click', async e => {
    const publicProfile = e.target.closest('[data-public-profile]');
    if (publicProfile) { openPublicMemberProfile(publicProfile.dataset.publicProfile); return; }
    const reportButton = e.target.closest('[data-report-comment]');
    if (reportButton) { openReportDialog(reportButton.dataset.reportComment); return; }
    const button = e.target.closest('[data-like-comment]'); if (!button) return;
    const comment = comments.find(item => item.id === button.dataset.likeComment); if (!comment) return;
    if (comment.isRemote && communityBackendReady) {
      if (!accountUser) { openAccountDialog(); accountMessage('Sign in to react to shared comments.'); return; }
      const liked = !comment.liked;
      try {
        const result=await communityRequest(`/community/comments/${encodeURIComponent(comment.id)}/like`,'POST',{liked});
        comment.liked=result.liked===true; comment.likesCount=Number(result.likesCount)||0;
        renderComments();
      } catch (error) { toast(error.status===401 ? 'Sign in to react to comments' : (error.message || 'Reaction could not be saved')); }
      return;
    }
    comment.liked = !comment.liked;
    saveLocal('starmusics.comments', localCommunityComments);
    renderComments();
    toast(comment.liked ? 'Comment liked on this device' : 'Like removed');
  });
  $('#report-form')?.addEventListener('submit', async e => {
    e.preventDefault();
    if (!communityBackendReady || !accountUser || !reportingCommentId) return;
    const submit=$('#btn-submit-report'); if(submit) submit.disabled=true;
    try {
      await communityRequest(`/community/comments/${encodeURIComponent(reportingCommentId)}/report`,'POST',{reason:$('#report-reason')?.value || 'other',details:$('#report-details')?.value.trim() || ''});
      $('#report-dialog')?.close?.(); $('#report-details').value=''; reportingCommentId='';
      toast('Report sent privately to the moderation team');
      if (['owner','moderator'].includes(accountUser.communityRole)) void loadModerationReports();
    } catch(error) { toast(error.status===409 ? 'You already reported this comment' : (error.message || 'Report could not be submitted')); }
    finally { if(submit) submit.disabled=false; }
  });
  $$('[data-close-report]').forEach(button => button.addEventListener('click', () => { $('#report-dialog')?.close?.(); reportingCommentId=''; }));
  $$('[data-close-public-profile]').forEach(button => button.addEventListener('click', () => $('#public-profile-dialog')?.close?.()));
  $('#btn-toggle-member-moderator')?.addEventListener('click', async e => {
    const button = e.currentTarget;
    const memberId = button.dataset.memberId || '';
    const currentRole = button.dataset.memberRole || 'member';
    if (!communityBackendReady || accountUser?.communityRole !== 'owner' || !memberId || memberId === accountUser.id) {
      toast('Only the installation owner can manage moderator roles.'); return;
    }
    const nextRole = currentRole === 'moderator' ? 'member' : 'moderator';
    const actionLabel = nextRole === 'moderator' ? 'grant moderator access to this member' : 'revoke this member’s moderator access';
    if (typeof window.confirm === 'function' && !window.confirm(`Are you sure you want to ${actionLabel}?`)) return;
    button.disabled = true;
    try {
      const result = await communityRequest(`/community/members/${encodeURIComponent(memberId)}/role`, 'PUT', { role: nextRole });
      const member = result.member || {};
      button.dataset.memberRole = member.role || nextRole;
      button.textContent = member.role === 'moderator' ? 'Revoke moderator' : 'Grant moderator';
      toast(member.role === 'moderator' ? 'Moderator role granted' : 'Moderator role revoked');
    } catch (error) { toast(error.message || 'Moderator role could not be changed'); }
    finally { button.disabled = false; }
  });
  $('#community-topic-create-form')?.addEventListener('submit', async e => {
    e.preventDefault();
    if (!communityBackendReady || !accountUser || accountUser.communityRole!=='owner') { toast('Only the installation owner can publish topics'); return; }
    const title=$('#community-topic-title')?.value.trim() || '';
    const description=$('#community-topic-description')?.value.trim() || '';
    const button=$('#btn-create-community-topic'); if(button) button.disabled=true;
    try {
      const result=await communityRequest('/community/topics','POST',{title,description});
      $('#community-topic-title').value=''; $('#community-topic-description').value='';
      await refreshCommunityTopics(result.topic?.id || '');
      toast('Curated discussion topic published');
    } catch(error) { toast(error.message || 'Topic could not be published'); }
    finally { if(button) button.disabled=false; }
  });
  $('#btn-new-discussion')?.addEventListener('click', () => {
    if (accountUser?.communityRole==='owner') $('#community-topic-create-section')?.scrollIntoView({behavior:'smooth',block:'center'});
    else { openAccountDialog(); accountMessage('Sign in with the installation owner account to create curated topics.'); }
  });
  $('#btn-claim-owner')?.addEventListener('click', async () => {
    const token=$('#owner-claim-token')?.value || '';
    if(!accountUser || token.length<32) { accountMessage('Enter the one-time setup secret supplied by the site operator.','error'); return; }
    const button=$('#btn-claim-owner'); if(button) button.disabled=true;
    try {
      const result=await communityRequest('/community/owner/claim','POST',{token});
      if(result.user) applyRemoteUser(result.user);
      communityStatus.ownerClaimAvailable=false;
      $('#owner-claim-token').value='';
      accountMessage('Installation owner role claimed successfully. Keep the setup secret private.','success');
      updateCommunityAccessControls();
      await refreshRemoteCommunityMemberStats();
      await loadModerationReports();
    } catch(error) { accountMessage(error.message || 'Owner setup could not be completed.','error'); }
    finally { if(button) button.disabled=false; }
  });
  $('#btn-refresh-community-reports')?.addEventListener('click', () => { void loadModerationReports(); });
  $('#community-report-list')?.addEventListener('click', async e => {
    const moderate=e.target.closest('[data-moderate-comment]');
    const resolve=e.target.closest('[data-resolve-report]');
    try {
      if (moderate) {
        const reason=moderate.dataset.action==='hide'?'Hidden after community report review.':'Restored after moderation review.';
        const result=await communityRequest(`/community/comments/${encodeURIComponent(moderate.dataset.moderateComment)}`,'PATCH',{action:moderate.dataset.action,reason});
        activeRemoteCommentTopicId=''; comments=[];
        await refreshCommunityTopics(result.topicId || communityTopics[state.selectedDiscussion]?.id || '');
        await loadModerationReports();
        toast(moderate.dataset.action==='hide'?'Comment hidden from the public discussion':'Comment restored');
      } else if (resolve) {
        await communityRequest(`/community/reports/${encodeURIComponent(resolve.dataset.resolveReport)}`,'PATCH',{status:resolve.dataset.status});
        await loadModerationReports();
        toast(resolve.dataset.status==='closed'?'Report closed':'Report marked reviewed');
      }
    } catch(error) { toast(error.message || 'Moderation action failed'); }
  });
  $('#profile-display-name')?.addEventListener('input', e => { const avatar = $('#profile-avatar-initials'); const composer = $('#comment-composer-avatar'); const initials = profileInitials(e.currentTarget.value.trim() || 'Listener'); if (avatar) avatar.textContent = initials; if (composer) composer.textContent = initials; });
  $('#user-playlists-row')?.addEventListener('click', e => { const b=e.target.closest('[data-delete-playlist]'); if(!b)return; const i=Number(b.dataset.deletePlaylist); if(userPlaylists[i] && confirm(`Delete playlist “${userPlaylists[i].name}”?`)){userPlaylists.splice(i,1);if(state.selectedPlaylistIndex===i)state.selectedPlaylistIndex=null;else if(state.selectedPlaylistIndex>i)state.selectedPlaylistIndex--;savePlaylists();renderUserPlaylists();renderPlaylistPage();renderLibrary();renderAchievements();} });
  $('#btn-close-playlist')?.addEventListener('click', () => { state.selectedPlaylistIndex = null; renderPlaylistDetail(); });
  $('#btn-play-playlist')?.addEventListener('click', () => { const pl=userPlaylists[state.selectedPlaylistIndex]; if(!pl || !pl.tracks.length){toast('Add a track to this playlist first');return;} state.queue=pl.tracks.slice(1).map(t=>({...t,track:t.title})); playTrack(pl.tracks[0]); toast(`Playing playlist: ${pl.name}`); });
  $('#btn-notifications')?.addEventListener('click', () => toast('No new notifications'));
  $('#btn-save-featured')?.addEventListener('click', () => {
    featuredSaved = !featuredSaved;
    saveLocal('starmusics.savedFeatured', featuredSaved);
    scheduleAccountLibrarySync();
    updateFeaturedSaveButton();
    renderSavedFeatured();
    toast(featuredSaved ? 'Saved to Your Library' : 'Removed from Your Library');
  });
  $('#btn-lyrics')?.addEventListener('click', () => {
    if (!state.current) { toast('Choose a track first'); return; }
    setPlayerMode('page');
    requestAnimationFrame(() => $('#np-lyrics')?.scrollIntoView({ behavior: 'smooth', block: 'nearest' }));
  });
  $('#btn-now-playing')?.addEventListener('click', () => {
    if (!state.current) { toast('Choose a track first'); return; }
    setPlayerMode('page');
  });
  $('#btn-close-np')?.addEventListener('click', () => setPlayerMode('dock'));
  $('#btn-np-queue')?.addEventListener('click', () => { setPlayerMode('dock'); const panel = $('#queue-panel'); if (panel) { panel.hidden = false; updateQueueUI(); } });
  $('.np-backdrop')?.addEventListener('click', () => setPlayerMode('dock'));
  $('#btn-player-mode')?.addEventListener('click', () => setPlayerMode(state.playerMode === 'dock' ? 'page' : state.playerMode === 'page' ? 'mini' : (state.playerModeBeforeMini || 'dock')));
  $('#btn-mini-play')?.addEventListener('click', togglePlay);
  $('#btn-mini-restore')?.addEventListener('click', () => setPlayerMode(state.playerModeBeforeMini || 'dock'));
  $('#btn-mini-expand')?.addEventListener('click', () => setPlayerMode('page'));
  $$('[data-player-mode]').forEach(b => b.addEventListener('click', () => setPlayerMode(b.dataset.playerMode)));
  $('#btn-add-audio')?.addEventListener('click', () => {
    if (!state.current) { toast('Choose a track first'); return; }
    if (!$('#audio-rights-confirm')?.checked) { toast('Confirm that you have permission to use this audio file'); $('#audio-rights-confirm')?.focus(); return; }
    $('#audio-file-input')?.click();
  });
  $('#audio-file-input')?.addEventListener('change', e => {
    const file = e.target.files?.[0], audio = $('#audio-engine');
    if (!file || !audio || !state.current) return;
    const validation = AudioSourceAdapter.validateLocalFile(file, $('#audio-rights-confirm')?.checked === true);
    if (!validation.valid) { toast(validation.reason); e.target.value = ''; return; }
    const sourceId = String(state.current.id);
    const existingUrl = state.localAudioSources.get(sourceId);
    if (existingUrl) URL.revokeObjectURL(existingUrl);
    const objectUrl = URL.createObjectURL(file);
    state.audioObjectUrl = objectUrl;
    state.localAudioSources.set(sourceId, objectUrl);
    audio.src = objectUrl;
    state.current.audioUrl = objectUrl;
    $('#audio-rights-confirm').checked = false;
    audio.play().then(() => { state.playing = true; updatePlayerUI(); toast(`Playing ${file.name}`); }).catch(() => toast('This audio file could not be played.'));
    e.target.value = '';
  });
  window.addEventListener('beforeunload', () => { for (const url of state.localAudioSources.values()) URL.revokeObjectURL(url); });
  const audioEngine = $('#audio-engine');
  if (audioEngine) audioEngine.volume = state.volume / 100;
  setVolume(state.volume, false);
  const seekFromPointer = (bar, clientX) => {
    const audio = $('#audio-engine');
    if (!audio?.src || !Number.isFinite(audio.duration) || audio.duration <= 0) return;
    const rect = bar.getBoundingClientRect();
    if (!rect.width) return;
    const pct = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
    audio.currentTime = pct * audio.duration;
    state.progress = audio.currentTime;
    updatePlayerUI();
  };
  $('#np-progress-bar')?.addEventListener('click', e => seekFromPointer(e.currentTarget, e.clientX));
  $('#np-progress-bar')?.addEventListener('keydown', e => {
    if (!state.current) return;
    const audio = $('#audio-engine');
    let next = state.progress;
    if (e.key === 'ArrowRight' || e.key === 'ArrowUp') next += 5;
    else if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') next -= 5;
    else if (e.key === 'Home') next = 0;
    else if (e.key === 'End') next = Number.isFinite(audio?.duration) ? audio.duration : state.current.duration;
    else return;
    e.preventDefault();
    if (audio?.src && Number.isFinite(audio.duration)) audio.currentTime = Math.max(0, Math.min(audio.duration, next));
  });
  audioEngine?.addEventListener('timeupdate', () => { state.progress = audioEngine.currentTime || 0; updatePlayerUI(); });
  audioEngine?.addEventListener('seeked', updatePlayerUI);
  audioEngine?.addEventListener('ratechange', updatePlayerUI);
  audioEngine?.addEventListener('loadedmetadata', updatePlayerUI);
  audioEngine?.addEventListener('play', () => { state.playing = true; if (!state.hasPlayedAudio) { state.hasPlayedAudio = true; saveLocal('starmusics.hasPlayedAudio', true); renderAchievements(); } updatePlayerUI(); });
  audioEngine?.addEventListener('pause', () => { state.playing = false; updatePlayerUI(); });
  audioEngine?.addEventListener('ended', () => { if (state.repeat) { audioEngine.currentTime = 0; audioEngine.play(); } else nextTrack(); });
  audioEngine?.addEventListener('error', () => { state.playing = false; updatePlayerUI(); });
  $('#btn-share-lyrics')?.addEventListener('click', async () => { await exportTrackCard(); });
  $('#lyrics-card-theme')?.addEventListener('change', event => { saveLocal('starmusics.trackCardTheme', event.currentTarget.value); });
  const savedCardTheme = loadLocal('starmusics.trackCardTheme', 'glass');
  if (['glass', 'afterglow', 'paper'].includes(savedCardTheme) && $('#lyrics-card-theme')) $('#lyrics-card-theme').value = savedCardTheme;
  initializeMediaSession();
  setPlayerMode(state.playerMode);
});
