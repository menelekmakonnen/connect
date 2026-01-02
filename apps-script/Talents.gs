// ============================================
// ICUNI Connect - Talents API
// ============================================

/**
 * Search talents with filters
 */
function searchTalents(params) {
  try {
    const {
      query = '',
      roles = '',
      city = '',
      availability = '',
      verified_only = 'false',
      budget_tier = '',
      limit = '50',
      offset = '0'
    } = params;
    
    let talents = CacheUtils.getOrSet('ALL_TALENTS_RAW', function() {
        return dbSelectAll(TABLES.TALENTS);
    });
    
    // Filter out deleted
    talents = talents.filter(t => !t.deleted);

    // Filter by visibility (public profiles only for non-admin view)
    if (params.admin_view !== 'true') {
      talents = talents.filter(function(t) {
        var visibility = (t.visibility || t.public_private || 'public').toString().trim().toLowerCase();
        return visibility !== 'private';
      });
    }
    
    // Text search (name, headline, bio)
    if (query) {
      const lowerQuery = query.toLowerCase();
      talents = talents.filter(t => {
        return (
          (t.display_name && t.display_name.toLowerCase().includes(lowerQuery)) ||
          (t.headline && t.headline.toLowerCase().includes(lowerQuery)) ||
          (t.bio && t.bio.toLowerCase().includes(lowerQuery))
        );
      });
      
      // Also search role aliases
      const matchingRoles = searchRolesByAlias(query);
      if (matchingRoles.length > 0) {
        const roleIds = matchingRoles.map(r => r.role_id);
        talents = talents.filter(t => {
          const talentRoles = (t.roles_primary || '').split(',').concat((t.roles_secondary || '').split(','));
          return roleIds.some(rid => talentRoles.includes(rid));
        });
      }
    }
    
    // City filter (case-insensitive)
    if (city) {
      var lowerCity = city.toLowerCase();
      talents = talents.filter(function(t) {
        return t.city && t.city.toLowerCase() === lowerCity;
      });
    }
    
    // Availability filter (case-insensitive)
    if (availability) {
      var lowerAvail = availability.toLowerCase();
      talents = talents.filter(function(t) {
        return t.availability_status && t.availability_status.toLowerCase() === lowerAvail;
      });
    }
    
    // Verified only
    if (verified_only === 'true') {
      talents = talents.filter(t => 
        t.verification_level && t.verification_level !== 'unverified'
      );
    }
    
    // Role filter
    if (roles) {
      const roleIds = roles.split(',');
      talents = talents.filter(t => {
        const talentRoles = (t.roles_primary || '').split(',').concat((t.roles_secondary || '').split(','));
        return roleIds.some(rid => talentRoles.includes(rid));
      });
    }
    
    // Sort by featured, then verification level
    talents.sort((a, b) => {
      if (a.featured && !b.featured) return -1;
      if (!a.featured && b.featured) return 1;
      
      const verificationOrder = {
        'pro_verified': 4,
        'work_verified': 3,
        'profile_verified': 2,
        'unverified': 1
      };
      
      return (verificationOrder[b.verification_level] || 0) - (verificationOrder[a.verification_level] || 0);
    });
    
    // Pagination
    const limitNum = parseInt(limit);
    const offsetNum = parseInt(offset);
    const paginatedTalents = talents.slice(offsetNum, offsetNum + limitNum);
    
    // OPTIMIZATION: Batch load roles and rates once for all paginated talents
    const allRoles = dbSelectAll(TABLES.ROLES);
    const allRates = dbSelectAll(TABLES.TALENT_RATES);
    
    // Create lookup map for rates by talent_id
    const ratesByTalent = {};
    allRates.forEach(rate => {
      if (!ratesByTalent[rate.talent_id]) ratesByTalent[rate.talent_id] = [];
      ratesByTalent[rate.talent_id].push(rate);
    });
    
    // Enrich with roles and rates using pre-loaded data
    const enrichedTalents = paginatedTalents.map(t => {
      const roleIds = (t.roles_primary || '').split(',').filter(id => id);
      const roles = allRoles.filter(r => roleIds.includes(r.role_id));
      
      const rates = ratesByTalent[t.talent_id] || [];
      let rate_range = null;
      
      if (rates.length > 0) {
        const publicRates = rates.filter(r => 
          r.rate_visibility === 'range_public' || r.rate_visibility === 'exact_public'
        );
        
        if (publicRates.length > 0) {
          const amounts = publicRates.map(r => [r.amount_min, r.amount_max]).flat().filter(a => a);
          rate_range = {
            min: Math.min(...amounts),
            max: Math.max(...amounts),
            currency: publicRates[0].currency || 'GHS'
          };
        }
      }
      
      return {
        talent_id: t.talent_id,
        public_slug: t.public_slug,
        display_name: t.display_name,
        headline: t.headline,
        city: t.city,
        roles: roles,
        verification_level: t.verification_level,
        availability_status: t.availability_status,
        profile_photo_url: t.profile_photo_url || '',
        rate_range: rate_range,
        featured: t.featured === 'TRUE' || t.featured === true,
        tags_style: (t.tags_style || '').split(',').filter(tag => tag)
      };
    });
    
    return {
      ok: true,
      data: {
        talents: enrichedTalents,
        total: talents.length,
        limit: limitNum,
        offset: offsetNum
      }
    };
    
  } catch (error) {
    Logger.log('Search error: ' + error.toString());
    return { ok: false, error: error.toString() };
  }
}

