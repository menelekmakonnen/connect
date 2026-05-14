/**
 * ICUNI Connect — Demo Data Layer
 * Client-side mock data for demo-token sessions.
 * Based on SeedData.gs — mirrors the Ghanaian film industry seed data.
 * 
 * When authState.getToken() === 'demo-token', apiCall() returns
 * these fixtures instead of hitting the GAS backend.
 */

// ── Talent Data ──────────────────────────────────────────

const DEMO_TALENTS = [
  {
    id: 'TLN-001', userId: 'USR-003', name: 'Ama Darko', displayName: 'Ama Darko',
    email: 'ama.darko@gmail.com', phone: '+233501234567',
    bio: 'Award-winning cinematographer with 8 years across West Africa. Known for moody atmospheric lighting and handheld intimacy.',
    location: 'Accra, Ghana', travel: 'international', tier: 'pro_verified', availability: 'available',
    languages: 'English,Twi,French', avatar: '',
    roles: [
      { name: 'Director of Photography', ROLE_NAME: 'Director of Photography', IS_PRIMARY: true, EXPERIENCE_YEARS: 8, RATE_VISIBILITY: 'range_public', RATE_TYPE: 'day', RATE_MIN: 500, RATE_MAX: 1200, RATE_CURRENCY: 'GHS' },
      { name: 'Colorist', ROLE_NAME: 'Colorist', IS_PRIMARY: false, EXPERIENCE_YEARS: 4, RATE_VISIBILITY: 'exact_private', RATE_TYPE: 'per_project', RATE_MIN: 0, RATE_MAX: 0, RATE_CURRENCY: 'GHS' },
    ],
    skills: ['Beauty lighting', 'Steadicam', 'Drone FPV', 'DaVinci Resolve', 'ARRI Alexa', 'Sony Venice'],
    socials: [
      { platform: 'instagram', handle: '@amadarko.dp', url: 'https://instagram.com/amadarko.dp' },
      { platform: 'youtube', handle: 'Ama Darko DP', url: 'https://youtube.com/c/amadarko' },
      { platform: 'imdb', handle: 'Ama Darko', url: 'https://imdb.com/name/nm12345678' },
    ],
    profileViews: 42, bubbleOpens: 128, lineupAdds: 12,
  },
  {
    id: 'TLN-002', userId: 'USR-004', name: 'Kofi Asante', displayName: 'Kofi Asante',
    email: 'kofi.asante@gmail.com', phone: '+233502345678',
    bio: 'Versatile sound engineer specializing in location recording for narrative film and documentary. 5 years experience.',
    location: 'Kumasi, Ghana', travel: 'national', tier: 'work_verified', availability: 'limited',
    availabilityNote: 'On a shoot until May 15',
    languages: 'English,Twi', avatar: '',
    roles: [
      { name: 'Sound Engineer', ROLE_NAME: 'Sound Engineer', IS_PRIMARY: true, EXPERIENCE_YEARS: 5, RATE_VISIBILITY: 'range_public', RATE_TYPE: 'day', RATE_MIN: 400, RATE_MAX: 800, RATE_CURRENCY: 'GHS' },
      { name: 'Boom Operator', ROLE_NAME: 'Boom Operator', IS_PRIMARY: false, EXPERIENCE_YEARS: 5, RATE_VISIBILITY: 'hidden', RATE_TYPE: '', RATE_MIN: 0, RATE_MAX: 0, RATE_CURRENCY: '' },
    ],
    skills: ['Boom operation', 'Wireless lavs', 'Pro Tools', 'Sound Devices MixPre'],
    socials: [{ platform: 'instagram', handle: '@kofiasante.sound', url: 'https://instagram.com/kofiasante.sound' }],
    profileViews: 18, bubbleOpens: 65, lineupAdds: 6,
  },
  {
    id: 'TLN-003', userId: 'USR-005', name: 'Grace Osei', displayName: 'Grace Abena Osei',
    email: 'grace.osei@gmail.com', phone: '+233503456789',
    bio: 'Celebrity makeup artist. Worked on 20+ Ghanaian and Nigerian productions including "Ashes & Embers".',
    location: 'Accra, Ghana', travel: 'national', tier: 'pro_verified', availability: 'available',
    languages: 'English,Twi,Ga', avatar: '',
    roles: [
      { name: 'Makeup Artist', ROLE_NAME: 'Makeup Artist', IS_PRIMARY: true, EXPERIENCE_YEARS: 7, RATE_VISIBILITY: 'range_public', RATE_TYPE: 'day', RATE_MIN: 350, RATE_MAX: 900, RATE_CURRENCY: 'GHS', notes: 'Includes own kit' },
      { name: 'Hair Stylist', ROLE_NAME: 'Hair Stylist', IS_PRIMARY: false, EXPERIENCE_YEARS: 7, RATE_VISIBILITY: 'exact_private', RATE_TYPE: 'day', RATE_MIN: 0, RATE_MAX: 0, RATE_CURRENCY: 'GHS' },
    ],
    skills: ['SFX makeup', 'Bridal makeup', 'Prosthetics', 'Wig styling'],
    socials: [
      { platform: 'instagram', handle: '@graceosei.mua', url: 'https://instagram.com/graceosei.mua' },
      { platform: 'tiktok', handle: '@graceosei', url: 'https://tiktok.com/@graceosei' },
      { platform: 'youtube', handle: 'Grace Osei Beauty', url: 'https://youtube.com/c/graceoseibeauty' },
    ],
    profileViews: 67, bubbleOpens: 201, lineupAdds: 18,
  },
  {
    id: 'TLN-004', userId: 'USR-006', name: 'Yaw Frimpong', displayName: 'Yaw Kwadwo Frimpong',
    email: 'yaw.frimpong@gmail.com', phone: '+233504567890',
    bio: 'Reliable production assistant with 2 years set experience. Fast learner, CPR certified.',
    location: 'Tema, Ghana', travel: 'local_only', tier: 'profile_verified', availability: 'available',
    languages: 'English,Twi', avatar: '',
    roles: [
      { name: 'Production Assistant', ROLE_NAME: 'Production Assistant', IS_PRIMARY: true, EXPERIENCE_YEARS: 2, RATE_VISIBILITY: 'range_public', RATE_TYPE: 'day', RATE_MIN: 100, RATE_MAX: 200, RATE_CURRENCY: 'GHS' },
    ],
    skills: [],
    socials: [],
    profileViews: 5, bubbleOpens: 12, lineupAdds: 3,
  },
  {
    id: 'TLN-005', userId: 'USR-007', name: 'Abena Boateng', displayName: 'Abena Serwah Boateng',
    email: 'abena.boateng@gmail.com', phone: '+233505678901',
    bio: 'Director and screenwriter. NAFTI graduate. Short films screened at FESPACO and Accra Indie Film Fest.',
    location: 'Accra, Ghana', travel: 'international', tier: 'pro_verified', availability: 'unavailable',
    availabilityNote: 'In post-production on "Legacy"',
    languages: 'English,Twi,French', avatar: '',
    roles: [
      { name: 'Director', ROLE_NAME: 'Director', IS_PRIMARY: true, EXPERIENCE_YEARS: 10, RATE_VISIBILITY: 'exact_private', RATE_TYPE: 'per_project', RATE_MIN: 0, RATE_MAX: 0, RATE_CURRENCY: 'USD' },
      { name: 'Screenwriter', ROLE_NAME: 'Screenwriter', IS_PRIMARY: false, EXPERIENCE_YEARS: 12, RATE_VISIBILITY: 'hidden', RATE_TYPE: '', RATE_MIN: 0, RATE_MAX: 0, RATE_CURRENCY: '' },
    ],
    skills: ['Screenplay format', 'Story development', 'Actor direction'],
    socials: [
      { platform: 'instagram', handle: '@abenaboateng', url: 'https://instagram.com/abenaboateng' },
      { platform: 'imdb', handle: 'Abena Boateng', url: 'https://imdb.com/name/nm87654321' },
      { platform: 'linkedin', handle: 'abenaboateng', url: 'https://linkedin.com/in/abenaboateng' },
    ],
    profileViews: 89, bubbleOpens: 310, lineupAdds: 24,
  },
  {
    id: 'TLN-006', userId: 'USR-008', name: 'Edem Kojo', displayName: 'Edem Kwaku Kojo',
    email: 'edem.kojo@gmail.com', phone: '+233506789012',
    bio: 'Editor and VFX artist. DaVinci Resolve certified. Specializes in music videos and commercials.',
    location: 'Accra, Ghana', travel: 'national', tier: 'work_verified', availability: 'available',
    languages: 'English,Ewe', avatar: '',
    roles: [
      { name: 'Editor', ROLE_NAME: 'Editor', IS_PRIMARY: true, EXPERIENCE_YEARS: 6, RATE_VISIBILITY: 'range_public', RATE_TYPE: 'per_project', RATE_MIN: 2000, RATE_MAX: 8000, RATE_CURRENCY: 'GHS', notes: 'Includes revision rounds' },
      { name: 'VFX Artist', ROLE_NAME: 'VFX Artist', IS_PRIMARY: false, EXPERIENCE_YEARS: 4, RATE_VISIBILITY: 'range_public', RATE_TYPE: 'per_project', RATE_MIN: 3000, RATE_MAX: 15000, RATE_CURRENCY: 'GHS' },
    ],
    skills: ['After Effects', 'DaVinci Resolve', 'Premiere Pro', '3D tracking'],
    socials: [
      { platform: 'youtube', handle: 'Edem Edits', url: 'https://youtube.com/c/edemedits' },
      { platform: 'behance', handle: 'edemkojo', url: 'https://behance.net/edemkojo' },
    ],
    profileViews: 31, bubbleOpens: 95, lineupAdds: 9,
  },
  {
    id: 'TLN-007', userId: 'USR-009', name: 'Naa Adjeley', displayName: 'Naa Adjeley Mensah',
    email: 'naa.adjeley@gmail.com', phone: '+233507890123',
    bio: 'Costume designer and stylist for film, fashion shows, and editorial shoots.',
    location: 'Accra, Ghana', travel: 'national', tier: 'profile_verified', availability: 'limited',
    availabilityNote: 'Available weekends only',
    languages: 'English,Ga,Twi', avatar: '',
    roles: [
      { name: 'Costume Designer', ROLE_NAME: 'Costume Designer', IS_PRIMARY: true, EXPERIENCE_YEARS: 4, RATE_VISIBILITY: 'range_public', RATE_TYPE: 'day', RATE_MIN: 300, RATE_MAX: 600, RATE_CURRENCY: 'GHS' },
      { name: 'Stylist', ROLE_NAME: 'Stylist', IS_PRIMARY: false, EXPERIENCE_YEARS: 5, RATE_VISIBILITY: 'range_public', RATE_TYPE: 'day', RATE_MIN: 250, RATE_MAX: 500, RATE_CURRENCY: 'GHS' },
    ],
    skills: [],
    socials: [{ platform: 'instagram', handle: '@naaadjeley', url: 'https://instagram.com/naaadjeley' }],
    profileViews: 14, bubbleOpens: 38, lineupAdds: 4,
  },
  {
    id: 'TLN-008', userId: 'USR-010', name: 'Kwesi Dadzie', displayName: 'Kwesi Dadzie',
    email: 'kwesi.dadzie@gmail.com', phone: '+233508901234',
    bio: 'Gaffer with 6 years experience. Expert in low-budget lighting setups and generator management.',
    location: 'Takoradi, Ghana', travel: 'national', tier: 'work_verified', availability: 'available',
    languages: 'English,Fante', avatar: '',
    roles: [
      { name: 'Gaffer', ROLE_NAME: 'Gaffer', IS_PRIMARY: true, EXPERIENCE_YEARS: 6, RATE_VISIBILITY: 'range_public', RATE_TYPE: 'day', RATE_MIN: 350, RATE_MAX: 700, RATE_CURRENCY: 'GHS', notes: 'Includes basic kit' },
    ],
    skills: ['HMI lighting', 'Generator management', 'LED panels'],
    socials: [],
    profileViews: 22, bubbleOpens: 58, lineupAdds: 7,
  },
  {
    id: 'TLN-009', userId: 'USR-011', name: 'Efua Antwi', displayName: 'Efua Antwi',
    email: 'efua.antwi@gmail.com', phone: '+233509012345',
    bio: 'Drone operator and aerial cinematographer. CAA Ghana licensed. DJI Inspire 3 and FPV rigs.',
    location: 'Accra, Ghana', travel: 'international', tier: 'work_verified', availability: 'available',
    languages: 'English,Twi', avatar: '',
    roles: [
      { name: 'Drone Operator', ROLE_NAME: 'Drone Operator', IS_PRIMARY: true, EXPERIENCE_YEARS: 3, RATE_VISIBILITY: 'range_public', RATE_TYPE: 'day', RATE_MIN: 800, RATE_MAX: 1500, RATE_CURRENCY: 'GHS', notes: 'DJI Inspire 3 included' },
      { name: 'Camera Operator', ROLE_NAME: 'Camera Operator', IS_PRIMARY: false, EXPERIENCE_YEARS: 4, RATE_VISIBILITY: 'range_public', RATE_TYPE: 'day', RATE_MIN: 500, RATE_MAX: 900, RATE_CURRENCY: 'GHS' },
    ],
    skills: ['FPV drone', 'Photogrammetry', 'Night flying'],
    socials: [
      { platform: 'instagram', handle: '@efuafly', url: 'https://instagram.com/efuafly' },
      { platform: 'youtube', handle: 'Efua Aerial', url: 'https://youtube.com/c/efuaaerial' },
    ],
    profileViews: 15, bubbleOpens: 42, lineupAdds: 5,
  },
  {
    id: 'TLN-010', userId: 'USR-012', name: 'Kojo Mensah', displayName: 'Kojo Mensah',
    email: 'kojo.mensah@gmail.com', phone: '+233500123456',
    bio: 'Actor with theatre and screen credits. NAFTI trained. Fluent in 4 languages.',
    location: 'Accra, Ghana', travel: 'national', tier: 'profile_verified', availability: 'available',
    languages: 'English,Twi,Ga,Hausa', avatar: '',
    roles: [
      { name: 'Lead Actor', ROLE_NAME: 'Lead Actor', IS_PRIMARY: true, EXPERIENCE_YEARS: 3, RATE_VISIBILITY: 'exact_private', RATE_TYPE: 'per_project', RATE_MIN: 0, RATE_MAX: 0, RATE_CURRENCY: 'GHS' },
      { name: 'Voice Actor', ROLE_NAME: 'Voice Actor', IS_PRIMARY: false, EXPERIENCE_YEARS: 2, RATE_VISIBILITY: 'range_public', RATE_TYPE: 'per_project', RATE_MIN: 500, RATE_MAX: 2000, RATE_CURRENCY: 'GHS' },
    ],
    skills: [],
    socials: [{ platform: 'instagram', handle: '@kojomensah.actor', url: 'https://instagram.com/kojomensah.actor' }],
    profileViews: 8, bubbleOpens: 22, lineupAdds: 2,
  },
];

