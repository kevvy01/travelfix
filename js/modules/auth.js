window.auth = {
  getCurrentUser: function() {
    try {
      const userJson = localStorage.getItem('currentUser');
      return userJson ? JSON.parse(userJson) : null;
    } catch (e) {
      return null;
    }
  },

  setCurrentUser: function(user) {
    localStorage.setItem('currentUser', JSON.stringify(user));
  },

  clearCurrentUser: function() {
    localStorage.removeItem('currentUser');
  },

  isLoggedIn: function() {
    return !!this.getCurrentUser();
  },

  getCurrentRole: function() {
    const user = this.getCurrentUser();
    return user ? user.role : null;
  },

  logout: function() {
    this.clearCurrentUser();
    window.location.href = 'login.html';
  }
};
