/**
 * ICUNI CONNECT — Seed Data
 * Realistic Ghanaian film industry demo data.
 */

function seedAllData_() {
  var results = [];

  results.push(seedUsers_());
  results.push(seedTalents_());
  results.push(seedProjects_());
  results.push(seedRequests_());
  results.push(seedAnalytics_());

  logSystem_('INFO', 'SEED_ALL', 'system', 'Full seed completed');
  return { success: true, results: results };
}

function seedUsers_() {
  var sheet = getSheet_('Users');
  if (sheet.getLastRow() > 1) return 'Users: already seeded';

  var users = [
    ['USR-001','menelek@icuni.org','Menelek Aberra','','Admin','','GHS',false,now_(),now_(),'active'],
    ['USR-002','kwame@icuni.org','Kwame Mensah','','PM','','GHS',true,now_(),now_(),'active'],
    ['USR-003','ama.darko@gmail.com','Ama Darko','','Talent','','GHS',true,'2025-06-15T10:00:00Z',now_(),'active'],
    ['USR-004','kofi.asante@gmail.com','Kofi Asante','','Talent','','GHS',true,'2025-08-20T14:00:00Z',now_(),'active'],
    ['USR-005','grace.osei@gmail.com','Grace Osei','','Talent','','GHS',true,'2025-09-01T09:00:00Z',now_(),'active'],
    ['USR-006','yaw.frimpong@gmail.com','Yaw Frimpong','','Talent','','GHS',false,'2025-10-10T11:00:00Z',now_(),'active'],
    ['USR-007','abena.boateng@gmail.com','Abena Boateng','','PM','','USD',true,'2025-07-05T08:00:00Z',now_(),'active'],
    ['USR-008','edem.kojo@gmail.com','Edem Kojo','','Talent','','GHS',true,'2025-11-12T16:00:00Z',now_(),'active'],
    ['USR-009','naa.adjeley@gmail.com','Naa Adjeley','','Talent','','GHS',false,'2026-01-03T12:00:00Z',now_(),'active'],
    ['USR-010','kwesi.dadzie@gmail.com','Kwesi Dadzie','','Talent','','GHS',true,'2026-02-14T10:00:00Z',now_(),'active'],
    ['USR-011','efua.antwi@gmail.com','Efua Antwi','','Talent','','GHS',true,'2026-01-20T15:00:00Z',now_(),'active'],
    ['USR-012','kojo.mensah@gmail.com','Kojo Mensah','','Talent','','GHS',false,'2026-03-01T09:00:00Z',now_(),'active'],
  ];
  sheet.getRange(2, 1, users.length, users[0].length).setValues(users);
  return 'Users: seeded ' + users.length;
}

