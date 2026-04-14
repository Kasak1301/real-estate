const TYPE_STYLES = {
  'Villa':      { emoji: '🏡', gradClass: 'green-grad' },
  'Condo':      { emoji: '🏢', gradClass: 'brown-grad' },
  'Ranch':      { emoji: '🏠', gradClass: 'slate-grad' },
  'Estate':     { emoji: '🏰', gradClass: 'purple-grad' },
  'Townhouse':  { emoji: '🏘️', gradClass: 'teal-grad' },
  'Penthouse':  { emoji: '🏢', gradClass: 'purple-grad' },
  'Manor':      { emoji: '🏰', gradClass: 'green-grad' },
  'Cottage':    { emoji: '🏡', gradClass: 'teal-grad' },
  'Apartment':  { emoji: '🏗️', gradClass: 'brown-grad' },
};

const DEFAULT_PROPERTIES = [
  { id: 1, name: 'Modern Family Villa',    type: 'Villa',     location: 'Oakwood Heights',  price: 1250000, beds: 4, baths: 3, sqft: 2800, garage: 2, status: 'For Sale', gradClass: 'green-grad',  emoji: '🏡', createdAt: '2024-01-10' },
  { id: 2, name: 'Downtown Luxury Condo',  type: 'Condo',     location: 'City Centre',       price: 780000,  beds: 2, baths: 2, sqft: 1400, garage: 1, status: 'New',      gradClass: 'brown-grad',  emoji: '🏢', createdAt: '2024-02-01' },
  { id: 3, name: 'Charming Suburban Ranch',type: 'Ranch',     location: 'Maplewood Grove',   price: 625000,  beds: 3, baths: 2, sqft: 1950, garage: 2, status: 'Sold',     gradClass: 'slate-grad',  emoji: '🏠', createdAt: '2024-01-05' },
  { id: 4, name: 'Elmwood Estate',         type: 'Estate',    location: 'Elmwood Heights',   price: 2400000, beds: 5, baths: 4, sqft: 5200, garage: 3, status: 'Featured', gradClass: 'purple-grad', emoji: '🏰', createdAt: '2024-03-15' },
  { id: 5, name: 'Lakeside Retreat',       type: 'Cottage',   location: 'Lakeside District', price: 895000,  beds: 3, baths: 2, sqft: 2100, garage: 1, status: 'New',      gradClass: 'teal-grad',   emoji: '🏡', createdAt: '2024-03-20' },
  { id: 6, name: 'Garden Townhouse',       type: 'Townhouse', location: 'Riverside Park',    price: 450000,  beds: 3, baths: 2, sqft: 1600, garage: 1, status: 'For Sale', gradClass: 'teal-grad',   emoji: '🏘️', createdAt: '2024-02-18' },
  { id: 7, name: 'Penthouse Suite',        type: 'Penthouse', location: 'City Centre',       price: 1800000, beds: 3, baths: 3, sqft: 2400, garage: 2, status: 'For Sale', gradClass: 'purple-grad', emoji: '🏢', createdAt: '2024-04-01' },
  { id: 8, name: 'Heritage Manor',         type: 'Manor',     location: 'Heritage Hill',     price: 3200000, beds: 6, baths: 5, sqft: 7000, garage: 4, status: 'For Sale', gradClass: 'green-grad',  emoji: '🏰', createdAt: '2024-04-08' },
];

const DEFAULT_REVIEWS = [
  { id: 1, author: 'James & Linda K.', location: 'Oakwood Heights',  initials: 'JK', rating: 5, visible: true, text: 'Sarah made selling our home effortless. We received an offer in 3 days — well above asking price.',                            createdAt: '2024-01-15' },
  { id: 2, author: 'Marcus T.',         location: 'City Centre',       initials: 'MT', rating: 5, visible: true, text: 'As first-time buyers, we were nervous. Sarah walked us through absolutely everything. We couldn\'t be happier.',               createdAt: '2024-02-20' },
  { id: 3, author: 'Priya & Anil S.',   location: 'Maplewood Grove',   initials: 'PS', rating: 5, visible: true, text: 'Professional, responsive, and incredibly knowledgeable. Hands down the best agent in the region.',                            createdAt: '2024-03-10' },
  { id: 4, author: 'Rachel M.',         location: 'Lakeside District', initials: 'RM', rating: 5, visible: true, text: 'Sarah found us our dream home in an incredibly competitive market. Her negotiation skills are unmatched.',                     createdAt: '2024-04-05' },
  { id: 5, author: 'Daniel W.',         location: 'Riverside Park',    initials: 'DW', rating: 4, visible: true, text: 'Very professional service. The process was smooth and Sarah kept us informed every step of the way. Highly recommend.',        createdAt: '2024-04-10' },
];