// ── Project Data ─────────────────────────────────────────

const DEMO_PROJECTS = [
  { id: 'PRJ-001', title: 'Golden Coast', status: 'active', type: 'film', subtype: 'Feature Film', budget: 45000, currency: 'GHS', location: 'Accra, Ghana', roles: 8, filled: 3, updatedAt: '2 days ago' },
  { id: 'PRJ-002', title: 'Adinkra', status: 'draft', type: 'music_video', subtype: 'Narrative', budget: 8000, currency: 'GHS', location: 'Kumasi, Ghana', roles: 3, filled: 0, updatedAt: '1 week ago' },
  { id: 'PRJ-003', title: 'Legacy', status: 'active', type: 'documentary', subtype: 'Feature Documentary', budget: 25000, currency: 'USD', location: 'Accra, Ghana', roles: 2, filled: 2, updatedAt: '3 days ago' },
  { id: 'PRJ-004', title: 'Obroni', status: 'draft', type: 'film', subtype: 'Short Film', budget: 12000, currency: 'GHS', location: 'Accra, Ghana', roles: 0, filled: 0, updatedAt: '2 weeks ago' },
  { id: 'PRJ-005', title: 'Kente Couture', status: 'active', type: 'photoshoot', subtype: 'Editorial', budget: 6000, currency: 'GHS', location: 'Accra, Ghana', roles: 3, filled: 1, updatedAt: '1 day ago' },
];