function seedTalents_() {
  var ts = getSheet_('Talents');
  if (ts.getLastRow() > 1) return 'Talents: already seeded';

  var talents = [
    ['TLN-001','USR-003','Ama Darko','Ama Darko','ama.darko@gmail.com','+233501234567','Award-winning cinematographer with 8 years across West Africa. Known for moody atmospheric lighting and handheld intimacy.','Accra, Ghana','','','English,Twi,French','international','pro_verified','available','','true','','',42,128,12,now_(),now_(),'active'],
    ['TLN-002','USR-004','Kofi Asante','Kofi Asante','kofi.asante@gmail.com','+233502345678','Versatile sound engineer specializing in location recording for narrative film and documentary. 5 years experience.','Kumasi, Ghana','','','English,Twi','national','work_verified','limited','On a shoot until May 15','true','','',18,65,6,now_(),now_(),'active'],
    ['TLN-003','USR-005','Grace Osei','Grace Abena Osei','grace.osei@gmail.com','+233503456789','Celebrity makeup artist. Worked on 20+ Ghanaian and Nigerian productions including "Ashes & Embers".','Accra, Ghana','','','English,Twi,Ga','national','pro_verified','available','','true','','',67,201,18,now_(),now_(),'active'],
    ['TLN-004','USR-006','Yaw Frimpong','Yaw Kwadwo Frimpong','yaw.frimpong@gmail.com','+233504567890','Reliable production assistant with 2 years set experience. Fast learner, CPR certified.','Tema, Ghana','','','English,Twi','local_only','profile_verified','available','','true','','',5,12,3,now_(),now_(),'active'],
    ['TLN-005','USR-007','Abena Boateng','Abena Serwah Boateng','abena.boateng@gmail.com','+233505678901','Director and screenwriter. NAFTI graduate. Short films screened at FESPACO and Accra Indie Film Fest.','Accra, Ghana','','','English,Twi,French','international','pro_verified','unavailable','In post-production on "Legacy"','true','','',89,310,24,now_(),now_(),'active'],
    ['TLN-006','USR-008','Edem Kojo','Edem Kwaku Kojo','edem.kojo@gmail.com','+233506789012','Editor and VFX artist. DaVinci Resolve certified. Specializes in music videos and commercials.','Accra, Ghana','','','English,Ewe','national','work_verified','available','','true','','',31,95,9,now_(),now_(),'active'],
    ['TLN-007','USR-009','Naa Adjeley','Naa Adjeley Mensah','naa.adjeley@gmail.com','+233507890123','Costume designer and stylist for film, fashion shows, and editorial shoots.','Accra, Ghana','','','English,Ga,Twi','national','profile_verified','limited','Available weekends only','true','','',14,38,4,now_(),now_(),'active'],
    ['TLN-008','USR-010','Kwesi Dadzie','Kwesi Dadzie','kwesi.dadzie@gmail.com','+233508901234','Gaffer with 6 years experience. Expert in low-budget lighting setups and generator management.','Takoradi, Ghana','','','English,Fante','national','work_verified','available','','true','','',22,58,7,now_(),now_(),'active'],
    ['TLN-009','USR-011','Efua Antwi','Efua Antwi','efua.antwi@gmail.com','+233509012345','Drone operator and aerial cinematographer. CAA Ghana licensed. DJI Inspire 3 and FPV rigs.','Accra, Ghana','','','English,Twi','international','work_verified','available','','true','','',15,42,5,now_(),now_(),'active'],
    ['TLN-010','USR-012','Kojo Mensah','Kojo Mensah','kojo.mensah@gmail.com','+233500123456','Actor with theatre and screen credits. NAFTI trained. Fluent in 4 languages.','Accra, Ghana','','','English,Twi,Ga,Hausa','national','profile_verified','available','','true','','',8,22,2,now_(),now_(),'active'],
  ];
  ts.getRange(2, 1, talents.length, talents[0].length).setValues(talents);

  // Talent Roles
  var tr = getSheet_('TalentRoles');
  var roles = [
    ['TLN-001','ROL-004','Director of Photography',true,8,false,2018,'range_public','day',500,1200,'GHS',''],
    ['TLN-001','ROL-037','Colorist',false,4,false,2022,'exact_private','per_project',0,0,'GHS',''],
    ['TLN-002','ROL-011','Sound Engineer',true,5,false,2021,'range_public','day',400,800,'GHS',''],
    ['TLN-002','ROL-012','Boom Operator',false,5,false,2021,'hidden','','',0,'',''],
    ['TLN-003','ROL-027','Makeup Artist',true,7,false,2019,'range_public','day',350,900,'GHS','Includes own kit'],
    ['TLN-003','ROL-028','Hair Stylist',false,7,false,2019,'exact_private','day',0,0,'GHS',''],
    ['TLN-004','ROL-043','Production Assistant',true,2,false,2024,'range_public','day',100,200,'GHS',''],
    ['TLN-005','ROL-001','Director',true,10,false,2016,'exact_private','per_project',0,0,'USD',''],
    ['TLN-005','ROL-057','Screenwriter',false,12,false,2014,'hidden','','',0,'',''],
    ['TLN-006','ROL-035','Editor',true,6,false,2020,'range_public','per_project',2000,8000,'GHS','Includes revision rounds'],
    ['TLN-006','ROL-036','VFX Artist',false,4,false,2022,'range_public','per_project',3000,15000,'GHS',''],
    ['TLN-007','ROL-031','Costume Designer',true,4,false,2022,'range_public','day',300,600,'GHS',''],
    ['TLN-007','ROL-033','Stylist',false,5,false,2021,'range_public','day',250,500,'GHS',''],
    ['TLN-008','ROL-017','Gaffer',true,6,false,2020,'range_public','day',350,700,'GHS','Includes basic kit'],
    ['TLN-009','ROL-008','Drone Operator',true,3,false,2023,'range_public','day',800,1500,'GHS','DJI Inspire 3 included'],
    ['TLN-009','ROL-005','Camera Operator',false,4,false,2022,'range_public','day',500,900,'GHS',''],
    ['TLN-010','ROL-049','Lead Actor',true,3,false,2023,'exact_private','per_project',0,0,'GHS',''],
    ['TLN-010','ROL-053','Voice Actor',false,2,false,2024,'range_public','per_project',500,2000,'GHS',''],
  ];
  tr.getRange(2, 1, roles.length, roles[0].length).setValues(roles);

  // Skills
  var sk = getSheet_('TalentSkills');
  var skills = [
    ['TLN-001','Beauty lighting'],['TLN-001','Steadicam'],['TLN-001','Drone FPV'],['TLN-001','DaVinci Resolve'],['TLN-001','ARRI Alexa'],['TLN-001','Sony Venice'],
    ['TLN-002','Boom operation'],['TLN-002','Wireless lavs'],['TLN-002','Pro Tools'],['TLN-002','Sound Devices MixPre'],
    ['TLN-003','SFX makeup'],['TLN-003','Bridal makeup'],['TLN-003','Prosthetics'],['TLN-003','Wig styling'],
    ['TLN-005','Screenplay format'],['TLN-005','Story development'],['TLN-005','Actor direction'],
    ['TLN-006','After Effects'],['TLN-006','DaVinci Resolve'],['TLN-006','Premiere Pro'],['TLN-006','3D tracking'],
    ['TLN-008','HMI lighting'],['TLN-008','Generator management'],['TLN-008','LED panels'],
    ['TLN-009','FPV drone'],['TLN-009','Photogrammetry'],['TLN-009','Night flying'],
  ];
  sk.getRange(2, 1, skills.length, 2).setValues(skills);

  // Social/Presence
  var sp = getSheet_('TalentPresence');
  var presence = [
    ['TLN-001','instagram','@amadarko.dp','https://instagram.com/amadarko.dp'],
    ['TLN-001','youtube','Ama Darko DP','https://youtube.com/c/amadarko'],
    ['TLN-001','imdb','Ama Darko','https://imdb.com/name/nm12345678'],
    ['TLN-002','instagram','@kofiasante.sound','https://instagram.com/kofiasante.sound'],
    ['TLN-003','instagram','@graceosei.mua','https://instagram.com/graceosei.mua'],
    ['TLN-003','tiktok','@graceosei','https://tiktok.com/@graceosei'],
    ['TLN-003','youtube','Grace Osei Beauty','https://youtube.com/c/graceoseibeauty'],
    ['TLN-005','instagram','@abenaboateng','https://instagram.com/abenaboateng'],
    ['TLN-005','imdb','Abena Boateng','https://imdb.com/name/nm87654321'],
    ['TLN-005','linkedin','abenaboateng','https://linkedin.com/in/abenaboateng'],
    ['TLN-006','youtube','Edem Edits','https://youtube.com/c/edemedits'],
    ['TLN-006','behance','edemkojo','https://behance.net/edemkojo'],
    ['TLN-007','instagram','@naaadjeley','https://instagram.com/naaadjeley'],
    ['TLN-009','instagram','@efuafly','https://instagram.com/efuafly'],
    ['TLN-009','youtube','Efua Aerial','https://youtube.com/c/efuaaerial'],
    ['TLN-010','instagram','@kojomensah.actor','https://instagram.com/kojomensah.actor'],
  ];
  sp.getRange(2, 1, presence.length, 4).setValues(presence);

  return 'Talents: seeded 10 talents + roles + skills + presence';
}

