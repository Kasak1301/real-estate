(function () {
  const FAQS = [
    { q: 'What areas do you serve?',           a: 'We cover Oakwood Heights, City Centre, Maplewood Grove, Lakeside District, Riverside Park, Elmwood Heights, Heritage Hill, and surrounding neighbourhoods.' },
    { q: 'How long does it take to sell?',     a: 'On average, we close deals within 30–45 days. In competitive markets, we\'ve received offers in as little as 3 days above asking price.' },
    { q: 'Do you offer free valuations?',      a: 'Yes! Sarah offers free, no-obligation home valuations backed by real market data — no strings attached.' },
    { q: 'What are your commission fees?',     a: 'Our fees are competitive and fully transparent. Contact us for a personalised quote tailored to your situation.' },
    { q: 'How do I schedule a tour?',          a: 'You can use this chat to submit a booking request, or fill out the contact form on our homepage. Sarah will confirm within 24 hours.' },
    { q: 'Are your listings up to date?',      a: 'Yes, our listings are updated regularly. For the very latest availability, feel free to reach out directly.' },
  ];

  let state = 'idle';
  let bookingData = {};
  let findData = {};

  function formatPrice(n) {
    return '$' + Number(n).toLocaleString();
  }

  function createWidget() {
    const widget = document.createElement('div');
    widget.id = 'chatbot-widget';
    widget.innerHTML = `
      <button id="chat-toggle" aria-label="Open chat">
        <span class="chat-icon-open">💬</span>
        <span class="chat-icon-close">✕</span>
      </button>
      <div id="chat-window">
        <div id="chat-header">
          <div class="chat-header-info">
            <div class="chat-avatar">PR</div>
            <div>
              <strong>Premier Realty Assistant</strong>
              <span class="chat-status">● Online</span>
            </div>
          </div>
          <button id="chat-close-btn">✕</button>
        </div>
        <div id="chat-messages"></div>
        <div id="chat-quick-replies"></div>
        <div id="chat-input-area">
          <input type="text" id="chat-input" placeholder="Type a message...">
          <button id="chat-send">→</button>
        </div>
      </div>
    `;
    document.body.appendChild(widget);

    document.getElementById('chat-toggle').addEventListener('click', toggleChat);
    document.getElementById('chat-close-btn').addEventListener('click', toggleChat);
    document.getElementById('chat-send').addEventListener('click', sendUserMessage);
    document.getElementById('chat-input').addEventListener('keydown', function (e) {
      if (e.key === 'Enter') sendUserMessage();
    });

    setTimeout(function () { startConversation(); }, 400);
  }

  function toggleChat() {
    const win = document.getElementById('chat-window');
    const btn = document.getElementById('chat-toggle');
    const open = win.classList.toggle('open');
    btn.classList.toggle('active', open);
    if (open && document.getElementById('chat-messages').children.length === 0) {
      startConversation();
    }
  }

  function startConversation() {
    state = 'idle';
    botMessage('Hi there! 👋 I\'m your Premier Realty assistant. How can I help you today?');
    showQuickReplies([
      { label: '🏠 Find Properties', value: 'find' },
      { label: '📅 Book a Tour', value: 'book' },
      { label: '❓ FAQs', value: 'faq' },
      { label: '📞 Talk to Agent', value: 'agent' },
    ]);
  }

  function botMessage(text, delay) {
    const msgs = document.getElementById('chat-messages');
    setTimeout(function () {
      const typing = document.createElement('div');
      typing.className = 'chat-msg bot-msg typing-indicator';
      typing.innerHTML = '<span></span><span></span><span></span>';
      msgs.appendChild(typing);
      scrollBottom();

      setTimeout(function () {
        typing.remove();
        const div = document.createElement('div');
        div.className = 'chat-msg bot-msg';
        div.innerHTML = '<div class="msg-bubble">' + text + '</div>';
        msgs.appendChild(div);
        scrollBottom();
      }, 700);
    }, delay || 0);
  }

  function userMessage(text) {
    const msgs = document.getElementById('chat-messages');
    const div = document.createElement('div');
    div.className = 'chat-msg user-msg';
    div.innerHTML = '<div class="msg-bubble">' + escHtml(text) + '</div>';
    msgs.appendChild(div);
    scrollBottom();
  }

  function showQuickReplies(options) {
    const qr = document.getElementById('chat-quick-replies');
    qr.innerHTML = '';
    options.forEach(function (opt) {
      const btn = document.createElement('button');
      btn.className = 'qr-btn';
      btn.textContent = opt.label;
      btn.addEventListener('click', function () {
        qr.innerHTML = '';
        userMessage(opt.label);
        handleIntent(opt.value);
      });
      qr.appendChild(btn);
    });
  }

  function sendUserMessage() {
    const input = document.getElementById('chat-input');
    const text = input.value.trim();
    if (!text) return;
    input.value = '';
    document.getElementById('chat-quick-replies').innerHTML = '';
    userMessage(text);
    handleTextInput(text);
  }

  function handleIntent(value) {
    if (value === 'find') {
      state = 'find_type';
      findData = {};
      botMessage('Great! What type of property are you looking for?', 300);
      setTimeout(function () {
        showQuickReplies([
          { label: '🏡 Villa', value: 'Villa' },
          { label: '🏢 Condo / Penthouse', value: 'Condo' },
          { label: '🏠 Ranch / Townhouse', value: 'Ranch' },
          { label: '🏰 Estate / Manor', value: 'Estate' },
          { label: '🏡 Cottage', value: 'Cottage' },
          { label: '✨ Any Type', value: 'any' },
        ]);
      }, 1200);
    } else if (value === 'book') {
      state = 'booking_name';
      bookingData = {};
      botMessage('I\'d love to help you schedule a tour! 📅<br><br><em>Please note: this submits a <strong>pending request</strong>. Sarah will confirm your appointment within 24 hours.</em>', 300);
      setTimeout(function () { botMessage('First, what\'s your name?'); }, 1500);
    } else if (value === 'faq') {
      state = 'faq';
      botMessage('Here are some common questions. Tap one to read the answer:', 300);
      setTimeout(function () {
        showQuickReplies(FAQS.map(function (f, i) { return { label: f.q, value: 'faq_' + i }; }).concat([{ label: '← Back to Menu', value: 'menu' }]));
      }, 1100);
    } else if (value === 'agent') {
      botMessage('You can reach Sarah directly at:<br><br>📞 <strong>(555) 123-4567</strong><br>✉️ <strong>sarah@premierrealty.com</strong><br><br>Or fill out the <a href="#contact" onclick="document.getElementById(\'chat-toggle\').click()">contact form</a> on this page.', 300);
      setTimeout(function () {
        showQuickReplies([{ label: '← Back to Menu', value: 'menu' }]);
      }, 1500);
    } else if (value === 'menu') {
      state = 'idle';
      botMessage('What else can I help you with?', 300);
      setTimeout(function () {
        showQuickReplies([
          { label: '🏠 Find Properties', value: 'find' },
          { label: '📅 Book a Tour', value: 'book' },
          { label: '❓ FAQs', value: 'faq' },
          { label: '📞 Talk to Agent', value: 'agent' },
        ]);
      }, 1100);
    } else if (value.startsWith('faq_')) {
      const idx = parseInt(value.replace('faq_', ''));
      const faq = FAQS[idx];
      if (faq) {
        botMessage('<strong>' + faq.q + '</strong><br><br>' + faq.a, 300);
        setTimeout(function () {
          showQuickReplies(FAQS.map(function (f, i) { return { label: f.q, value: 'faq_' + i }; }).concat([{ label: '← Back to Menu', value: 'menu' }]));
        }, 1500);
      }
    } else if (state === 'find_type') {
      findData.type = value === 'any' ? null : value;
      state = 'find_budget';
      botMessage('What\'s your budget range?', 300);
      setTimeout(function () {
        showQuickReplies([
          { label: 'Under $500K', value: '0-500000' },
          { label: '$500K – $1M', value: '500000-1000000' },
          { label: '$1M – $2M', value: '1000000-2000000' },
          { label: '$2M+', value: '2000000-99999999' },
          { label: 'Flexible', value: '0-99999999' },
        ]);
      }, 1100);
    } else if (state === 'find_budget') {
      var parts = value.split('-');
      findData.minPrice = parseInt(parts[0]);
      findData.maxPrice = parseInt(parts[1]);
      state = 'find_location';
      botMessage('Any preferred neighbourhood or city? (Type it or say "anywhere")', 300);
    }
  }

  function handleTextInput(text) {
    if (state === 'find_location') {
      findData.location = text.toLowerCase() === 'anywhere' ? null : text;
      showMatchingProperties();
    } else if (state === 'booking_name') {
      bookingData.name = text;
      state = 'booking_email';
      botMessage('Thanks, ' + escHtml(text) + '! What\'s your email address?', 300);
    } else if (state === 'booking_email') {
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(text.trim())) {
        botMessage('⚠️ That doesn\'t look like a valid email address. Please enter a valid email (e.g. jane@example.com).', 300);
        return;
      }
      bookingData.email = text.trim();
      state = 'booking_phone';
      botMessage('Got it. What\'s your phone number? (10 digits)', 300);
    } else if (state === 'booking_phone') {
      var digits = text.replace(/[\s\-\(\)\+\.]/g, '');
      if (!/^\d{10}$/.test(digits)) {
        botMessage('⚠️ Please enter a valid 10-digit phone number (numbers only, e.g. 5551234567).', 300);
        return;
      }
      bookingData.phone = digits;
      state = 'booking_property';
      botMessage('Which property are you interested in? (or type "general inquiry")', 300);
    } else if (state === 'booking_property') {
      bookingData.property = text;
      state = 'booking_date';
      var today = new Date();
      var maxDate = new Date(today);
      maxDate.setMonth(maxDate.getMonth() + 1);
      var fmt = function (d) { return (d.getMonth()+1) + '/' + d.getDate() + '/' + d.getFullYear(); };
      botMessage('What date would you like to schedule the tour?<br><small>Enter a date between <strong>' + fmt(today) + '</strong> and <strong>' + fmt(maxDate) + '</strong> (e.g. MM/DD/YYYY)</small>', 300);
    } else if (state === 'booking_date') {
      var d = new Date(text);
      if (isNaN(d.getTime())) {
        botMessage('⚠️ I couldn\'t read that date. Please use a format like <strong>05/20/2025</strong> or <strong>May 20, 2025</strong>.', 300);
        return;
      }
      var now = new Date(); now.setHours(0,0,0,0);
      var max = new Date(now); max.setMonth(max.getMonth() + 1);
      if (d < now) {
        botMessage('⚠️ That date is in the past. Please choose a future date.', 300);
        return;
      }
      if (d > max) {
        botMessage('⚠️ Tours can only be scheduled within the next month. Please choose a date within 30 days.', 300);
        return;
      }
      bookingData.date = text;
      state = 'booking_message';
      botMessage('Almost there! Any additional message or preference for Sarah?', 300);
    } else if (state === 'booking_message') {
      bookingData.message = text;
      submitBooking();
    } else if (state === 'faq' || state === 'idle') {
      var lower = text.toLowerCase();
      if (lower.includes('book') || lower.includes('tour') || lower.includes('visit')) {
        handleIntent('book');
      } else if (lower.includes('find') || lower.includes('propert') || lower.includes('buy') || lower.includes('rent')) {
        handleIntent('find');
      } else if (lower.includes('faq') || lower.includes('question') || lower.includes('help')) {
        handleIntent('faq');
      } else if (lower.includes('agent') || lower.includes('contact') || lower.includes('call') || lower.includes('email')) {
        handleIntent('agent');
      } else {
        botMessage('I\'m here to help! You can ask me to find properties, book a tour, or answer FAQs.', 300);
        setTimeout(function () {
          showQuickReplies([
            { label: '🏠 Find Properties', value: 'find' },
            { label: '📅 Book a Tour', value: 'book' },
            { label: '❓ FAQs', value: 'faq' },
          ]);
        }, 1200);
      }
    }
  }

  function showMatchingProperties() {
    var all = DB.getProperties();
    var matches = all.filter(function (p) {
      var typeOk = !findData.type || p.type === findData.type ||
        (findData.type === 'Condo' && (p.type === 'Condo' || p.type === 'Penthouse')) ||
        (findData.type === 'Ranch' && (p.type === 'Ranch' || p.type === 'Townhouse')) ||
        (findData.type === 'Estate' && (p.type === 'Estate' || p.type === 'Manor'));
      var priceOk = p.price >= findData.minPrice && p.price <= findData.maxPrice;
      var locOk = !findData.location || p.location.toLowerCase().includes(findData.location.toLowerCase());
      return typeOk && priceOk && locOk;
    }).slice(0, 3);

    if (matches.length === 0) {
      botMessage('I couldn\'t find an exact match, but don\'t worry! Contact Sarah directly and she\'ll find the perfect property for you. 🏡', 300);
    } else {
      var html = 'Here are ' + matches.length + ' propert' + (matches.length === 1 ? 'y' : 'ies') + ' matching your criteria:<br><br>';
      matches.forEach(function (p) {
        html += '<div class="chat-property-card">';
        html += '<div class="cpc-emoji">' + p.emoji + '</div>';
        html += '<div class="cpc-info"><strong>' + escHtml(p.name) + '</strong>';
        html += '<span>' + escHtml(p.location) + ' · ' + formatPrice(p.price) + '</span>';
        html += '<span>' + p.beds + ' bd · ' + p.baths + ' ba · ' + Number(p.sqft).toLocaleString() + ' ft²</span></div></div>';
      });
      botMessage(html, 300);
    }

    state = 'idle';
    setTimeout(function () {
      showQuickReplies([
        { label: '📅 Book a Tour', value: 'book' },
        { label: '🔍 View All Properties', value: 'all_props' },
        { label: '← Back to Menu', value: 'menu' },
      ]);
    }, 1800);
  }

  function handleIntent_extended(value) {
    if (value === 'all_props') {
      window.location.href = 'properties.html';
    } else {
      handleIntent(value);
    }
  }

  var _origShowQR = showQuickReplies;
  showQuickReplies = function (options) {
    var qr = document.getElementById('chat-quick-replies');
    qr.innerHTML = '';
    options.forEach(function (opt) {
      var btn = document.createElement('button');
      btn.className = 'qr-btn';
      btn.textContent = opt.label;
      btn.addEventListener('click', function () {
        qr.innerHTML = '';
        userMessage(opt.label);
        if (opt.value === 'all_props') {
          window.location.href = 'properties.html';
        } else {
          handleIntent(opt.value);
        }
      });
      qr.appendChild(btn);
    });
  };

  function submitBooking() {
    if (typeof DB !== 'undefined') {
      DB.addBooking({
        name: bookingData.name,
        email: bookingData.email,
        phone: bookingData.phone,
        property: bookingData.property,
        message: bookingData.message,
      });
    }
    state = 'idle';
    bookingData = {};
    botMessage('✅ Your booking request has been submitted! It\'s currently <strong>pending review</strong>.<br><br>Sarah will confirm your appointment within 24 hours. We look forward to meeting you! 🏡', 300);
    setTimeout(function () {
      showQuickReplies([
        { label: '🏠 Find More Properties', value: 'find' },
        { label: '❓ FAQs', value: 'faq' },
        { label: '← Back to Menu', value: 'menu' },
      ]);
    }, 1500);
  }

  function scrollBottom() {
    var msgs = document.getElementById('chat-messages');
    if (msgs) msgs.scrollTop = msgs.scrollHeight;
  }

  function escHtml(str) {
    return String(str).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', createWidget);
  } else {
    createWidget();
  }
})();