// ── Request Data ─────────────────────────────────────────

const DEMO_REQUESTS = [
  { ID: 'REQ-001', SUBJECT: 'Golden Coast \u2014 Crew Call', STATUS: 'sent', CREATED_AT: '2026-04-20T08:00:00Z', TOTAL_RECIPIENTS: 5, VIEWED: 4, ACCEPTED: 3, DECLINED: 1, QUESTIONS: 0, COUNTERS: 0 },
  { ID: 'REQ-002', SUBJECT: 'Adinkra Music Video \u2014 Crew Needed', STATUS: 'draft', CREATED_AT: '', TOTAL_RECIPIENTS: 0, VIEWED: 0, ACCEPTED: 0, DECLINED: 0, QUESTIONS: 0, COUNTERS: 0 },
  { ID: 'REQ-003', SUBJECT: 'Legacy Documentary \u2014 Camera & Sound', STATUS: 'sent', CREATED_AT: '2026-03-10T12:00:00Z', TOTAL_RECIPIENTS: 3, VIEWED: 3, ACCEPTED: 2, DECLINED: 0, QUESTIONS: 1, COUNTERS: 0 },
];

// ── Roles Taxonomy (subset) ──────────────────────────────

const DEMO_ROLES = [
  { NAME: 'Director' }, { NAME: 'Director of Photography' }, { NAME: 'Camera Operator' },
  { NAME: 'Sound Engineer' }, { NAME: 'Gaffer' }, { NAME: 'Editor' },
  { NAME: 'Makeup Artist' }, { NAME: 'Costume Designer' }, { NAME: 'Stylist' },
  { NAME: 'Production Assistant' }, { NAME: 'Drone Operator' }, { NAME: 'VFX Artist' },
  { NAME: 'Lead Actor' }, { NAME: 'Screenwriter' }, { NAME: 'Boom Operator' },
  { NAME: 'Colorist' }, { NAME: 'Hair Stylist' }, { NAME: 'Voice Actor' },
];