const DB = {
  getProperties() {
    const raw = localStorage.getItem('pr_properties');
    if (raw) return JSON.parse(raw);
    localStorage.setItem('pr_properties', JSON.stringify(DEFAULT_PROPERTIES));
    return DEFAULT_PROPERTIES;
  },
  setProperties(props) {
    localStorage.setItem('pr_properties', JSON.stringify(props));
  },
  addProperty(prop) {
    const props = this.getProperties();
    prop.id = Date.now();
    prop.createdAt = new Date().toISOString().split('T')[0];
    const style = TYPE_STYLES[prop.type] || { emoji: '🏠', gradClass: 'slate-grad' };
    prop.emoji = style.emoji;
    prop.gradClass = style.gradClass;
    props.unshift(prop);
    this.setProperties(props);
    return prop;
  },
  updateProperty(id, updates) {
    const props = this.getProperties();
    const idx = props.findIndex(p => p.id == id);
    if (idx !== -1) {
      const style = TYPE_STYLES[updates.type] || { emoji: '🏠', gradClass: 'slate-grad' };
      updates.emoji = style.emoji;
      updates.gradClass = style.gradClass;
      props[idx] = { ...props[idx], ...updates };
      this.setProperties(props);
      return props[idx];
    }
  },
  deleteProperty(id) {
    this.setProperties(this.getProperties().filter(p => p.id != id));
  },

  getBookings() {
    const raw = localStorage.getItem('pr_bookings');
    return raw ? JSON.parse(raw) : [];
  },
  addBooking(booking) {
    const bookings = this.getBookings();
    booking.id = Date.now();
    booking.status = 'pending';
    booking.createdAt = new Date().toISOString();
    bookings.unshift(booking);
    localStorage.setItem('pr_bookings', JSON.stringify(bookings));
    return booking;
  },
  updateBookingStatus(id, status) {
    const bookings = this.getBookings();
    const idx = bookings.findIndex(b => b.id == id);
    if (idx !== -1) {
      bookings[idx].status = status;
      localStorage.setItem('pr_bookings', JSON.stringify(bookings));
    }
  },

  getReviews() {
    const raw = localStorage.getItem('pr_reviews');
    if (raw) return JSON.parse(raw);
    localStorage.setItem('pr_reviews', JSON.stringify(DEFAULT_REVIEWS));
    return DEFAULT_REVIEWS;
  },
  setReviews(reviews) {
    localStorage.setItem('pr_reviews', JSON.stringify(reviews));
  },
  addReview(review) {
    const reviews = this.getReviews();
    review.id = Date.now();
    review.createdAt = new Date().toISOString().split('T')[0];
    review.visible = true;
    const words = review.author.trim().split(' ');
    review.initials = (words[0][0] + (words[words.length - 1][0] || '')).toUpperCase();
    reviews.unshift(review);
    this.setReviews(reviews);
    return review;
  },
  toggleReviewVisibility(id) {
    const reviews = this.getReviews();
    const idx = reviews.findIndex(r => r.id == id);
    if (idx !== -1) {
      reviews[idx].visible = reviews[idx].visible === false ? true : false;
      this.setReviews(reviews);
    }
  },
  deleteReview(id) {
    this.setReviews(this.getReviews().filter(r => r.id != id));
  },

  isAdminLoggedIn() {
    return sessionStorage.getItem('pr_admin') === 'true';
  },
  adminLogin(username, password) {
    if (username === 'admin' && password === 'premier2024') {
      sessionStorage.setItem('pr_admin', 'true');
      return true;
    }
    return false;
  },
  adminLogout() {
    sessionStorage.removeItem('pr_admin');
  },
};
