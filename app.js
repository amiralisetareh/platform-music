// STARMUSICS — frontend prototype; production authorization requires a trusted backend

const DATA = {
  playlists: [
    { id: 'p1', title: 'Persian Trap', subtitle: 'Curated by STARMUSICS', img: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=400&fit=crop' },
    { id: 'p2', title: 'Hip Hop Essentials', subtitle: 'Global', tag: 'Global', img: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=400&h=400&fit=crop' },
    { id: 'p3', title: 'Alternative Rock', subtitle: 'International', img: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=400&h=400&fit=crop' },
    { id: 'p4', title: 'Chill Vibes', subtitle: 'For You', img: 'https://images.unsplash.com/photo-1470225620780-dba8ba35e271?w=400&h=400&fit=crop' },
    { id: 'p5', title: 'Rock Classics', subtitle: 'Legends Never Die', nirvana: true, img: null },
  ],
  releases: [
    { id: 'r1', title: 'Eternal Return', subtitle: 'FELIX', img: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=400&fit=crop', duration: 185 },
    { id: 'r2', title: 'Sicko Mode (Remix)', subtitle: 'Travis Scott', img: 'https://images.unsplash.com/photo-1516280440614-6697288d5d38?w=400&h=400&fit=crop', duration: 312 },
    { id: 'r3', title: 'A Better Tomorrow', subtitle: 'Frank Ocean', tag: 'E', img: 'https://images.unsplash.com/photo-1459749411177-03992541138c?w=400&h=400&fit=crop', duration: 248 },
    { id: 'r4', title: 'HajBazi', subtitle: 'Shaya', img: 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=400&h=400&fit=crop', duration: 201 },
    { id: 'r5', title: 'DS2', subtitle: 'Future', img: 'https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?w=400&h=400&fit=crop', duration: 276 },
  ],
  artists: [
    { name: 'Kendrick Lamar', img: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop' },
    { name: 'Drake', img: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop' },
    { name: 'Yeat', img: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=200&h=200&fit=crop' },
    { name: 'Travis Scott', img: 'https://images.unsplash.com/photo-1522075469751-3a6694010291?w=200&h=200&fit=crop' },
    { name: 'Future', img: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=200&h=200&fit=crop' },
    { name: 'Tame Impala', img: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200&h=200&fit=crop' },
  ],
  trending: [
    { rank: 1, artist: 'Yeat', track: 'Lyfestyle', tag: 'E', img: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=80&h=80&fit=crop', duration: 185 },
    { rank: 2, artist: 'The Weeknd', track: 'Dancing In The Flames', tag: 'E', img: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=80&h=80&fit=crop', duration: 234 },
    { rank: 3, artist: '$uicideboy$', track: 'Mount Sinai', tag: 'E', img: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=80&h=80&fit=crop', duration: 198 },
    { rank: 4, artist: '070 Shake', track: 'Moral Combat', tag: 'E', img: 'https://images.unsplash.com/photo-1470225620780-dba8ba35e271?w=80&h=80&fit=crop', duration: 221 },
    { rank: 5, artist: 'Kendrick Lamar', track: 'Not Like Us', tag: 'E', img: 'https://images.unsplash.com/photo-1516280440614-6697288d5d38?w=80&h=80&fit=crop', duration: 274 },
  ],
  discussions: [
    { title: 'The Best Persian Trap Artists?', replies: 12, time: '2h ago', avatars: 2 },
    { title: "Thoughts on Ye's New Album?", replies: 45, time: '5h ago', avatars: 1 },
    { title: "What's your favorite track rn?", replies: 28, time: '7h ago', avatars: 1 },
    { title: 'Underrated Artists', replies: 18, time: '9h ago', avatars: 1 },
  ],
  genres: ['Persian Trap', 'Hip-Hop', 'R&B', 'Alternative', 'Electronic', 'Indie', 'Drill', 'Afrobeats', 'Lo-Fi', 'Rock'],
};

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
 'Your personal collection, gathered here in one place.':'Your personal collection, gathered here in one place.'
});
Object.assign(I18N.ru, {
 'Your music':'Ваша музыка','Your achievements':'Ваши достижения','Your collection':'Ваша коллекция','Your playlists':'Ваши плейлисты',
 'Liked songs':'Любимые треки','Recently played':'Недавно прослушано','Saved albums':'Сохранённые альбомы','Return to previous player mode':'Вернуться к предыдущему режиму',
 'Expand player':'Развернуть плеер','Choose language':'Выбрать язык','Your Library':'Ваша медиатека','Artists':'Артисты','Albums':'Альбомы','Genres':'Жанры',
 'Interface language':'Язык интерфейса','Dock':'Панель','Page':'Страница','Mini':'Мини','Now Playing':'Сейчас играет','Play':'Играть','Pause':'Пауза',
 'Your personal collection, gathered here in one place.':'Ваша личная коллекция — всё в одном месте.'
});
Object.assign(I18N.fa, {
 'Your music':'موسیقی شما','Your achievements':'دستاوردهای شما','Your collection':'مجموعه شما','Your playlists':'پلی‌لیست‌های شما',
 'Liked songs':'آهنگ‌های پسندیده','Recently played':'پخش‌های اخیر','Saved albums':'آلبوم‌های ذخیره‌شده','Return to previous player mode':'بازگشت به حالت قبلی پخش‌کننده',
 'Expand player':'باز کردن پخش‌کننده','Choose language':'انتخاب زبان','Your Library':'کتابخانه شما','Artists':'هنرمندان','Albums':'آلبوم‌ها','Genres':'سبک‌ها',
 'Interface language':'زبان رابط کاربری','Dock':'پایین صفحه','Page':'تمام‌صفحه','Mini':'کوچک','Now Playing':'در حال پخش','Play':'پخش','Pause':'مکث',
 'Your personal collection, gathered here in one place.':'مجموعه شخصی موسیقی شما، در یک جا.'
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
 'Owner':['Владелец','مدیر']
};
for (const [label, translations] of Object.entries(extraTranslations)) {
  I18N.en[label] ??= label;
  I18N.ru[label] ??= translations[0];
  I18N.fa[label] ??= translations[1];
}
const languageOriginals=new WeakMap();
function storedLanguage(){try{const raw=localStorage.getItem('starmusics.language');if(!raw)return activeLanguage;try{const parsed=JSON.parse(raw);if(I18N[parsed])return parsed;}catch{}return I18N[raw]?raw:activeLanguage;}catch{return activeLanguage;}}
function applyLanguage(lang,persist=true){if(!I18N[lang])lang='en';activeLanguage=lang;document.documentElement.lang=lang;document.documentElement.dir=lang==='fa'?'rtl':'ltr';document.documentElement.dataset.language=lang;if(persist){try{localStorage.setItem('starmusics.language',JSON.stringify(lang))}catch{}}
 const w=document.createTreeWalker(document.body,NodeFilter.SHOW_TEXT);let n;while(n=w.nextNode()){if(!languageOriginals.has(n))languageOriginals.set(n,n.nodeValue);const orig=languageOriginals.get(n),key=orig.trim();if(!key)continue;const translated=I18N[lang][key];if(translated)n.nodeValue=orig.replace(key,translated);else if(lang==='en')n.nodeValue=orig;}
 document.querySelectorAll('[placeholder],[aria-label],[title]').forEach(el=>['placeholder','aria-label','title'].forEach(a=>{if(!el.hasAttribute(a))return;const d='data-original-'+a;const key=el.getAttribute(d)||el.getAttribute(a);if(!el.hasAttribute(d))el.setAttribute(d,key);if(I18N[lang][key])el.setAttribute(a,I18N[lang][key]);else if(lang==='en')el.setAttribute(a,key)}));
 document.querySelectorAll('#language-menu [data-language]').forEach(b=>b.setAttribute('aria-checked',String(b.dataset.language===lang)));const menu=$('#language-menu');if(menu)menu.hidden=true;$('#btn-language')?.setAttribute('aria-expanded','false');}
function openEntity(kind,name){const panel=$('#entity-detail');if(!panel)return;let title=name,img='',kicker='',description='',meta='',tracks=[];
 if(kind==='artist'){const a=DATA.artists.find(x=>x.name===name);if(!a)return;title=a.name;img=a.img;kicker='ARTIST PROFILE';description=`Explore the sound, releases, and related discoveries around ${a.name}.`;meta='Artist · STARMUSICS catalogue';tracks=catalogTracks().filter(t=>t.artist===a.name).slice(0,5);if(!tracks.length)tracks=DATA.trending.slice(0,3).map(t=>({id:t.rank,title:t.track,artist:t.artist,img:t.img,duration:t.duration}));}
 else if(kind==='album'){const alias={'A Better Tomorrow':'r3','Sicko Mode (Remix)':'r2','Eternal Return':'r1','DS2':'r5','HajBazi':'r4'};const a=DATA.releases.find(x=>x.title===name)||DATA.releases.find(x=>x.subtitle===name)||DATA.releases.find(x=>x.id===alias[name]);if(!a)return;title=a.title;img=a.img;kicker='ALBUM EDITION';description=`A dedicated album page for ${a.title}, with listening details and related discovery.`;meta=`${a.subtitle} · ${fmt(a.duration||0)}`;tracks=[{id:a.id,title:a.title,artist:a.subtitle,img:a.img,duration:a.duration}];}
 else{title=name;img=DATA.playlists.find(p=>p.title.toLowerCase().includes(name.toLowerCase()))?.img||DATA.releases[0].img;kicker='GENRE GUIDE';description=`Explore the artists, releases, and sounds connected to ${name}.`;meta='Genre · Discovery guide';tracks=DATA.trending.slice(0,4).map(t=>({id:t.rank,title:t.track,artist:t.artist,img:t.img,duration:t.duration}));}
 $('#entity-title').textContent=title;$('#entity-kicker').textContent=kicker;$('#entity-description').textContent=description;$('#entity-meta').textContent=meta;$('#entity-art').style.backgroundImage=`url("${img}")`;$('#entity-list-title').textContent=kind==='genre'?'Essential listening':'Popular tracks';
 $('#entity-track-list').innerHTML=tracks.map(t=>`<button type="button" class="track-row entity-track" data-title="${escapeHTML(t.title)}" data-artist="${escapeHTML(t.artist)}" data-img="${escapeHTML(t.img||img)}" data-duration="${t.duration||200}" data-id="${escapeHTML(t.id)}"><img src="${escapeHTML(t.img||img)}" alt=""><span><strong>${escapeHTML(t.title)}</strong><small>${escapeHTML(t.artist)}</small></span><span class="entity-track-play">▶</span></button>`).join('');
 $('#entity-related').innerHTML=(kind==='artist'?DATA.releases.slice(0,3).map(r=>`<button type="button" class="entity-related-card" data-open-album="${escapeHTML(r.title)}"><span class="entity-related-art" style="background-image:url('${r.img}')"></span><strong>${escapeHTML(r.title)}</strong><small>${escapeHTML(r.subtitle)}</small></button>`):DATA.artists.slice(0,4).map(a=>`<button type="button" class="entity-related-card" data-open-artist="${escapeHTML(a.name)}"><span class="entity-related-art" style="background-image:url('${a.img}')"></span><strong>${escapeHTML(a.name)}</strong><small>Artist</small></button>`)).join('');panel.hidden=false;document.body.classList.add('entity-open');}
function closeEntity(){$('#entity-detail').hidden=true;document.body.classList.remove('entity-open');}

function readRawLocal(key, fallback = null) { try { return localStorage.getItem(key) ?? fallback; } catch { return fallback; } }
let activeLanguage = 'en';

const state = {
  playing: false,
  current: null,
  progress: 0,
  volume: 70,
  liked: new Set(),
  shuffle: false,
  repeat: false,
  queue: [...DATA.trending.slice(1)],
  selectedDiscussion: 0,
  selectedPlaylistIndex: null,
  timer: null,
  history: [],
  playerMode: ['dock','page','mini'].includes(readRawLocal('starmusics.playerMode')) ? readRawLocal('starmusics.playerMode') : 'dock',
  playerModeBeforeMini: ['dock','page'].includes(readRawLocal('starmusics.playerModeBeforeMini')) ? readRawLocal('starmusics.playerModeBeforeMini') : 'dock',
  audioObjectUrl: null,
};

const $ = (s, p = document) => p.querySelector(s);
const $$ = (s, p = document) => [...p.querySelectorAll(s)];

function fmt(sec) {
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60);
  return `${m}:${s.toString().padStart(2, '0')}`;
}

function toast(msg) {
  const el = $('#toast');
  el.textContent = msg;
  el.hidden = false;
  clearTimeout(el._t);
  el._t = setTimeout(() => { el.hidden = true; }, 2200);
}

function renderCards(container, items, isRelease) {
  container.innerHTML = items.map(item => {
    if (item.nirvana) {
      return `<article class="card" data-id="${item.id}">
        <div class="card-cover nirvana">
          <span class="label">NIRVANA</span>
          <div class="smiley">☺</div>
          <div class="play-overlay"><button class="play-btn" aria-label="Play"><i class="las la-play" aria-hidden="true"></i></button></div>
        </div>
        <h3>${item.title}</h3>
        <p>${item.subtitle}</p>
      </article>`;
    }
    return `<article class="card" data-id="${item.id}" ${isRelease ? `data-open-album="${escapeHTML(item.title)}"` : ''} data-title="${item.title}" data-artist="${item.subtitle}" data-img="${item.img}" data-duration="${item.duration || 200}">
      <div class="card-cover" style="background-image:url('${item.img}')">
        <div class="play-overlay"><button class="play-btn" aria-label="Play"><i class="las la-play" aria-hidden="true"></i></button></div>
      </div>
      <h3>${item.title}${item.tag ? ` <span class="tag">${item.tag}</span>` : ''}</h3>
      <p>${item.subtitle}</p>
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
  return DATA.discussions[index].replies + comments.filter(c => c.topic === index).length;
}

function renderDiscussions() {
  $('#discussion-list').innerHTML = DATA.discussions.map((d, i) => `
    <li data-open-topic="${i}" tabindex="0" role="button">
      <div class="avatars">${Array(d.avatars).fill('<span></span>').join('')}</div>
      <div>
        <strong>${escapeHTML(d.title)}</strong>
        <span>${discussionCount(i)} replies · ${escapeHTML(d.time)}</span>
      </div>
    </li>
  `).join('');
}

function renderHomeDiscussions() {
  const el = $('#home-discussion-list');
  if (!el) return;
  el.innerHTML = DATA.discussions.slice(0, 4).map((d, i) => `<button type="button" class="home-discussion-card" data-open-topic="${i}"><span class="discussion-kicker">Community topic</span><strong>${escapeHTML(d.title)}</strong><span>${discussionCount(i)} replies · ${escapeHTML(d.time)}</span></button>`).join('');
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
}

function renderGenres() {
  const g = $('#genre-grid');
  if (!g) return;
  g.innerHTML = DATA.genres.map(name => `<button type="button" class="genre-chip" data-open-genre="${escapeHTML(name)}">${escapeHTML(name)}</button>`).join('');
}

function updatePlayerUI() {
  const c = state.current;
  const player = $('#music-player');
  if (!c) { if (player) player.hidden = true; return; }
  if (player) player.hidden = false;
  $('#player-art').src = c.img || '';
  $('#player-title').textContent = c.title;
  $('#player-artist').textContent = c.artist;
  const audio = $('#audio-engine');
  const duration = Number.isFinite(audio?.duration) && audio.duration > 0 ? audio.duration : c.duration || 0;
  if (Number.isFinite(audio?.currentTime) && audio.src) state.progress = audio.currentTime;
  $('#time-total').textContent = fmt(duration);
  $('#time-current').textContent = fmt(state.progress);
  const pct = duration ? Math.min(100, (state.progress / duration) * 100) : 0;
  $('#progress-fill').style.width = pct + '%';
  $('#progress-thumb').style.left = pct + '%';
  $('#progress-bar').setAttribute('aria-valuenow', Math.round(pct));
  const playIcon = `<i class="las la-play" aria-hidden="true"></i>`;
  const pauseIcon = `<i class="las la-pause" aria-hidden="true"></i>`;
  $('#btn-play').innerHTML = state.playing ? pauseIcon : playIcon;
  $('#btn-play').title = state.playing ? 'Pause' : 'Play';
  $('#btn-play').setAttribute('aria-label', state.playing ? 'Pause' : 'Play');
  $('#btn-player-mode')?.setAttribute('title', `Player mode: ${state.playerMode}`);
  $('#btn-player-mode').innerHTML = state.playerMode === 'dock' ? '<i class="las la-window-maximize" aria-hidden="true"></i>' : state.playerMode === 'page' ? '<i class="las la-tablet-alt" aria-hidden="true"></i>' : '<i class="las la-compress" aria-hidden="true"></i>';
  const modal = $('#now-playing-modal');
  if (modal) modal.style.setProperty('--np-artwork', c.img ? `url("${String(c.img).replace(/["\\]/g, '\\$&')}")` : 'none');
  $('#np-art')?.classList.toggle('is-playing', state.playing);
  $('#np-sheet')?.classList.toggle('is-playing', state.playing);
  const miniPlay = $('#btn-mini-play');
  if (miniPlay) {
    miniPlay.innerHTML = state.playing ? '<i class="las la-pause" aria-hidden="true"></i>' : '<i class="las la-play" aria-hidden="true"></i>';
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
      modalPlay.innerHTML = state.playing ? '<i class="las la-pause" aria-hidden="true"></i>' : '<i class="las la-play" aria-hidden="true"></i>';
      modalPlay.setAttribute('aria-label', state.playing ? 'Pause' : 'Play');
      modalPlay.title = state.playing ? 'Pause' : 'Play';
    }
  }
}

function setPlayerMode(mode) {
  if (!['dock', 'page', 'mini'].includes(mode)) return;
  const previous = state.playerMode;
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
  if (modal) modal.hidden = !(mode === 'page' && state.current);
  $$('[data-player-mode]').forEach(b => {
    b.classList.toggle('active', b.dataset.playerMode === mode);
    b.setAttribute('aria-pressed', String(b.dataset.playerMode === mode));
  });
  updatePlayerUI();
}
function playTrack(track) {
  const audio = $('#audio-engine');
  state.current = { id: track.id || track.title, title: track.title || track.track,
    artist: track.artist || track.subtitle, img: track.img || '', duration: track.duration || 0,
    tag: track.tag, audioUrl: track.audioUrl || track.audio || '' };
  state.history = [state.current, ...state.history.filter(t => t.id !== state.current.id)].slice(0, 30);
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
  if (!audio?.src) { $('#audio-file-input')?.click(); toast('Choose an audio file for this track'); return; }
  if (audio.paused) audio.play().then(() => { state.playing = true; updatePlayerUI(); }).catch(() => toast('Playback failed. Try another audio file.'));
  else { audio.pause(); state.playing = false; updatePlayerUI(); }
}

function nextTrack() {
  if (state.queue.length) {
    const next = state.queue.shift();
    playTrack({ title: next.track || next.title, artist: next.artist, img: next.img, duration: next.duration, id: next.rank || next.id, audioUrl: next.audioUrl });
  } else { state.playing = false; state.progress = 0; const audio=$('#audio-engine'); audio?.pause(); if(audio) audio.currentTime=0; updatePlayerUI(); }
}

function prevTrack() {
  const audio = $('#audio-engine');
  if (audio?.src && audio.currentTime > 3) audio.currentTime = 0;
  else toast('No previous track in the queue yet');
  updatePlayerUI();
}

function updateQueueUI() {
  const now = $('#queue-now-track');
  const c = state.current;
  if (!c) { now.innerHTML = '<span class="page-description">Choose a track to start listening.</span>'; $('#queue-list').innerHTML = ''; return; }
  now.innerHTML = `<img src="${escapeHTML(c.img || '')}" alt="" /><div><strong>${escapeHTML(c.title)}</strong><span>${escapeHTML(c.artist)}</span></div>`;
  $('#queue-list').innerHTML = state.queue.map(t => `
    <div class="q-item" data-id="${t.rank || t.id || t.track || t.title}" data-title="${escapeHTML(t.track || t.title)}" data-artist="${escapeHTML(t.artist)}" data-img="${escapeHTML(t.img || '')}" data-duration="${t.duration}">
      <img src="${t.img}" alt="" />
      <div><strong>${t.track || t.title}</strong><span>${t.artist}</span></div>
    </div>
  `).join('');
}

function resolveTrack(id) {
  if (state.current && String(state.current.id) === String(id)) return state.current;
  const recent = state.history.find(t => String(t.id) === String(id));
  if (recent) return recent;
  const release = DATA.releases.find(t => String(t.id) === String(id));
  if (release) return { id: release.id, title: release.title, artist: release.subtitle, img: release.img, duration: release.duration };
  const trending = DATA.trending.find(t => String(t.rank) === String(id));
  if (trending) return { id: String(trending.rank), title: trending.track, artist: trending.artist, img: trending.img, duration: trending.duration };
  return null;
}

function likedTrackItems() {
  return [...state.liked].map(resolveTrack).filter(Boolean);
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
state.liked = new Set(Array.isArray(savedLiked) ? savedLiked.filter(v => ['string', 'number'].includes(typeof v)).map(String) : []);
function saveLocal(key, value) { try { localStorage.setItem(key, JSON.stringify(value)); } catch { toast('Could not save in this browser'); } }
const savedPlaylists = loadLocal('starmusics.playlists', []);
let userPlaylists = Array.isArray(savedPlaylists) ? savedPlaylists.filter(pl => pl && typeof pl.name === 'string' && Array.isArray(pl.tracks)).map((pl, i) => ({ id: typeof pl.id === 'string' ? pl.id : `local-${i}-${String(pl.name).toLowerCase().replace(/[^a-z0-9]+/g,'-')}`, name: pl.name.slice(0,60), tracks: pl.tracks.map(normalizePlaylistTrack).filter(Boolean) })) : [];
const savedProfile = loadLocal('starmusics.profile', {});
let profile = savedProfile && typeof savedProfile === 'object' && !Array.isArray(savedProfile) ? { name: typeof savedProfile.name === 'string' ? savedProfile.name.slice(0,32) : 'Listener', bio: typeof savedProfile.bio === 'string' ? savedProfile.bio.slice(0,180) : '' } : { name: 'Listener', bio: '' };
const savedComments = loadLocal('starmusics.comments', []);
let comments = Array.isArray(savedComments) ? savedComments.filter(c => c && Number.isInteger(c.topic) && typeof c.text === 'string').map(c => ({ topic: c.topic, text: c.text.slice(0,800), created: typeof c.created === 'string' ? c.created : new Date().toISOString() })) : [];
function escapeHTML(value) { return String(value).replace(/[&<>"']/g, ch => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch])); }

function catalogTracks() {
  const releases = DATA.releases.map(t => ({ id: String(t.id), title: t.title, artist: t.subtitle, img: t.img, duration: t.duration || 200 }));
  const trending = DATA.trending.map(t => ({ id: String(t.rank), title: t.track, artist: t.artist, img: t.img, duration: t.duration || 200 }));
  const byId = new Map(); [...releases, ...trending].forEach(t => byId.set(String(t.id), t));
  return [...byId.values()];
}
function normalizePlaylistTrack(track) {
  if (track && typeof track === 'object') {
    const title = typeof track.title === 'string' ? track.title : (typeof track.track === 'string' ? track.track : '');
    const artist = typeof track.artist === 'string' ? track.artist : (typeof track.subtitle === 'string' ? track.subtitle : 'Unknown artist');
    if (!title) return null;
    return { id: String(track.id || title), title: title.slice(0,120), artist: artist.slice(0,120), img: typeof track.img === 'string' ? track.img : '', duration: Math.max(1, Number(track.duration) || 200) };
  }
  if (typeof track === 'string' || typeof track === 'number') {
    const resolved = resolveTrack(String(track)) || catalogTracks().find(t => t.title === String(track));
    return resolved ? { ...resolved } : null;
  }
  return null;
}
function savePlaylists() { saveLocal('starmusics.playlists', userPlaylists); }
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
function renderAchievements() {
 const el = $('#achievement-grid'); if (!el) return;
 const liked = state.liked.size;
 const items = [{icon:'✦',title:'First listen',desc:state.current ? 'You started listening' : 'Play your first track',earned:!!state.current},{icon:'♡',title:'Curator',desc:`${liked}/5 tracks liked`,earned:liked>=5},{icon:'☷',title:'Collector',desc:`${userPlaylists.length}/3 playlists created`,earned:userPlaylists.length>=3}];
 el.innerHTML = items.map(a=>`<article class="achievement"><div class="medal">${a.earned?a.icon:'○'}</div><strong>${a.title}</strong><span>${a.desc}</span></article>`).join('');
}
function renderComments() {
 const el = $('#comments-list'); if (!el) return;
 const rows = comments.filter(c => c.topic === state.selectedDiscussion);
 el.innerHTML = rows.length ? rows.map(c=>`<article class="comment-item">${escapeHTML(c.text)}<time>${new Date(c.created).toLocaleString()}</time></article>`).join('') : '<p class="page-description">No comments yet. Start the conversation.</p>';
}
function renderDiscussionPage() {
 const el = $('#discussion-page-list'); if (!el) return;
 el.innerHTML = DATA.discussions.map((d,i)=>`<li class="${i===state.selectedDiscussion?'selected':''}" data-topic="${i}" tabindex="0" role="button"><strong>${escapeHTML(d.title)}</strong><span>${discussionCount(i)} replies · ${escapeHTML(d.time)}</span></li>`).join('');
 const selected = DATA.discussions[state.selectedDiscussion];
 const title = $('#discussion-thread-title');
 if (title && selected) title.textContent = selected.title;
 renderComments();
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
  renderPlaylistDetail();
}

function renderAlbumPage() {
  const el = $('#albums-page-row');
  if (!el) return;
  const albums = DATA.releases.filter((r, i) => i !== 1).map((r, i) => ({...r, title: ['Eternal Return','A Better Tomorrow','DS2','HajBazi'][i] || r.title, subtitle: r.subtitle}));
  renderCards(el, albums, true);
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
  $$('.nav-item').forEach(n => n.classList.remove('active'));
  $$('.mobile-nav-item').forEach(n => n.classList.toggle('active', n.dataset.view === name));
  const nav = $(`.nav-item[data-view="${name}"]`);
  if (nav) nav.classList.add('active');
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
  const results = $('#search-results');
  const list = $('#search-list');
  if (!q.trim()) {
    results.hidden = true;
    return;
  }
  results.hidden = false;
  const ql = q.toLowerCase();
  const hits = [];
  DATA.releases.forEach(r => {
    if (r.title.toLowerCase().includes(ql) || r.subtitle.toLowerCase().includes(ql))
      hits.push({ ...r, id: r.id, type: 'Track' });
  });
  DATA.trending.forEach(t => {
    if (t.track.toLowerCase().includes(ql) || t.artist.toLowerCase().includes(ql))
      hits.push({ id: String(t.rank), title: t.track, subtitle: t.artist, img: t.img, duration: t.duration, type: 'Track' });
  });
  DATA.artists.forEach(a => {
    if (a.name.toLowerCase().includes(ql))
      hits.push({ title: a.name, subtitle: 'Artist', img: a.img, type: 'Artist' });
  });
  DATA.playlists.forEach(p => {
    if (p.title.toLowerCase().includes(ql))
      hits.push({ title: p.title, subtitle: p.subtitle, img: p.img || DATA.playlists[0].img, type: 'Playlist' });
  });
  if (!hits.length) {
    list.innerHTML = '<p class="search-hint">No results found</p>';
    return;
  }
  list.innerHTML = hits.slice(0, 8).map(h => `
    <div class="search-item" data-id="${escapeHTML(h.id || h.title)}" data-title="${escapeHTML(h.title)}" data-artist="${escapeHTML(h.subtitle)}" data-img="${escapeHTML(h.img || '')}" data-duration="${h.duration || 200}">
      <img src="${escapeHTML(h.img || 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=80')}" alt="" />
      <div><strong>${escapeHTML(h.title)}</strong><span>${escapeHTML(h.type)} · ${escapeHTML(h.subtitle)}</span></div>
    </div>
  `).join('');
}

// Init
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
  renderCards($('#playlists-row'), DATA.playlists);
  renderCards($('#releases-row'), DATA.releases, true);
  renderArtists();
  renderTrending();
  renderDiscussions();
  renderHomeDiscussions();
  renderLibrary();
  updatePlayerUI();
  updateQueueUI();
  $('#profile-name').textContent = profile.name || 'Listener';
  if ($('#profile-display-name')) $('#profile-display-name').value = profile.name || '';
  $('#profile-bio').value = profile.bio || '';
  updateProfileCount();
  renderUserPlaylists(); renderAchievements(); renderDiscussionPage(); renderPlaylistPage(); renderAlbumPage(); renderArtistsPage(); renderRecent();

  // Nav
  $$('.nav-item[data-view]').forEach(item => {
    item.addEventListener('click', e => { e.preventDefault(); switchView(item.dataset.view); });
  });
  $$('.mobile-nav-item[data-view]').forEach(item => item.addEventListener('click', () => switchView(item.dataset.view)));
  $('#btn-create-playlist-page')?.addEventListener('click', createPlaylist);

  // Profile shortcut in the top bar
  const profileButton = $('#btn-profile');
  profileButton?.addEventListener('click', () => switchView('profile'));

  // Play / Pause
  $('#btn-play').addEventListener('click', togglePlay);
  $('.btn-play')?.addEventListener('click', () => {
    playTrack({ title: 'Persian Trap Mix', artist: 'STARMUSICS', img: DATA.playlists[0].img, duration: 240, id: 'pt' });
  });

  // Card plays
  document.addEventListener('click', e => {
    const playBtn = e.target.closest('.play-btn');
    const card = e.target.closest('.card[data-title]');
    const trend = e.target.closest('.trending-list li');
    const searchItem = e.target.closest('.search-item');
    const trackRow = e.target.closest('.track-row, .q-item');
    const genreChip = e.target.closest('[data-genre]');
    const deletePlaylist = e.target.closest('[data-delete-playlist]');
    const openPlaylistCard = e.target.closest('[data-open-playlist]');
    const addPlaylistTrack = e.target.closest('[data-add-playlist-track]');
    const removePlaylistTrack = e.target.closest('[data-remove-playlist-track]');
    const openTopic = e.target.closest('[data-open-topic]');
    const goView = e.target.closest('[data-go-view]');
    const openArtist=e.target.closest('[data-open-artist]'), openAlbum=e.target.closest('[data-open-album]'), openGenre=e.target.closest('[data-open-genre]');
    if(openArtist){openEntity('artist',openArtist.dataset.openArtist);return;} if(openAlbum&&!e.target.closest('.play-btn')){openEntity('album',openAlbum.dataset.openAlbum);return;} if(openGenre){openEntity('genre',openGenre.dataset.openGenre);return;}
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
    if (genreChip) { $('#search-input').value = genreChip.dataset.genre; search(genreChip.dataset.genre); $('#search-input').focus(); return; }
    if (deletePlaylist && !e.target.closest('#user-playlists-row')) { const i=Number(deletePlaylist.dataset.deletePlaylist); if (userPlaylists[i] && confirm(`Delete playlist “${userPlaylists[i].name}”?`)) { userPlaylists.splice(i,1); if(state.selectedPlaylistIndex===i)state.selectedPlaylistIndex=null;else if(state.selectedPlaylistIndex>i)state.selectedPlaylistIndex--; savePlaylists(); renderUserPlaylists(); renderPlaylistPage(); renderLibrary(); renderAchievements(); } return; }

    if (playBtn && card) {
      e.stopPropagation();
      playTrack(card.dataset);
    } else if (card?.dataset.title) {
      playTrack(card.dataset);
    } else if (trend) {
      playTrack(trend.dataset);
    } else if (searchItem) {
      playTrack(searchItem.dataset);
      $('#search-results').hidden = true;
      $('#search-input').value = '';
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

  // Volume
  $('#volume-bar').addEventListener('keydown', e => {
    let next = state.volume;
    if (e.key === 'ArrowRight' || e.key === 'ArrowUp') next += 5;
    else if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') next -= 5;
    else if (e.key === 'Home') next = 0;
    else if (e.key === 'End') next = 100;
    else return;
    e.preventDefault();
    state.volume = Math.max(0, Math.min(100, next));
    $('#volume-fill').style.width = state.volume + '%';
    $('#volume-bar').setAttribute('aria-valuenow', state.volume);
    $('#audio-engine').volume = state.volume / 100;
    $('#audio-engine').volume = state.volume / 100;
  });

  $('#volume-bar').addEventListener('click', e => {
    const rect = e.currentTarget.getBoundingClientRect();
    const pct = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    state.volume = Math.round(pct * 100);
    $('#volume-fill').style.width = state.volume + '%';
    $('#volume-bar').setAttribute('aria-valuenow', state.volume);
  });

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
    saveLocal('starmusics.liked', [...state.liked]);
    updatePlayerUI();
    updateLikedUI(); renderAchievements(); renderLibrary();
  });

  // Shuffle / Repeat
  $('#btn-shuffle').addEventListener('click', () => {
    state.shuffle = !state.shuffle;
    $('#btn-shuffle').classList.toggle('active', state.shuffle);
    toast(state.shuffle ? 'Shuffle on' : 'Shuffle off');
  });
  $('#btn-volume')?.addEventListener('click', () => { const a=$('#audio-engine'); if(!a)return; a.muted=!a.muted; $('#btn-volume').classList.toggle('active',a.muted); toast(a.muted?'Muted':'Volume on'); });
  $('#btn-repeat').addEventListener('click', () => {
    state.repeat = !state.repeat;
    $('#btn-repeat').classList.toggle('active', state.repeat);
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

  // Search
  const searchInput = $('#search-input');
  searchInput.addEventListener('input', () => search(searchInput.value));
  searchInput.addEventListener('focus', () => { if (searchInput.value) search(searchInput.value); });
  document.addEventListener('click', e => {
    if (!e.target.closest('.search-wrap') && !e.target.closest('.search-results')) {
      $('#search-results').hidden = true;
    }
  });
  document.addEventListener('keydown', e => {
    const playlistCard = e.target.closest?.('[data-open-playlist]');
    if (playlistCard && (e.key === 'Enter' || e.key === ' ') && !e.target.closest('button')) { e.preventDefault(); switchView('playlists'); openPlaylist(Number(playlistCard.dataset.openPlaylist)); }
    if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
      e.preventDefault();
      searchInput.focus();
    }
    if (e.code === 'Space' && e.target === document.body) {
      e.preventDefault();
      togglePlay();
    }
    if (e.key === 'Escape') {
      $('#search-results').hidden = true;
      $('#queue-panel').hidden = true;
      $('#now-playing-modal').hidden = true;
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
  $('#btn-save-profile')?.addEventListener('click', () => { profile.name = ($('#profile-display-name')?.value || '').trim().slice(0,32) || 'Listener'; profile.bio = $('#profile-bio').value.trim().slice(0,180); saveLocal('starmusics.profile', profile); $('#profile-name').textContent = profile.name; if ($('#profile-display-name')) $('#profile-display-name').value = profile.name; updateProfileCount(); toast('Profile saved on this device'); });
  $('#discussion-page-list')?.addEventListener('click', e => { const row=e.target.closest('[data-topic]'); if(!row)return; state.selectedDiscussion=Number(row.dataset.topic); renderDiscussionPage(); });
  $('#discussion-page-list')?.addEventListener('keydown', e => { if(e.key==='Enter'||e.key===' '){ const row=e.target.closest('[data-topic]'); if(row){e.preventDefault();state.selectedDiscussion=Number(row.dataset.topic);renderDiscussionPage();}} });
  $('#comment-form')?.addEventListener('submit', e => { e.preventDefault(); const text=$('#comment-input').value.trim(); if(!text)return; comments.push({topic:state.selectedDiscussion,text,created:new Date().toISOString()}); saveLocal('starmusics.comments',comments); $('#comment-input').value=''; renderDiscussionPage(); renderDiscussions(); renderHomeDiscussions(); toast('Comment saved on this device'); });
  $('#user-playlists-row')?.addEventListener('click', e => { const b=e.target.closest('[data-delete-playlist]'); if(!b)return; const i=Number(b.dataset.deletePlaylist); if(userPlaylists[i] && confirm(`Delete playlist “${userPlaylists[i].name}”?`)){userPlaylists.splice(i,1);if(state.selectedPlaylistIndex===i)state.selectedPlaylistIndex=null;else if(state.selectedPlaylistIndex>i)state.selectedPlaylistIndex--;savePlaylists();renderUserPlaylists();renderPlaylistPage();renderLibrary();renderAchievements();} });
  $('#btn-close-playlist')?.addEventListener('click', () => { state.selectedPlaylistIndex = null; renderPlaylistDetail(); });
  $('#btn-play-playlist')?.addEventListener('click', () => { const pl=userPlaylists[state.selectedPlaylistIndex]; if(!pl || !pl.tracks.length){toast('Add a track to this playlist first');return;} state.queue=pl.tracks.slice(1).map(t=>({...t,track:t.title})); playTrack(pl.tracks[0]); toast(`Playing playlist: ${pl.name}`); });
  $('#btn-notifications')?.addEventListener('click', () => toast('No new notifications'));
  $('.btn-add')?.addEventListener('click', () => toast('Saved to Your Library'));
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
  $('.np-backdrop')?.addEventListener('click', () => setPlayerMode('dock'));
  $('#btn-player-mode')?.addEventListener('click', () => setPlayerMode(state.playerMode === 'dock' ? 'page' : state.playerMode === 'page' ? 'mini' : (state.playerModeBeforeMini || 'dock')));
  $('#btn-mini-play')?.addEventListener('click', togglePlay);
  $('#btn-mini-restore')?.addEventListener('click', () => setPlayerMode(state.playerModeBeforeMini || 'dock'));
  $('#btn-mini-expand')?.addEventListener('click', () => setPlayerMode('page'));
  $$('[data-player-mode]').forEach(b => b.addEventListener('click', () => setPlayerMode(b.dataset.playerMode)));
  $('#btn-add-audio')?.addEventListener('click', () => $('#audio-file-input')?.click());
  $('#audio-file-input')?.addEventListener('change', e => {
    const file = e.target.files?.[0], audio = $('#audio-engine'); if (!file || !audio || !state.current) return;
    if (state.audioObjectUrl) URL.revokeObjectURL(state.audioObjectUrl);
    state.audioObjectUrl = URL.createObjectURL(file); audio.src = state.audioObjectUrl;
    state.current.audioUrl = state.audioObjectUrl; state.current.title = state.current.title || file.name.replace(/\.[^.]+$/, '');
    audio.play().then(() => { state.playing = true; updatePlayerUI(); toast(`Playing ${file.name}`); }).catch(() => toast('This audio file could not be played.'));
  });
  const audioEngine = $('#audio-engine');
  audioEngine?.addEventListener('timeupdate', () => { state.progress = audioEngine.currentTime || 0; updatePlayerUI(); });
  audioEngine?.addEventListener('loadedmetadata', updatePlayerUI);
  audioEngine?.addEventListener('play', () => { state.playing = true; updatePlayerUI(); });
  audioEngine?.addEventListener('pause', () => { state.playing = false; updatePlayerUI(); });
  audioEngine?.addEventListener('ended', () => { if (state.repeat) { audioEngine.currentTime = 0; audioEngine.play(); } else nextTrack(); });
  audioEngine?.addEventListener('error', () => { state.playing = false; updatePlayerUI(); });
  $('#btn-share-lyrics')?.addEventListener('click', async () => { const c=state.current; if(!c){toast('Choose a track first');return;} const text=`${c.title} — ${c.artist}\nSTARMUSICS · Music, with intention.`; try { await navigator.clipboard.writeText(text); toast('Track card text copied. Add licensed lyrics before sharing a lyrics card.'); } catch { toast('Track card: '+text); } });
  setPlayerMode(state.playerMode);
});