/**
 * Search roles by alias
 */
function searchRolesByAlias(query) {
  const aliases = dbSelectAll(TABLES.ROLE_ALIASES);
  const lowerQuery = query.toLowerCase();
  
  const matchingAliases = aliases.filter(a => 
    a.alias_text && a.alias_text.toLowerCase().includes(lowerQuery)
  );
  
  const roleIds = [...new Set(matchingAliases.map(a => a.role_id))];
  const roles = dbSelectAll(TABLES.ROLES).filter(r => roleIds.includes(r.role_id));
  
  return roles;
}

/**
 * Enrich talent card with roles and rate range
 */
function enrichTalentCard(talent) {
  const roleIds = (talent.roles_primary || '').split(',').filter(id => id);
  const allRoles = dbSelectAll(TABLES.ROLES);
  const roles = allRoles.filter(r => roleIds.includes(r.role_id));
  
  const rates = dbSelect(TABLES.TALENT_RATES, { talent_id: talent.talent_id });
  let rate_range = null;
  
  if (rates.length > 0) {
    const publicRates = rates.filter(r => 
      r.rate_visibility === 'range_public' || r.rate_visibility === 'exact_public'
    );
    
    if (publicRates.length > 0) {
      const amounts = publicRates.map(r => [r.amount_min, r.amount_max]).flat().filter(a => a);
      rate_range = {
        min: Math.min(...amounts),
        max: Math.max(...amounts),
        currency: publicRates[0].currency || 'GHS'
      };
    }
  }
  
  return {
    talent_id: talent.talent_id,
    public_slug: talent.public_slug,
    display_name: talent.display_name,
    headline: talent.headline,
    city: talent.city,
    roles: roles,
    verification_level: talent.verification_level,
    availability_status: talent.availability_status,
    profile_photo_url: talent.profile_photo_url || '',
    rate_range: rate_range,
    featured: talent.featured === 'TRUE' || talent.featured === true,
    tags_style: (talent.tags_style || '').split(',').filter(t => t)
  };
}

/**
 * Get talent by ID or slug
 */