// ── Analytics / Notifications ────────────────────────────

const DEMO_ANALYTICS = {
  total: 50,
  events: [
    { EVENT: 'profile_view', ENTITY_ID: 'TLN-001', TIMESTAMP: '2026-05-12T10:00:00Z' },
    { EVENT: 'bubble_open', ENTITY_ID: 'TLN-003', TIMESTAMP: '2026-05-12T09:30:00Z' },
    { EVENT: 'project_created', ENTITY_ID: 'PRJ-001', TIMESTAMP: '2026-05-11T14:00:00Z' },
    { EVENT: 'request_sent', ENTITY_ID: 'REQ-001', TIMESTAMP: '2026-05-10T08:00:00Z' },
    { EVENT: 'request_accepted', ENTITY_ID: 'ITM-001', TIMESTAMP: '2026-05-10T14:30:00Z' },
    { EVENT: 'talent_created', ENTITY_ID: 'TLN-010', TIMESTAMP: '2026-05-09T09:00:00Z' },
    { EVENT: 'profile_view', ENTITY_ID: 'TLN-005', TIMESTAMP: '2026-05-08T16:00:00Z' },
    { EVENT: 'bubble_open', ENTITY_ID: 'TLN-001', TIMESTAMP: '2026-05-08T11:00:00Z' },
    { EVENT: 'lineup_add', ENTITY_ID: 'TLN-008', TIMESTAMP: '2026-05-07T10:00:00Z' },
    { EVENT: 'request_declined', ENTITY_ID: 'ITM-004', TIMESTAMP: '2026-05-06T09:00:00Z' },
    { EVENT: 'profile_view', ENTITY_ID: 'TLN-002', TIMESTAMP: '2026-05-05T15:00:00Z' },
    { EVENT: 'bubble_open', ENTITY_ID: 'TLN-009', TIMESTAMP: '2026-05-04T12:00:00Z' },
    { EVENT: 'profile_view', ENTITY_ID: 'TLN-006', TIMESTAMP: '2026-05-03T10:00:00Z' },
    { EVENT: 'profile_view', ENTITY_ID: 'TLN-003', TIMESTAMP: '2026-05-02T14:00:00Z' },
    { EVENT: 'bubble_open', ENTITY_ID: 'TLN-007', TIMESTAMP: '2026-05-01T16:00:00Z' },
  ],
};