function seedProjects_() {
  var ps = getSheet_('Projects');
  if (ps.getLastRow() > 1) return 'Projects: already seeded';

  var projects = [
    ['PRJ-001','USR-002','Golden Coast','public','active','Film','Feature Film','Drama,Adventure','A feature film exploring the coastal heritage and fishing traditions of Ghana through the eyes of a young woman returning home.','GHS',45000,'Accra, Ghana','','2026-05-12','2026-06-08','weekly',28,4,'',now_(),now_()],
    ['PRJ-002','USR-002','Adinkra','public','draft','Music Video','Narrative','Afrobeats,Cultural','Music video for rising Ghanaian artist featuring traditional Adinkra symbols reimagined in modern Accra.','GHS',8000,'Kumasi, Ghana','','2026-06-01','2026-06-03','daily',3,1,'',now_(),now_()],
    ['PRJ-003','USR-007','Legacy','private','active','Documentary','Feature Documentary','History,Culture','Feature documentary chronicling 3 generations of Ghanaian filmmakers from the Gold Coast Film Unit to today.','USD',25000,'Accra, Ghana','','2026-03-01','2026-07-15','weekly',136,20,'',now_(),now_()],
    ['PRJ-004','USR-002','Obroni','public','draft','Film','Short Film','Comedy,Romance','A short comedy about a Ghanaian-American navigating dating culture in Accra for the first time.','GHS',12000,'Accra, Ghana','','','','',0,0,'',now_(),now_()],
    ['PRJ-005','USR-007','Kente Couture','public','active','Photo Shoot','Editorial','Fashion','High-fashion editorial shoot blending traditional kente weaving with contemporary haute couture.','GHS',6000,'Accra, Ghana','','2026-05-20','2026-05-22','daily',3,1,'',now_(),now_()],
  ];
  ps.getRange(2, 1, projects.length, projects[0].length).setValues(projects);

  // Phases
  var ph = getSheet_('ProjectPhases');
  var phases = [
    ['PRJ-001','development',true,0,2,'#3b82f6'],
    ['PRJ-001','pre_production',true,2,3,'#8b5cf6'],
    ['PRJ-001','production',true,5,4,'#00d4aa'],
    ['PRJ-001','post_production',true,9,6,'#eab308'],
    ['PRJ-001','distribution',false,0,0,'#ec4899'],
    ['PRJ-003','development',true,0,4,'#3b82f6'],
    ['PRJ-003','pre_production',true,4,4,'#8b5cf6'],
    ['PRJ-003','production',true,8,8,'#00d4aa'],
    ['PRJ-003','post_production',true,16,4,'#eab308'],
  ];
  ph.getRange(2, 1, phases.length, 6).setValues(phases);

  // Role Slots
  var rs = getSheet_('RoleSlots');
  var slots = [
    ['SLT-001','PRJ-001','ROL-004','Director of Photography',1,1,'8+ years narrative experience','1200','GHS','per day','filled',1],
    ['SLT-002','PRJ-001','ROL-011','Sound Engineer',1,1,'Own equipment preferred','800','GHS','per day','filled',2],
    ['SLT-003','PRJ-001','ROL-017','Gaffer',2,1,'Must manage generator','700','GHS','per day','filling',3],
    ['SLT-004','PRJ-001','ROL-027','Makeup Artist',1,0,'SFX experience a plus','600','GHS','per day','open',4],
    ['SLT-005','PRJ-001','ROL-043','Production Assistant',3,1,'CPR certified preferred','200','GHS','per day','filling',5],
    ['SLT-006','PRJ-001','ROL-001','Director',1,0,'','','','','open',6],
    ['SLT-007','PRJ-001','ROL-035','Editor',1,0,'DaVinci Resolve proficiency','5000','GHS','per project','open',7],
    ['SLT-008','PRJ-001','ROL-008','Drone Operator',1,0,'Licensed, own equipment','1000','GHS','per day','open',8],
    ['SLT-009','PRJ-002','ROL-004','Director of Photography',1,0,'Music video experience','1000','GHS','per day','open',1],
    ['SLT-010','PRJ-002','ROL-033','Stylist',1,0,'Fashion-forward','400','GHS','per day','open',2],
    ['SLT-011','PRJ-002','ROL-027','Makeup Artist',1,0,'','500','GHS','per day','open',3],
    ['SLT-012','PRJ-003','ROL-005','Camera Operator',2,1,'Documentary experience','600','USD','per day','filling',1],
    ['SLT-013','PRJ-003','ROL-011','Sound Engineer',1,1,'Location recording expert','500','USD','per day','filled',2],
  ];
  rs.getRange(2, 1, slots.length, slots[0].length).setValues(slots);

  // Assignments
  var as = getSheet_('Assignments');
  var assigns = [
    ['ASN-001','SLT-001','PRJ-001','TLN-001','Ama Darko','confirmed','2026-04-20T10:00:00Z'],
    ['ASN-002','SLT-002','PRJ-001','TLN-002','Kofi Asante','confirmed','2026-04-21T14:00:00Z'],
    ['ASN-003','SLT-003','PRJ-001','TLN-008','Kwesi Dadzie','confirmed','2026-04-22T09:00:00Z'],
    ['ASN-004','SLT-005','PRJ-001','TLN-004','Yaw Frimpong','pending','2026-04-25T11:00:00Z'],
    ['ASN-005','SLT-012','PRJ-003','TLN-009','Efua Antwi','confirmed','2026-03-15T08:00:00Z'],
    ['ASN-006','SLT-013','PRJ-003','TLN-002','Kofi Asante','confirmed','2026-03-16T10:00:00Z'],
  ];
  as.getRange(2, 1, assigns.length, assigns[0].length).setValues(assigns);

  return 'Projects: seeded 5 projects + phases + slots + assignments';
}