function getTalentById(idOrSlug, e) {
  try {
    const cached = CacheUtils.get('TALENT_' + idOrSlug);
    if (cached) return { ok: true, data: cached };

    let talent = dbFindOne(TABLES.TALENTS, { talent_id: idOrSlug });
    if (!talent) {
      talent = dbFindOne(TABLES.TALENTS, { public_slug: idOrSlug });
    }
    
    if (!talent) {
      return { ok: false, error: 'Talent not found' };
    }
    
    // Get roles
    const roleIds = (talent.roles_primary || '').split(',').concat((talent.roles_secondary || '').split(',')).filter(id => id);
    const allRoles = dbSelectAll(TABLES.ROLES);
    const roles = allRoles.filter(r => roleIds.includes(r.role_id));
    
    // Get links
    const links = dbSelect(TABLES.TALENT_LINKS, { talent_id: talent.talent_id });
    
    // Get rates
    const rates = dbSelect(TABLES.TALENT_RATES, { talent_id: talent.talent_id });
    
    const enriched = {
      ...talent,
      roles: roles,
      links: links,
      rates: rates,
      languages: (talent.languages || '').split(',').filter(l => l),
      tags_style: (talent.tags_style || '').split(',').filter(t => t),
      social_links: talent.social_links ? parseJSONSafe(talent.social_links) : {},
      featured_embeds: talent.featured_embeds ? parseJSONSafe(talent.featured_embeds) : []
    };

    CacheUtils.set('TALENT_' + idOrSlug, enriched);
    if (talent.public_slug) {
        CacheUtils.set('TALENT_' + talent.public_slug, enriched);
    }
    
    return { ok: true, data: enriched };
    
  } catch (error) {
    Logger.log('Get talent error: ' + error.toString());
    return { ok: false, error: error.toString() };
  }
}

/**
 * Create a new talent profile
 */
function createTalent(data) {
  try {
    const talentId = generateTalentId();
    const slug = generateUniqueSlug(data.display_name, TABLES.TALENTS);
    
    const talent = {
      talent_id: talentId,
      user_id: data.user_id || '',
      public_slug: slug,
      display_name: data.display_name,
      headline: data.headline || '',
      bio: data.bio || '',
      city: data.city || '',
      neighborhood: data.neighborhood || '',
      languages: Array.isArray(data.languages) ? data.languages.join(',') : (data.languages || ''),
      roles_primary: Array.isArray(data.roles_primary) ? data.roles_primary.join(',') : (data.roles_primary || ''),
      roles_primary: Array.isArray(data.roles_primary) ? data.roles_primary.join(',') : (data.roles_primary || ''),
      roles_secondary: Array.isArray(data.roles_secondary) ? data.roles_secondary.join(',') : (data.roles_secondary || ''),
      verification_level: 'unverified',
      availability_status: data.availability_status || 'available',
      availability_notes: data.availability_notes || '',
      profile_photo_url: data.profile_photo_url || '',
      profile_photo_drive_id: data.profile_photo_drive_id || '',
      portfolio_drive_folder_id: data.portfolio_drive_folder_id || '',
      social_links: typeof data.social_links === 'object' ? JSON.stringify(data.social_links) : (data.social_links || ''),
      featured_embeds: Array.isArray(data.featured_embeds) ? JSON.stringify(data.featured_embeds) : (data.featured_embeds || ''),
      featured: false,
      tags_style: Array.isArray(data.tags_style) ? data.tags_style.join(',') : (data.tags_style || ''),
      created_at: getTimestamp(),
      updated_at: getTimestamp(),
      visibility: data.visibility || (data.public_private || 'public'),
      deleted: false
    };
    
    dbInsert(TABLES.TALENTS, talent);
    CacheUtils.remove('ALL_TALENTS_RAW');
    
    return { ok: true, data: talent };
    
  } catch (error) {
    Logger.log('Create talent error: ' + error.toString());
    return { ok: false, error: error.toString() };
  }
}

/**
 * Update talent profile
 */