const DEMO_NOTIFICATIONS = [
  { ID: 'NTF-001', TITLE: 'New Response', MESSAGE: 'Ama Darko accepted DP role on Golden Coast', TYPE: 'request_response', READ: false, LINK: '/app/requests', TIMESTAMP: '2026-04-20T14:30:00Z' },
  { ID: 'NTF-002', TITLE: 'New Response', MESSAGE: 'Kofi Asante accepted Sound Engineer role', TYPE: 'request_response', READ: true, LINK: '/app/requests', TIMESTAMP: '2026-04-21T10:00:00Z' },
  { ID: 'NTF-003', TITLE: 'Profile View', MESSAGE: 'Your profile was viewed 5 times today', TYPE: 'analytics', READ: false, LINK: '/app/insights', TIMESTAMP: '2026-04-25T18:00:00Z' },
  { ID: 'NTF-004', TITLE: 'Lineup Update', MESSAGE: 'Yaw Frimpong declined PA role on Golden Coast', TYPE: 'request_response', READ: false, LINK: '/app/requests', TIMESTAMP: '2026-04-23T09:00:00Z' },
];

// ═══════════════════════════════════════════════════════
// DEMO RESOLVER — Maps API actions to demo data
// ═══════════════════════════════════════════════════════

const DEMO_HANDLERS = {
  talentsSearch: (data) => {
    let results = [...DEMO_TALENTS];
    if (data?.query) {
      const q = data.query.toLowerCase();
      results = results.filter(t =>
        t.name.toLowerCase().includes(q) ||
        t.bio.toLowerCase().includes(q) ||
        t.location.toLowerCase().includes(q) ||
        t.roles.some(r => r.name.toLowerCase().includes(q)) ||
        t.skills.some(s => s.toLowerCase().includes(q))
      );
    }
    if (data?.role && data.role !== 'All') {
      const role = data.role.toLowerCase();
      results = results.filter(t => t.roles.some(r => r.name.toLowerCase().includes(role)));
    }
    return results;
  },

  talentsGet: (data) => {
    return DEMO_TALENTS.find(t => t.id === data?.id) || null;
  },

  projectsList: () => DEMO_PROJECTS,
  projectsGet: (data) => DEMO_PROJECTS.find(p => p.id === data?.id) || null,

  requestsList: () => DEMO_REQUESTS,
  requestsGet: (data) => {
    const req = DEMO_REQUESTS.find(r => r.ID === data?.id);
    if (!req) return null;
    return {
      ...req,
      items: req.ID === 'REQ-001' ? [
        { TALENT_NAME: 'Ama Darko', ROLE_NAME: 'DP', OFFER_FEE: '1,200', FEE_CURRENCY: 'GHS', STATUS: 'accepted' },
        { TALENT_NAME: 'Kofi Asante', ROLE_NAME: 'Sound Engineer', OFFER_FEE: '800', FEE_CURRENCY: 'GHS', STATUS: 'accepted' },
        { TALENT_NAME: 'Grace Osei', ROLE_NAME: 'Makeup Artist', OFFER_FEE: '600', FEE_CURRENCY: 'GHS', STATUS: 'accepted' },
        { TALENT_NAME: 'Yaw Frimpong', ROLE_NAME: 'PA', OFFER_FEE: '200', FEE_CURRENCY: 'GHS', STATUS: 'declined' },
        { TALENT_NAME: 'Kwesi Dadzie', ROLE_NAME: 'Gaffer', OFFER_FEE: '700', FEE_CURRENCY: 'GHS', STATUS: 'viewed' },
      ] : req.ID === 'REQ-003' ? [
        { TALENT_NAME: 'Efua Antwi', ROLE_NAME: 'Camera Op', OFFER_FEE: '600', FEE_CURRENCY: 'USD', STATUS: 'accepted' },
        { TALENT_NAME: 'Kofi Asante', ROLE_NAME: 'Sound Engineer', OFFER_FEE: '500', FEE_CURRENCY: 'USD', STATUS: 'accepted' },
        { TALENT_NAME: 'Ama Darko', ROLE_NAME: 'Camera Op', OFFER_FEE: '600', FEE_CURRENCY: 'USD', STATUS: 'question' },
      ] : [],
    };
  },

  rolesList: () => DEMO_ROLES,
  configGet: () => ({ defaultCurrency: 'GHS', systemName: 'ICUNI Connect' }),
  analyticsGet: () => DEMO_ANALYTICS,
  notificationsList: () => DEMO_NOTIFICATIONS,
  notificationsRead: () => ({ success: true }),
  notificationsClear: () => ({ success: true }),
  userProfile: () => ({
    id: 'USR-demo001', name: 'Kwame Mensah', email: 'kwame@icuni.org',
    role: 'PM', currency: 'GHS', hasPin: true,
  }),
  profileUpdate: () => ({ success: true }),

  // Mutations return success in demo
  talentsCreate: () => ({ success: true, id: 'TLN-demo' }),
  talentsUpdate: () => ({ success: true }),
  talentsDelete: () => ({ success: true }),
  projectsCreate: () => ({ success: true, id: 'PRJ-demo' }),
  projectsUpdate: () => ({ success: true }),
  projectsDelete: () => ({ success: true }),
  projectsAddSlot: () => ({ success: true }),
  projectsAssign: () => ({ success: true }),
  requestsCreate: () => ({ success: true, id: 'REQ-demo' }),
  requestsSend: () => ({ success: true }),
  changePin: () => ({ success: true }),
};

/**
 * Check if the current session is a demo session.
 */
export function isDemoSession() {
  try {
    return localStorage.getItem('ic_token') === 'demo-token';
  } catch {
    return false;
  }
}

/**
 * Resolve a demo API call. Returns the data synchronously (wrapped in a promise).
 * Returns null if the action isn't handled (fall through to real API).
 */
export function resolveDemoCall(action, data = {}) {
  const handler = DEMO_HANDLERS[action];
  if (!handler) return null;

  // Simulate network delay for realism (50-200ms)
  const delay = 50 + Math.random() * 150;
  return new Promise(resolve => {
    setTimeout(() => resolve(handler(data)), delay);
  });
}