function seedRequests_() {
  var rq = getSheet_('Requests');
  if (rq.getLastRow() > 1) return 'Requests: already seeded';

  var requests = [
    ['REQ-001','PRJ-001','USR-002','Golden Coast — Crew Call','We are assembling the crew for Golden Coast. Please review the role and fee details below.','sent','2026-04-20T08:00:00Z',5,4,3,1,0,0,now_()],
    ['REQ-002','PRJ-002','USR-002','Adinkra Music Video — Crew Needed','Looking for a small tight crew for a 2-day music video shoot in Kumasi.','draft','','0',0,0,0,0,0,now_()],
    ['REQ-003','PRJ-003','USR-007','Legacy Documentary — Camera & Sound','Seeking experienced documentary crew for a 2-month shoot across Ghana.','sent','2026-03-10T12:00:00Z',3,3,2,0,1,0,now_()],
  ];
  rq.getRange(2, 1, requests.length, requests[0].length).setValues(requests);

  var ri = getSheet_('RequestItems');
  var items = [
    ['ITM-001','REQ-001','TLN-001','Ama Darko','SLT-001','DP','1200','GHS','tok_a1b2c3','accepted','2026-04-20T08:00:00Z','2026-04-20T14:30:00Z'],
    ['ITM-002','REQ-001','TLN-002','Kofi Asante','SLT-002','Sound Engineer','800','GHS','tok_d4e5f6','accepted','2026-04-20T08:00:00Z','2026-04-21T10:00:00Z'],
    ['ITM-003','REQ-001','TLN-003','Grace Osei','SLT-004','Makeup Artist','600','GHS','tok_g7h8i9','accepted','2026-04-20T08:00:00Z','2026-04-22T16:00:00Z'],
    ['ITM-004','REQ-001','TLN-004','Yaw Frimpong','SLT-005','PA','200','GHS','tok_j0k1l2','declined','2026-04-20T08:00:00Z','2026-04-23T09:00:00Z'],
    ['ITM-005','REQ-001','TLN-008','Kwesi Dadzie','SLT-003','Gaffer','700','GHS','tok_m3n4o5','viewed','2026-04-20T08:00:00Z',''],
    ['ITM-006','REQ-003','TLN-009','Efua Antwi','SLT-012','Camera Op','600','USD','tok_p6q7r8','accepted','2026-03-10T12:00:00Z','2026-03-12T11:00:00Z'],
    ['ITM-007','REQ-003','TLN-002','Kofi Asante','SLT-013','Sound Engineer','500','USD','tok_s9t0u1','accepted','2026-03-10T12:00:00Z','2026-03-13T15:00:00Z'],
    ['ITM-008','REQ-003','TLN-001','Ama Darko','SLT-012','Camera Op','600','USD','tok_v2w3x4','question','2026-03-10T12:00:00Z','2026-03-11T20:00:00Z'],
  ];
  ri.getRange(2, 1, items.length, items[0].length).setValues(items);

  var rp = getSheet_('Responses');
  var responses = [
    ['RSP-001','ITM-001','tok_a1b2c3','accepted','Happy to join the team!','',now_()],
    ['RSP-002','ITM-002','tok_d4e5f6','accepted','Confirmed. Will bring MixPre-6 and 4 lavs.','',now_()],
    ['RSP-003','ITM-003','tok_g7h8i9','accepted','Looking forward to it. Will need a makeup station.','',now_()],
    ['RSP-004','ITM-004','tok_j0k1l2','declined','Unfortunately I have a prior commitment those dates.','',now_()],
    ['RSP-005','ITM-006','tok_p6q7r8','accepted','Excited for this project!','',now_()],
    ['RSP-006','ITM-007','tok_s9t0u1','accepted','Ready to go. Will coordinate with director.','',now_()],
    ['RSP-007','ITM-008','tok_v2w3x4','question','What camera package are you providing?','',now_()],
  ];
  rp.getRange(2, 1, responses.length, responses[0].length).setValues(responses);

  return 'Requests: seeded 3 requests + 8 items + 7 responses';
}