function updateTalent(talentId, updates) {
  try {
    // Convert arrays to comma-separated strings
    if (updates.languages && Array.isArray(updates.languages)) {
      updates.languages = updates.languages.join(',');
    }
    if (updates.roles_primary && Array.isArray(updates.roles_primary)) {
      updates.roles_primary = updates.roles_primary.join(',');
    }
    if (updates.roles_secondary && Array.isArray(updates.roles_secondary)) {
      updates.roles_secondary = updates.roles_secondary.join(',');
    }
    if (updates.tags_style && Array.isArray(updates.tags_style)) {
      updates.tags_style = updates.tags_style.join(',');
    }
    if (updates.social_links && typeof updates.social_links === 'object') {
      updates.social_links = JSON.stringify(updates.social_links);
    }
    if (updates.featured_embeds && Array.isArray(updates.featured_embeds)) {
      updates.featured_embeds = JSON.stringify(updates.featured_embeds);
    }
    
    updates.updated_at = getTimestamp();
    
    dbUpdate(TABLES.TALENTS, { talent_id: talentId }, updates);
    CacheUtils.remove('ALL_TALENTS_RAW');
    CacheUtils.remove('TALENT_' + talentId);
    
    return { ok: true, data: { talent_id: talentId } };
    
  } catch (error) {
    Logger.log('Update talent error: ' + error.toString());
    return { ok: false, error: error.toString() };
  }
}

/**
 * Add a link to talent profile
 */
function addTalentLink(talentId, linkData) {
  try {
    const linkId = generateLinkId();
    
    const link = {
      link_id: linkId,
      talent_id: talentId,
      link_type: linkData.link_type,
      label: linkData.label || '',
      url: linkData.url,
      is_primary: linkData.is_primary || false,
      created_at: getTimestamp()
    };
    
    dbInsert(TABLES.TALENT_LINKS, link);
    CacheUtils.remove('TALENT_' + talentId);
    
    return { ok: true, data: link };
    
  } catch (error) {
    Logger.log('Add link error: ' + error.toString());
    return { ok: false, error: error.toString() };
  }
}

/**
 * Upsert talent rates
 */
function upsertTalentRates(talentId, ratesData) {
  try {
    // Delete existing rates for this talent
    dbUpdate(TABLES.TALENT_RATES, { talent_id: talentId }, { deleted: true });
    
    // Insert new rates
    const rates = Array.isArray(ratesData) ? ratesData : [ratesData];
    const insertedRates = rates.map(rateData => {
      const rateId = generateRateId();
      
      const rate = {
        rate_id: rateId,
        talent_id: talentId,
        rate_visibility: rateData.rate_visibility || 'private',
        rate_type: rateData.rate_type || 'day',
        currency: rateData.currency || 'GHS',
        amount_min: rateData.amount_min || '',
        amount_max: rateData.amount_max || '',
        amount_exact: rateData.amount_exact || '',
        includes: rateData.includes || '',
        excludes: rateData.excludes || '',
        overtime_policy: rateData.overtime_policy || '',
        usage_policy: rateData.usage_policy || '',
        cancellation_policy: rateData.cancellation_policy || '',
        updated_at: getTimestamp(),
        deleted: false
      };
      
      dbInsert(TABLES.TALENT_RATES, rate);
      return rate;
    });
    
    CacheUtils.remove('TALENT_' + talentId);
    return { ok: true, data: insertedRates };
    
  } catch (error) {
    Logger.log('Upsert rates error: ' + error.toString());
    return { ok: false, error: error.toString() };
  }
}

/**
 * Claim a talent profile
 */
function claimTalentProfile(talentId, userId) {
  try {
    const talent = dbFindOne(TABLES.TALENTS, { talent_id: talentId });
    
    if (!talent) {
      return { ok: false, error: 'Talent not found' };
    }
    
    if (talent.user_id && talent.user_id !== '') {
      return { ok: false, error: 'This profile has already been claimed' };
    }
    
    dbUpdate(TABLES.TALENTS, { talent_id: talentId }, {
      user_id: userId,
      updated_at: getTimestamp()
    });
    CacheUtils.remove('ALL_TALENTS_RAW');
    CacheUtils.remove('TALENT_' + talentId);
    
    return { ok: true, data: { talent_id: talentId, user_id: userId } };
    
  } catch (error) {
    Logger.log('Claim profile error: ' + error.toString());
    return { ok: false, error: error.toString() };
  }
}

function parseJSONSafe(jsonString) {
  try {
    return JSON.parse(jsonString);
  } catch (e) {
    return null;
  }
}
