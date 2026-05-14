/**
 * ICUNI CONNECT — Roles Dictionary & Aliases
 * Canonical role taxonomy with 200+ aliases for fuzzy matching.
 */

function seedRolesDictionary_() {
  var roles = [
    // ── Directing ──
    { name: 'Director', cat: 'Directing', aliases: ['Film Director','Movie Director','Feature Director','TV Director','Series Director','Content Director'] },
    { name: 'Assistant Director', cat: 'Directing', aliases: ['AD','1st AD','2nd AD','First Assistant Director','Second Assistant Director','3rd AD'] },
    { name: 'Script Supervisor', cat: 'Directing', aliases: ['Continuity Supervisor','Script Coordinator','Scripty'] },

    // ── Camera ──
    { name: 'Director of Photography', cat: 'Camera', aliases: ['DP','DOP','Cinematographer','Camera Director','Lead Camera','Chief Cinematographer'] },
    { name: 'Camera Operator', cat: 'Camera', aliases: ['Cameraman','Camera Person','Camera Op','A-Camera','B-Camera','Steadicam Operator'] },
    { name: 'Focus Puller', cat: 'Camera', aliases: ['1st AC','First Assistant Camera','Focus Operator'] },
    { name: 'Camera Assistant', cat: 'Camera', aliases: ['2nd AC','Second Assistant Camera','Clapper Loader','Loader'] },
    { name: 'Drone Operator', cat: 'Camera', aliases: ['Drone Pilot','UAV Operator','Aerial Cinematographer','Drone DP'] },
    { name: 'Steadicam Operator', cat: 'Camera', aliases: ['Gimbal Operator','Stabilizer Operator'] },
    { name: 'DIT', cat: 'Camera', aliases: ['Digital Imaging Technician','Data Wrangler','Data Manager'] },

    // ── Sound ──
    { name: 'Sound Engineer', cat: 'Sound', aliases: ['Sound Mixer','Production Sound Mixer','Audio Engineer','Sound Recordist','Sound Man'] },
    { name: 'Boom Operator', cat: 'Sound', aliases: ['Boom Swinger','Boom Man','Boom Person','Boom Op'] },
    { name: 'Sound Designer', cat: 'Sound', aliases: ['Audio Designer','Sound FX Designer'] },
    { name: 'Foley Artist', cat: 'Sound', aliases: ['Foley','Foley Walker','Foley Performer'] },
    { name: 'Music Supervisor', cat: 'Sound', aliases: ['Music Director','Music Coordinator'] },
    { name: 'Composer', cat: 'Sound', aliases: ['Film Composer','Score Composer','Music Composer','Soundtrack Artist'] },

    // ── Lighting ──
    { name: 'Gaffer', cat: 'Lighting', aliases: ['Chief Lighting Technician','Head Electrician','Chief Electrician','Lighting Director'] },
    { name: 'Best Boy Electric', cat: 'Lighting', aliases: ['Best Boy','Assistant Gaffer','BB Electric'] },
    { name: 'Electrician', cat: 'Lighting', aliases: ['Spark','Set Electrician','Lighting Technician','Lamp Operator'] },
    { name: 'Grip', cat: 'Lighting', aliases: ['Key Grip','Best Boy Grip','Dolly Grip','Rigging Grip'] },

    // ── Art & Design ──
    { name: 'Production Designer', cat: 'Art & Design', aliases: ['PD','Art Director','Set Designer'] },
    { name: 'Art Director', cat: 'Art & Design', aliases: ['Art Dept Head','Artistic Director'] },
    { name: 'Set Decorator', cat: 'Art & Design', aliases: ['Set Dresser','Set Dec','Props Buyer'] },
    { name: 'Props Master', cat: 'Art & Design', aliases: ['Props','Property Master','Props Handler','Props Manager'] },
    { name: 'Graphic Designer', cat: 'Art & Design', aliases: ['Motion Designer','Visual Designer','Title Designer'] },
    { name: 'Storyboard Artist', cat: 'Art & Design', aliases: ['Storyboarder','Concept Artist','Vis Dev Artist'] },

    // ── Makeup & Wardrobe ──
    { name: 'Makeup Artist', cat: 'Makeup & Wardrobe', aliases: ['MUA','Make-up','Key Makeup','Makeup Designer','Beauty Artist','HMUA'] },
    { name: 'Hair Stylist', cat: 'Makeup & Wardrobe', aliases: ['Hair','Hairdresser','Key Hair','Hair Designer','Wig Maker'] },
    { name: 'SFX Makeup Artist', cat: 'Makeup & Wardrobe', aliases: ['Prosthetics','Special Effects Makeup','SFX Makeup','Creature Makeup'] },
    { name: 'Costume Designer', cat: 'Makeup & Wardrobe', aliases: ['Wardrobe Designer','Fashion Director','Clothing Designer'] },
    { name: 'Wardrobe Supervisor', cat: 'Makeup & Wardrobe', aliases: ['Wardrobe','Wardrobe Manager','Costume Supervisor','Dresser'] },
    { name: 'Stylist', cat: 'Makeup & Wardrobe', aliases: ['Fashion Stylist','Set Stylist','Personal Stylist','Creative Stylist'] },

    // ── Editing & Post ──
    { name: 'Editor', cat: 'Editing & Post', aliases: ['Film Editor','Video Editor','Picture Editor','Offline Editor','Online Editor','Post Editor'] },
    { name: 'Colorist', cat: 'Editing & Post', aliases: ['Color Grader','DI Colorist','Color Correction','Grading Artist','Color Timer'] },
    { name: 'VFX Artist', cat: 'Editing & Post', aliases: ['Visual Effects','VFX Compositor','Compositor','CGI Artist','VFX Supervisor'] },
    { name: 'Motion Graphics Artist', cat: 'Editing & Post', aliases: ['MoGraph','Motion Designer','Animator','Title Artist'] },
    { name: 'Subtitle / Captioner', cat: 'Editing & Post', aliases: ['Subtitler','Captionist','Translation','Transcriber'] },

    // ── Production ──
    { name: 'Producer', cat: 'Production', aliases: ['Executive Producer','EP','Line Producer','Associate Producer','Co-Producer'] },
    { name: 'Production Manager', cat: 'Production', aliases: ['PM','UPM','Unit Production Manager','Production Supervisor'] },
    { name: 'Production Coordinator', cat: 'Production', aliases: ['POC','Coordinator','Prod Coordinator'] },
    { name: 'Production Assistant', cat: 'Production', aliases: ['PA','Runner','Set PA','Office PA','Production Runner'] },
    { name: 'Location Manager', cat: 'Production', aliases: ['Location Scout','Locations','Location Coordinator'] },
    { name: 'Casting Director', cat: 'Production', aliases: ['Casting','Casting Agent','Casting Manager'] },
    { name: 'Craft Services', cat: 'Production', aliases: ['Crafty','Catering','Set Catering','Food Services'] },
    { name: 'Transportation Captain', cat: 'Production', aliases: ['Transport','Driver','Set Driver','Logistics'] },

    // ── Acting ──
    { name: 'Lead Actor', cat: 'Acting', aliases: ['Lead','Principal Actor','Star','Lead Performer','Protagonist'] },
    { name: 'Supporting Actor', cat: 'Acting', aliases: ['Supporting','Featured Actor','Co-Star'] },
    { name: 'Extra / Background', cat: 'Acting', aliases: ['Extra','Background Actor','BG','Background','Walk-on'] },
    { name: 'Voice Actor', cat: 'Acting', aliases: ['VO','Voice Over','Narrator','Voice Talent','Voice Artist'] },
    { name: 'Stunt Performer', cat: 'Acting', aliases: ['Stunt','Stuntman','Stunt Double','Action Performer'] },
    { name: 'Stand-In', cat: 'Acting', aliases: ['Photo Double','Body Double','Lighting Stand-In'] },

    // ── Music ──
    { name: 'Music Producer', cat: 'Music', aliases: ['Beat Maker','Track Producer','Music Prod'] },
    { name: 'Musician', cat: 'Music', aliases: ['Session Musician','Instrumentalist','Band Member'] },
    { name: 'Singer / Vocalist', cat: 'Music', aliases: ['Singer','Vocalist','Background Vocalist','BV','Backup Singer'] },
    { name: 'DJ', cat: 'Music', aliases: ['Disc Jockey','Turntablist','Club DJ','Event DJ'] },
    { name: 'Choreographer', cat: 'Music', aliases: ['Dance Director','Movement Director','Dance Choreographer'] },

    // ── Writing ──
    { name: 'Screenwriter', cat: 'Writing', aliases: ['Writer','Script Writer','Scriptwriter','Story Writer','Dialogue Writer'] },
    { name: 'Story Editor', cat: 'Writing', aliases: ['Script Editor','Development Executive','Story Consultant'] },
    { name: 'Copywriter', cat: 'Writing', aliases: ['Ad Writer','Copy','Commercial Writer','Scriptwriter (Ads)'] },

    // ── Other ──
    { name: 'Photographer', cat: 'Other', aliases: ['Still Photographer','Set Photographer','BTS Photographer','Unit Stills'] },
    { name: 'Social Media Manager', cat: 'Other', aliases: ['Social Media','Content Creator','Digital Marketing','SMM'] },
    { name: 'Publicist', cat: 'Other', aliases: ['PR','Public Relations','Press Agent','Media Relations'] },
    { name: 'On-Set Medic', cat: 'Other', aliases: ['Medic','Set Nurse','First Aid','Health & Safety'] },
    { name: 'Security', cat: 'Other', aliases: ['Set Security','Security Guard','Private Security'] },
    { name: 'Model', cat: 'Other', aliases: ['Fashion Model','Commercial Model','Fit Model','Runway Model'] },
    { name: 'Influencer', cat: 'Other', aliases: ['Content Creator','Brand Ambassador','Social Influencer'] },
  ];

  var dictSheet = getSheet_('RolesDictionary');
  var aliasSheet = getSheet_('RoleAliases');

  // Clear existing (keep headers)
  if (dictSheet.getLastRow() > 1) dictSheet.getRange(2, 1, dictSheet.getLastRow() - 1, dictSheet.getLastColumn()).clearContent();
  if (aliasSheet.getLastRow() > 1) aliasSheet.getRange(2, 1, aliasSheet.getLastRow() - 1, aliasSheet.getLastColumn()).clearContent();

  var dictRows = [];
  var aliasRows = [];
  var sortOrder = 0;

  for (var i = 0; i < roles.length; i++) {
    var r = roles[i];
    var roleId = 'ROL-' + String(i + 1).padStart(3, '0');
    sortOrder++;
    dictRows.push([roleId, r.name, r.cat, '', sortOrder]);

    // Self-alias (canonical name)
    aliasRows.push([getNextId_('ALS'), roleId, r.name.toLowerCase()]);

    // Additional aliases
    for (var j = 0; j < r.aliases.length; j++) {
      aliasRows.push([getNextId_('ALS'), roleId, r.aliases[j].toLowerCase()]);
    }
  }

  if (dictRows.length > 0) dictSheet.getRange(2, 1, dictRows.length, 5).setValues(dictRows);
  if (aliasRows.length > 0) aliasSheet.getRange(2, 1, aliasRows.length, 3).setValues(aliasRows);

  return {
    success: true,
    roles: dictRows.length,
    aliases: aliasRows.length,
    message: 'Seeded ' + dictRows.length + ' roles with ' + aliasRows.length + ' aliases'
  };
}

/**
 * Resolve a free-text input to a canonical role.
 * Returns { roleId, roleName, category } or null.
 */
function resolveRoleAlias_(input) {
  if (!input) return null;
  var normalized = String(input).toLowerCase().trim();

  var aliases = sheetToObjects_('RoleAliases', COL.ROLE_ALIASES);
  for (var i = 0; i < aliases.length; i++) {
    if (aliases[i].ALIAS === normalized) {
      var roleId = aliases[i].ROLE_ID;
      var roles = sheetToObjects_('RolesDictionary', COL.ROLES_DICTIONARY);
      for (var j = 0; j < roles.length; j++) {
        if (roles[j].ID === roleId) {
          return { roleId: roleId, roleName: roles[j].NAME, category: roles[j].CATEGORY };
        }
      }
    }
  }
  return null;
}