function seedAnalytics_() {
  var sheet = getActiveWriteShard_('Analytics');
  if (sheet.getLastRow() > 1) return 'Analytics: already seeded';

  var events = [];
  var types = ['bubble_open','profile_view','lineup_add','search','project_view'];
  var talents = ['TLN-001','TLN-002','TLN-003','TLN-004','TLN-005','TLN-006','TLN-007','TLN-008','TLN-009','TLN-010'];
  var users = ['USR-002','USR-007','USR-003','USR-005','USR-008'];

  for (var i = 0; i < 50; i++) {
    var d = new Date();
    d.setDate(d.getDate() - Math.floor(Math.random() * 30));
    d.setHours(Math.floor(Math.random() * 14) + 8);
    events.push([
      getNextId_('EVT'), types[Math.floor(Math.random() * types.length)],
      'talent', talents[Math.floor(Math.random() * talents.length)],
      users[Math.floor(Math.random() * users.length)], '', d.toISOString()
    ]);
  }
  sheet.getRange(2, 1, events.length, 7).setValues(events);

  // Notifications
  var ns = getActiveWriteShard_('Notifications');
  var notifs = [
    [getNextId_('NTF'),'USR-002','New Response','Ama Darko accepted DP role on Golden Coast','request_response',false,'/app/requests','2026-04-20T14:30:00Z'],
    [getNextId_('NTF'),'USR-002','New Response','Kofi Asante accepted Sound Engineer role','request_response',true,'/app/requests','2026-04-21T10:00:00Z'],
    [getNextId_('NTF'),'USR-003','Profile View','Your profile was viewed 5 times today','analytics',false,'/app/insights','2026-04-25T18:00:00Z'],
    [getNextId_('NTF'),'USR-002','Lineup Update','Yaw Frimpong declined PA role on Golden Coast','request_response',false,'/app/requests','2026-04-23T09:00:00Z'],
    [getNextId_('NTF'),'USR-007','Question Received','Ama Darko asked a question about Legacy','request_response',false,'/app/requests','2026-03-11T20:00:00Z'],
  ];
  ns.getRange(2, 1, notifs.length, notifs[0].length).setValues(notifs);

  return 'Analytics: seeded 50 events + 5 notifications';
}
