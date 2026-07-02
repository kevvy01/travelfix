window.ai = {
  calculateMatch: function(user, project) {
    let score = 0;
    let reasonParts = [];

    const userSkills = user.skills || [];
    const userInterests = user.interests || [];
    const projCategories = project.categories || [];

    let matchingSkills = [];
    let matchingCats = [];

    if (projCategories.length === 0) {
      score = 100; // Default high if no requirements
    } else {
      // Score is strictly based on skills match percentage
      matchingSkills = projCategories.filter(c => userSkills.includes(c));
      score = (matchingSkills.length / projCategories.length) * 100;

      // Interests are only used for explanations
      matchingCats = projCategories.filter(c => userInterests.includes(c));

      if (matchingSkills.length > 0) {
        reasonParts.push(`Membutuhkan ${matchingSkills.length} keahlian Anda (${matchingSkills.slice(0, 2).join(', ')}${matchingSkills.length > 2 ? ', dll' : ''}).`);
      }
      if (matchingCats.length > 0 && matchingSkills.length < projCategories.length) {
        reasonParts.push(`Sesuai minat Anda di bidang ${matchingCats[0]}.`);
      }
    }

    // Location is only used for explanations
    let locMatch = false;
    if (project.location && user.location && project.location.toLowerCase().includes(user.location.toLowerCase())) {
      locMatch = true;
      reasonParts.push(`Lokasi sesuai domisili Anda.`);
    }

    return {
      score: Math.min(100, Math.round(score)),
      reason: reasonParts.join(' ') || 'Profil cocok.'
    };
  },

  evaluateTalent: function(freelancer, neededSkills, neededCats) {
    const fSkills = freelancer.skills || [];
    
    // Combine all project requirements (skills + categories) for the matching source
    const requiredSkillsSet = new Set([...neededSkills, ...neededCats]);
    const requiredSkills = Array.from(requiredSkillsSet);
    
    if (fSkills.length === 0 || requiredSkills.length === 0) {
      return { matchPercent: 0, matchReason: '' };
    }
    
    // Compare project requirements strictly against freelancer.skills
    const matchingSkills = requiredSkills.filter(req => fSkills.includes(req));
    const score = Math.round((matchingSkills.length / requiredSkills.length) * 100);
    
    if (score === 0) {
      return { matchPercent: 0, matchReason: '' };
    }
    
    const reason = `Matched ${matchingSkills.length} of ${requiredSkills.length} required skills.`;
    
    return {
      matchPercent: score,
      matchReason: reason
    };
  }
};
