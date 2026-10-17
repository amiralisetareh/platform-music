/* STARMUSICS catalogue model. Catalog metadata is not a grant to distribute audio. */
(function attachCatalogRuntime(root) {
  'use strict';
  const allowedRights = new Set(['licensed', 'owned', 'public-domain']);
  const entityTypes = ['tracks', 'artists', 'albums', 'playlists', 'genres'];
  const isNonEmpty = value => typeof value === 'string' && value.trim().length > 0;
  const isVerifiedTimestamp = value => {
    if (typeof value !== 'string') return false;
    const match = value.match(/^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2})(?:\.(\d{1,3}))?(Z|([+-])(\d{2}):(\d{2}))$/);
    if (!match) return false;
    const [, y, mo, d, hh, mm, ss, , zone, , offH, offM] = match;
    const year = Number(y), month = Number(mo), day = Number(d);
    const hour = Number(hh), minute = Number(mm), second = Number(ss);
    const days = [31, (year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0)) ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
    if (year < 1 || month < 1 || month > 12 || day < 1 || day > days[month - 1]) return false;
    if (hour > 23 || minute > 59 || second > 59) return false;
    if (zone !== 'Z') {
      const offsetHour = Number(offH), offsetMinute = Number(offM);
      if (offsetHour > 14 || offsetMinute > 59 || (offsetHour === 14 && offsetMinute !== 0)) return false;
    }
    return Number.isFinite(Date.parse(value));
  };
  const isAllowedTerritory = value => value === '*' || (typeof value === 'string' && /^[A-Z]{2}$/.test(value));
  const isCanonicalId = value => typeof value === 'string' && /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(value);

  function validateCatalog(source) {
    const errors = [];
    if (!source || typeof source !== 'object' || Array.isArray(source) || source.schemaVersion !== 1) {
      return { valid: false, errors: ['schemaVersion must be 1 on a catalogue object'] };
    }
    if (!isNonEmpty(source.catalogId)) errors.push('catalogId must be a non-empty string');
    if (!source.policy || source.policy.catalogMode !== 'metadata-first' || source.policy.audioDelivery !== 'allowlisted-sources-only' || source.policy.defaultRightsStatus !== 'unverified' || source.policy.allowUnverifiedRemoteAudio !== false) {
      errors.push('policy must preserve metadata-first, allowlisted-only audio with unverified remote audio disabled');
    }
    if (!source.editorial || typeof source.editorial !== 'object' || Array.isArray(source.editorial)) errors.push('editorial must be an object');
    if (!Array.isArray(source.discussionTopics)) errors.push('discussionTopics must be an array');

    for (const type of entityTypes) {
      if (!Array.isArray(source[type])) {
        errors.push(`${type} must be an array`);
        continue;
      }
      const ids = new Set();
      for (const record of source[type]) {
        if (!record || typeof record !== 'object' || Array.isArray(record) || !isNonEmpty(record.id)) {
          errors.push(`${type} contains a record without an id`);
          continue;
        }
        if (!isCanonicalId(record.id)) errors.push(`${type} id ${record.id} must be a lowercase kebab-case canonical ID`);
        if (ids.has(record.id)) errors.push(`${type} contains duplicate id ${record.id}`);
        ids.add(record.id);
      }
    }

    const artists = Array.isArray(source.artists) ? source.artists : [];
    const albums = Array.isArray(source.albums) ? source.albums : [];
    const tracks = Array.isArray(source.tracks) ? source.tracks : [];
    const playlists = Array.isArray(source.playlists) ? source.playlists : [];
    const genres = Array.isArray(source.genres) ? source.genres : [];
    const artistIds = new Set(artists.filter(Boolean).map(a => a.id));
    const albumIds = new Set(albums.filter(Boolean).map(a => a.id));
    const genreIds = new Set(genres.filter(Boolean).map(g => g.id));
    const trackIds = new Set(tracks.filter(Boolean).map(t => t.id));

    for (const artist of artists) {
      if (!artist || typeof artist !== 'object') continue;
      if (!isNonEmpty(artist.name)) errors.push(`Artist ${artist.id} must have a non-empty name`);
      if (artist.artworkUrl != null && typeof artist.artworkUrl !== 'string') errors.push(`Artist ${artist.id} artworkUrl must be a string or null`);
      if (artist.biography != null && typeof artist.biography !== 'string') errors.push(`Artist ${artist.id} biography must be a string or null`);
    }

    if (!Array.isArray(source.audioSources)) errors.push('audioSources must be an array');
    const audioSourceIds = new Set();
    for (const audioSource of Array.isArray(source.audioSources) ? source.audioSources : []) {
      if (!audioSource || typeof audioSource !== 'object' || !isNonEmpty(audioSource.id)) {
        errors.push('audioSources contains a record without an id');
        continue;
      }
      if (!isCanonicalId(audioSource.id)) errors.push(`audioSources id ${audioSource.id} must be a lowercase kebab-case canonical ID`);
      if (audioSourceIds.has(audioSource.id)) errors.push(`audioSources contains duplicate id ${audioSource.id}`);
      audioSourceIds.add(audioSource.id);
      if (!['active', 'inactive'].includes(audioSource.status)) errors.push(`Audio source ${audioSource.id} has an invalid status`);
      if (!isNonEmpty(audioSource.url)) errors.push(`Audio source ${audioSource.id} must declare a URL`);
      if (!/^audio\/[a-z0-9.+-]+$/i.test(audioSource.mimeType || '')) errors.push(`Audio source ${audioSource.id} must declare a valid audio MIME type`);
      if (!Array.isArray(audioSource.allowedHosts) || !audioSource.allowedHosts.length || audioSource.allowedHosts.some(host => !isNonEmpty(host))) {
        errors.push(`Audio source ${audioSource.id} must have a non-empty host allowlist`);
      }
      if (audioSource.status === 'active' && typeof audioSource.url === 'string' && audioSource.url.trim()) {
        try {
          const parsed = new URL(audioSource.url, 'https://starmusics.invalid');
          const relativeSameOrigin = audioSource.url.startsWith('/') && !audioSource.url.startsWith('//') && parsed.origin === 'https://starmusics.invalid';
          if ((!relativeSameOrigin && parsed.protocol !== 'https:') || parsed.username || parsed.password || parsed.hash) {
            errors.push(`Active audio source ${audioSource.id} must use HTTPS or a same-origin path without credentials or fragments`);
          }
          if (!relativeSameOrigin && (!Array.isArray(audioSource.allowedHosts) || !audioSource.allowedHosts.includes(parsed.host))) {
            errors.push(`Active audio source ${audioSource.id} host must match its allowlist`);
          }
        } catch { errors.push(`Audio source ${audioSource.id} has an invalid URL`); }
      }
    }

    for (const track of tracks) {
      if (!track || typeof track !== 'object') continue;
      if (!isNonEmpty(track.title)) errors.push(`Track ${track.id} must have a non-empty title`);
      if (typeof track.artistId !== 'string' || !artistIds.has(track.artistId)) errors.push(`Track ${track.id} references missing artist ${track.artistId}`);
      if (!Object.prototype.hasOwnProperty.call(track, 'albumId') || (track.albumId !== null && (typeof track.albumId !== 'string' || !albumIds.has(track.albumId)))) errors.push(`Track ${track.id} must have a valid albumId or null`);
      if (!Array.isArray(track.genreIds)) errors.push(`Track ${track.id} must have a genreIds array`);
      else {
        if (new Set(track.genreIds).size !== track.genreIds.length) errors.push(`Track ${track.id} contains duplicate genre IDs`);
        for (const genreId of track.genreIds) if (!genreIds.has(genreId)) errors.push(`Track ${track.id} references missing genre ${genreId}`);
      }
      if (!Number.isInteger(track.durationMs) || track.durationMs < 1) errors.push(`Track ${track.id} must have a positive integer durationMs`);
      if (!isNonEmpty(track.availability)) errors.push(`Track ${track.id} must declare availability`);
      if (!track.audio || typeof track.audio !== 'object' || !['not-configured', 'ready', 'blocked'].includes(track.audio.status)) errors.push(`Track ${track.id} has an invalid audio status`);
      else {
        for (const field of ['sourceId', 'url', 'mimeType']) if (!Object.prototype.hasOwnProperty.call(track.audio, field)) errors.push(`Track ${track.id} audio must declare ${field}`);
        for (const field of ['sourceId', 'url', 'mimeType']) if (track.audio[field] !== null && typeof track.audio[field] !== 'string') errors.push(`Track ${track.id} audio.${field} must be a string or null`);
        if (track.audio.url) errors.push(`Track ${track.id} must use an allowlisted audio source, not a direct audio URL`);
        if (track.audio.sourceId && !audioSourceIds.has(track.audio.sourceId)) errors.push(`Track ${track.id} references missing audio source ${track.audio.sourceId}`);
        if (track.audio.status === 'ready' && !track.audio.sourceId) errors.push(`Ready track ${track.id} must reference an audio source`);
        if (track.audio.mimeType && !/^audio\/[a-z0-9.+-]+$/i.test(track.audio.mimeType)) errors.push(`Track ${track.id} must declare a valid audio MIME type or null`);
      }
      if (!track.rights || typeof track.rights !== 'object' || !['unverified', 'licensed', 'owned', 'public-domain', 'blocked'].includes(track.rights.status)) errors.push(`Track ${track.id} has an invalid rights status`);
      else {
        for (const field of ['rightsHolder', 'territories', 'verifiedAt', 'evidenceRef']) if (!Object.prototype.hasOwnProperty.call(track.rights, field)) errors.push(`Track ${track.id} rights must declare ${field}`);
        if (track.rights.rightsHolder !== null && typeof track.rights.rightsHolder !== 'string') errors.push(`Track ${track.id} rightsHolder must be a string or null`);
        if (!Array.isArray(track.rights.territories) || track.rights.territories.some(area => !isAllowedTerritory(area))) errors.push(`Track ${track.id} territories must be an array of ISO alpha-2 codes or *`);
        if (track.rights.verifiedAt !== null && track.rights.verifiedAt !== undefined && !isVerifiedTimestamp(track.rights.verifiedAt)) errors.push(`Track ${track.id} has an invalid ISO-8601 verification timestamp`);
        if (track.rights.evidenceRef !== null && typeof track.rights.evidenceRef !== 'string') errors.push(`Track ${track.id} evidenceRef must be a string or null`);
        if (allowedRights.has(track.rights.status) && (!isNonEmpty(track.rights.evidenceRef) || !isVerifiedTimestamp(track.rights.verifiedAt))) errors.push(`Approved track ${track.id} requires a rights evidence reference and valid ISO-8601 verification timestamp`);
        if (allowedRights.has(track.rights.status) && (!Array.isArray(track.rights.territories) || !track.rights.territories.length || track.rights.territories.some(area => !isAllowedTerritory(area)))) errors.push(`Approved track ${track.id} requires an explicit territory list using ISO alpha-2 codes or *`);
        if (['licensed', 'owned'].includes(track.rights.status) && !isNonEmpty(track.rights.rightsHolder)) errors.push(`Approved track ${track.id} requires a rights holder`);
      }
    }

    for (const album of albums) {
      if (!album || typeof album !== 'object') continue;
      if (!isNonEmpty(album.title)) errors.push(`Album ${album.id} must have a non-empty title`);
      if (!Object.prototype.hasOwnProperty.call(album, 'artistId') || (album.artistId !== null && (typeof album.artistId !== 'string' || !artistIds.has(album.artistId)))) errors.push(`Album ${album.id} must have a valid artistId or null`);
      if (!Array.isArray(album.trackIds)) errors.push(`Album ${album.id} must have a trackIds array`);
      else {
        if (new Set(album.trackIds).size !== album.trackIds.length) errors.push(`Album ${album.id} contains duplicate track IDs`);
        for (const trackId of album.trackIds) {
          if (!trackIds.has(trackId)) errors.push(`Album ${album.id} references missing track ${trackId}`);
          else {
            const linkedTrack = tracks.find(track => track && track.id === trackId);
            if (linkedTrack?.albumId !== album.id) errors.push(`Album ${album.id} lists track ${trackId} that does not reference this album`);
            if (album.artistId && linkedTrack?.artistId !== album.artistId) errors.push(`Album ${album.id} and track ${trackId} have different artists`);
          }
        }
      }
      if (!isNonEmpty(album.availability)) errors.push(`Album ${album.id} must declare availability`);
      if (!isNonEmpty(album.rightsStatus)) errors.push(`Album ${album.id} must declare rightsStatus`);
    }
    for (const track of tracks) {
      if (track?.albumId) {
        const linkedAlbum = albums.find(album => album && album.id === track.albumId);
        if (linkedAlbum && Array.isArray(linkedAlbum.trackIds) && !linkedAlbum.trackIds.includes(track.id)) errors.push(`Track ${track.id} references album ${track.albumId} but is missing from its trackIds`);
        if (linkedAlbum?.artistId && linkedAlbum.artistId !== track.artistId) errors.push(`Track ${track.id} and album ${track.albumId} have different artists`);
      }
    }
    for (const playlist of playlists) {
      if (!playlist || typeof playlist !== 'object') continue;
      if (!isNonEmpty(playlist.title)) errors.push(`Playlist ${playlist.id} must have a non-empty title`);
      if (!Array.isArray(playlist.trackIds)) errors.push(`Playlist ${playlist.id} must have a trackIds array`);
      else {
        if (new Set(playlist.trackIds).size !== playlist.trackIds.length) errors.push(`Playlist ${playlist.id} contains duplicate track IDs`);
        for (const trackId of playlist.trackIds) if (!trackIds.has(trackId)) errors.push(`Playlist ${playlist.id} references missing track ${trackId}`);
      }
      if (!isNonEmpty(playlist.kind)) errors.push(`Playlist ${playlist.id} must declare kind`);
    }
    for (const genre of genres) {
      if (!genre || typeof genre !== 'object') continue;
      if (!isNonEmpty(genre.name)) errors.push(`Genre ${genre.id} must have a non-empty name`);
      if (genre.artistIds !== undefined && !Array.isArray(genre.artistIds)) errors.push(`Genre ${genre.id} artistIds must be an array when provided`);
      for (const artistId of genre.artistIds || []) if (!artistIds.has(artistId)) errors.push(`Genre ${genre.id} references missing artist ${artistId}`);
    }
    const editorial = source.editorial || {};
    if (editorial.featuredPlaylistId && !playlists.some(item => item && item.id === editorial.featuredPlaylistId)) errors.push(`Editorial featuredPlaylistId references missing playlist ${editorial.featuredPlaylistId}`);
    for (const [field, allowed] of [['trendingTrackIds', trackIds], ['homeAlbumIds', albumIds], ['homeArtistIds', artistIds]]) {
      if (editorial[field] !== undefined && !Array.isArray(editorial[field])) errors.push(`Editorial ${field} must be an array when provided`);
      for (const id of Array.isArray(editorial[field]) ? editorial[field] : []) if (!allowed.has(id)) errors.push(`Editorial ${field} references missing entity ${id}`);
    }
    if (editorial.homeReleaseIds !== undefined && !Array.isArray(editorial.homeReleaseIds)) errors.push('Editorial homeReleaseIds must be an array when provided');
    for (const id of Array.isArray(editorial.homeReleaseIds) ? editorial.homeReleaseIds : []) if (!trackIds.has(id) && !albumIds.has(id)) errors.push(`Editorial homeReleaseIds references missing release ${id}`);
    return { valid: errors.length === 0, errors };
  }

  class CatalogService {
    constructor(source) {
      const report = validateCatalog(source);
      if (!report.valid) throw new Error(`Invalid STARMUSICS catalogue: ${report.errors.join('; ')}`);
      this.source = source;
      this.indexes = Object.fromEntries(entityTypes.map(type => [type, new Map((source[type] || []).map(item => [item.id, item]))]));
      this.trackAliases = new Map();
      for (const track of source.tracks) {
        this.trackAliases.set(String(track.id), track.id);
        if (track.legacyId != null) this.trackAliases.set(String(track.legacyId), track.id);
        this.trackAliases.set(track.title.toLocaleLowerCase(), track.id);
        this.trackAliases.set(`${this.artistName(track.artistId)} ${track.title}`.toLocaleLowerCase(), track.id);
      }
    }
    getTrack(value) {
      if (value && typeof value === 'object') value = value.id ?? value.legacyId ?? value.title;
      const key = String(value ?? '');
      const id = this.trackAliases.get(key) || this.trackAliases.get(key.toLocaleLowerCase());
      return id ? this.indexes.tracks.get(id) || null : this.indexes.tracks.get(key) || null;
    }
    getArtist(value) { return this.resolveEntity('artists', value, ['name', 'legacyName']); }
    getAlbum(value) { return this.resolveEntity('albums', value, ['title', 'legacyId']); }
    getPlaylist(value) { return this.resolveEntity('playlists', value, ['title', 'legacyId']); }
    getGenre(value) { return this.resolveEntity('genres', value, ['name']); }
    resolveEntity(type, value, fields) {
      if (value && typeof value === 'object') value = value.id ?? value.title ?? value.name;
      const key = String(value ?? '');
      const rows = this.source[type] || [];
      return rows.find(row => row.id === key || fields.some(field => String(row[field] ?? '').toLocaleLowerCase() === key.toLocaleLowerCase())) || null;
    }
    artistName(id) { return this.indexes.artists.get(id)?.name || 'Unknown artist'; }
    getTracks() {
      return this.source.tracks.map(track => ({ ...track, artist: this.artistName(track.artistId), img: track.artworkUrl || '', duration: Math.round(track.durationMs / 1000), tag: track.explicit ? 'E' : undefined, audioUrl: null }));
    }
    search(query, types = ['tracks', 'artists', 'albums', 'playlists', 'genres']) {
      const q = String(query ?? '').trim().toLocaleLowerCase();
      if (!q) return [];
      const hits = [];
      if (types.includes('tracks')) for (const t of this.source.tracks) {
        const artist = this.artistName(t.artistId);
        if (`${t.title} ${artist} ${(t.genreIds || []).join(' ')}`.toLocaleLowerCase().includes(q)) hits.push({ id: t.id, title: t.title, subtitle: artist, img: t.artworkUrl, duration: Math.round(t.durationMs / 1000), type: 'Track', availability: t.availability, rightsStatus: t.rights.status });
      }
      if (types.includes('artists')) for (const a of this.source.artists) if (a.name.toLocaleLowerCase().includes(q)) hits.push({ id: a.id, title: a.name, subtitle: 'Artist profile', img: a.artworkUrl, type: 'Artist' });
      if (types.includes('albums')) for (const a of this.source.albums) {
        const artist = this.artistName(a.artistId);
        if (`${a.title} ${artist}`.toLocaleLowerCase().includes(q)) hits.push({ id: a.id, title: a.title, subtitle: artist, img: a.artworkUrl, duration: a.previewDurationSeconds || 200, type: 'Album', availability: a.availability, rightsStatus: a.rightsStatus });
      }
      if (types.includes('playlists')) for (const p of this.source.playlists) if (`${p.title} ${p.description || ''} ${p.curator || ''}`.toLocaleLowerCase().includes(q)) hits.push({ id: p.id, title: p.title, subtitle: p.description || p.curator || 'STARMUSICS curation', img: p.artworkUrl, type: 'Playlist', source: 'curated' });
      if (types.includes('genres')) for (const g of this.source.genres) if (g.name.toLocaleLowerCase().includes(q)) hits.push({ id: g.id, title: g.name, subtitle: 'Explore this sound', img: this.source.playlists[0]?.artworkUrl || '', type: 'Genre' });
      return hits;
    }
    getPlayableSource(trackOrId, territory = null) {
      const track = this.getTrack(trackOrId);
      if (!track || !allowedRights.has(track.rights?.status) || !isNonEmpty(track.rights?.evidenceRef) || !isVerifiedTimestamp(track.rights?.verifiedAt) || (['licensed', 'owned'].includes(track.rights?.status) && !isNonEmpty(track.rights?.rightsHolder)) || track.audio?.status !== 'ready' || !track.audio.sourceId) return null;
      const source = (this.source.audioSources || []).find(item => item.id === track.audio.sourceId && item.status === 'active');
      if (!source || !source.url || !Array.isArray(source.allowedHosts) || !source.allowedHosts.length) return null;
      if (!Array.isArray(track.rights.territories) || !track.rights.territories.length || track.rights.territories.some(area => !isAllowedTerritory(area))) return null;
      if (!track.rights.territories.includes('*') && (!territory || !track.rights.territories.includes(String(territory).toUpperCase()))) return null;
      let url;
      try { url = new URL(source.url, root.location?.origin || 'https://invalid.local'); } catch { return null; }
      const relativeSameOrigin = source.url.startsWith('/') && root.location?.origin && url.origin === root.location.origin;
      if ((url.protocol !== 'https:' && !relativeSameOrigin) || url.username || url.password || url.hash) return null;
      if (!source.allowedHosts.includes(url.host) && !relativeSameOrigin) return null;
      if (!/^audio\/[a-z0-9.+-]+$/i.test(source.mimeType || track.audio.mimeType || '')) return null;
      if (track.audio.mimeType && source.mimeType && track.audio.mimeType.toLowerCase() !== source.mimeType.toLowerCase()) return null;
      return { url: url.href, mimeType: source.mimeType || track.audio.mimeType, sourceId: source.id };
    }
    getLegacyData() {
      const source = this.source;
      const art = record => record.artworkUrl || null;
      const homeReleaseIds = source.editorial.homeReleaseIds || (source.editorial.homeAlbumIds || source.albums.map(a => a.id));
      const homeReleases = homeReleaseIds.map(id => {
        const album = this.indexes.albums.get(id);
        if (album) return { id: album.legacyId || album.id, canonicalId: album.id, title: album.title, subtitle: this.artistName(album.artistId), img: art(album), duration: album.previewDurationSeconds || 200, releaseType: 'album' };
        const track = this.indexes.tracks.get(id);
        if (track) return { id: track.legacyId || track.id, canonicalId: track.id, title: track.title, subtitle: this.artistName(track.artistId), img: art(track), duration: Math.round(track.durationMs / 1000), tag: track.explicit ? 'E' : undefined, releaseType: track.releaseType || 'single' };
        return null;
      }).filter(Boolean);
      const legacyAlbums = source.albums.map(a => ({ id: a.legacyId || a.id, canonicalId: a.id, title: a.title, subtitle: this.artistName(a.artistId), img: art(a), duration: a.previewDurationSeconds || 200, releaseType: 'album' }));
      return {
        playlists: source.playlists.map(p => ({ id: p.legacyId || p.id, canonicalId: p.id, title: p.title, subtitle: p.description || p.curator || 'Curated by STARMUSICS', img: art(p), nirvana: p.nirvana === true })),
        releases: homeReleases,
        albums: legacyAlbums,
        artists: (source.editorial.homeArtistIds || []).map(id => this.indexes.artists.get(id)).filter(Boolean).map(a => ({ id: a.id, name: a.name, img: art(a) })),
        trending: source.tracks.filter(t => (source.editorial.trendingTrackIds || []).includes(t.id)).map(t => ({ id: t.id, rank: t.legacyRank, artist: this.artistName(t.artistId), track: t.title, tag: t.explicit ? 'E' : undefined, img: art(t), duration: Math.round(t.durationMs / 1000), availability: t.availability })),
        discussions: (source.discussionTopics || []).map(d => ({ ...d })),
        genres: source.genres.map(g => g.name)
      };
    }
  }

  function validateLocalAudioFile(file, confirmed) {
    if (!confirmed) return { valid: false, reason: 'Confirm that you have permission to use this audio file.' };
    if (!file || !Number.isFinite(file.size) || file.size <= 0) return { valid: false, reason: 'Choose a non-empty audio file.' };
    if (!/^audio\/[a-z0-9.+-]+$/i.test(String(file.type || '').trim())) return { valid: false, reason: 'The selected file is not recognized as audio.' };
    const maxBytes = 500 * 1024 * 1024;
    if (file.size > maxBytes) return { valid: false, reason: 'Audio files must not exceed 500 MB.' };
    return { valid: true, reason: '' };
  }

  root.STARMUSICS_CatalogRuntime = { create: source => new CatalogService(source), validate: validateCatalog };
  root.STARMUSICS_AudioSourceAdapter = {
    validateLocalFile: validateLocalAudioFile,
    resolveCatalogTrack: (catalog, trackId, territory) => catalog.getPlayableSource(trackId, territory)
  };
  const source = root.STARMUSICS_CATALOG_SOURCE;
  if (!source) throw new Error('STARMUSICS catalogue data failed to load');
  root.STARMUSICS_Catalog = new CatalogService(source);
})(typeof window !== 'undefined' ? window : globalThis);
