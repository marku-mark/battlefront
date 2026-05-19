/**
 * Chatbot.js
 * BOLT — Battlefront AI Assistant
 * Powered by the Claude API (claude-sonnet-4-20250514).
 *
 * Features:
 *  - Conversational product & store Q&A
 *  - Quick-reply suggestions
 *  - Escalation prompt for complex issues
 *  - Persisted conversation history per session
 */

const Chatbot = (() => {
  // ── State ──────────────────────────────────────────────────────────────────
  let isOpen        = false;
  let isTyping      = false;
  let conversationHistory = [];   // {role, content}[]

  // ── DOM refs (populated in init) ──────────────────────────────────────────
  let fab, bubble, chatWindow, messagesEl, inputEl, sendBtn, quickRepliesEl;

  // ── System prompt ─────────────────────────────────────────────────────────
  const SYSTEM_PROMPT = `You are BOLT, the friendly and knowledgeable AI assistant for Battlefront Computer Trading — a Philippine PC hardware and peripherals retailer.

Your role:
- Help customers find products, compare specs, and recommend builds based on their budget and use case.
- Answer questions about store hours, locations, warranty (Battlefront Fix), shipping, and promotions.
- Be conversational, concise, and enthusiastic about PC hardware — like a knowledgeable friend who loves tech.
- Always price in Philippine Pesos (₱).
- For questions outside your scope or requiring human judgment (e.g., specific order status, escalations), politely offer to connect them with support via Facebook or the store hotline.

Store info:
- Branches: Bacolod Main (Lacson St), SM Bacolod, Iloilo Branch (Iznart St)
- Hours: Mon–Sat 8AM–6PM, some branches open Sunday
- Hotline: (034) 434-8888
- Warranty: Battlefront Fix — walk-in service at all branches
- Shipping: Free nationwide on orders ₱3,000+; 4-hour Negros delivery for orders before 2PM
- Payment: Visa, Mastercard, GCash, Maya, COD, Bank Transfer

Guidelines:
- Keep replies under 120 words unless the user asks for a detailed breakdown.
- Use bullet points sparingly — prefer natural sentences.
- When recommending products, mention 2–3 options max with key specs and price range.
- Never fabricate specific stock levels or exact prices you are not sure about.
- Always end with a follow-up question or offer to help further.`;

  // ── Quick replies shown at start ──────────────────────────────────────────
  const INITIAL_QUICK_REPLIES = [
    '💻 Recommend a gaming laptop',
    '🖥️ Best budget PC build',
    '📦 Store locations & hours',
    '🛡️ About Battlefront Fix warranty',
    '🚚 Shipping & delivery info',
  ];

  // ── API call ──────────────────────────────────────────────────────────────
  async function callClaude(userMessage) {
    conversationHistory.push({ role: 'user', content: userMessage });

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 1000,
        system: SYSTEM_PROMPT,
        messages: conversationHistory,
      }),
    });

    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      throw new Error(err?.error?.message || `API error ${response.status}`);
    }

    const data = await response.json();
    const reply = data.content?.find(b => b.type === 'text')?.text || 'Sorry, I could not generate a response.';
    conversationHistory.push({ role: 'assistant', content: reply });
    return reply;
  }

  // ── Rendering helpers ─────────────────────────────────────────────────────
  function createMessageEl(role, text) {
    const wrapper = document.createElement('div');
    wrapper.className = `chat-msg chat-msg--${role}`;

    if (role === 'bot') {
      wrapper.innerHTML = `
        <div class="chat-avatar"><i class="ti ti-robot"></i></div>
        <div class="chat-bubble">${formatText(text)}</div>`;
    } else {
      wrapper.innerHTML = `<div class="chat-bubble">${escapeHtml(text)}</div>`;
    }
    return wrapper;
  }

  function createTypingEl() {
    const el = document.createElement('div');
    el.className = 'chat-msg chat-msg--bot chat-typing';
    el.id = 'chatTypingIndicator';
    el.innerHTML = `
      <div class="chat-avatar"><i class="ti ti-robot"></i></div>
      <div class="chat-bubble typing-dots"><span></span><span></span><span></span></div>`;
    return el;
  }

  function appendMessage(role, text) {
    const el = createMessageEl(role, text);
    messagesEl.appendChild(el);
    scrollBottom();
    return el;
  }

  function showTyping() {
    if (isTyping) return;
    isTyping = true;
    messagesEl.appendChild(createTypingEl());
    scrollBottom();
  }

  function hideTyping() {
    document.getElementById('chatTypingIndicator')?.remove();
    isTyping = false;
  }

  function scrollBottom() {
    messagesEl.scrollTop = messagesEl.scrollHeight;
  }

  function setQuickReplies(replies) {
    quickRepliesEl.innerHTML = '';
    replies.forEach(text => {
      const btn = document.createElement('button');
      btn.className = 'quick-reply-btn';
      btn.textContent = text;
      btn.addEventListener('click', () => {
        setQuickReplies([]);
        sendMessage(text);
      });
      quickRepliesEl.appendChild(btn);
    });
  }

  function formatText(text) {
    // Convert markdown-ish bold and line breaks
    return escapeHtml(text)
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\n/g, '<br>');
  }

  function escapeHtml(str) {
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  // ── Send flow ─────────────────────────────────────────────────────────────
  async function sendMessage(text) {
    const msg = text.trim();
    if (!msg) return;

    inputEl.value = '';
    sendBtn.disabled = true;
    appendMessage('user', msg);
    showTyping();

    try {
      const reply = await callClaude(msg);
      hideTyping();
      appendMessage('bot', reply);

      // Offer escalation quick reply after 3 exchanges
      if (conversationHistory.length >= 6) {
        setQuickReplies(['🙋 Talk to a human agent', '📍 Store directions', '🔄 New question']);
      }
    } catch (err) {
      hideTyping();
      appendMessage('bot', `⚠️ Sorry, something went wrong. Please try again or contact us at (034) 434-8888.\n\n_(${err.message})_`);
    } finally {
      sendBtn.disabled = false;
      inputEl.focus();
    }
  }

  // ── Open / Close ──────────────────────────────────────────────────────────
  function openChat() {
    isOpen = true;
    chatWindow.classList.add('open');
    bubble.setAttribute('aria-expanded', 'true');
    bubble.querySelector('.chatbot-notif')?.classList.remove('active');

    if (conversationHistory.length === 0) {
      // Welcome message
      setTimeout(() => {
        appendMessage('bot', "Hey there! 👋 I'm **BOLT**, your Battlefront AI assistant. I can help you find the perfect PC build, check store info, or answer any product questions. What can I help you with today?");
        setQuickReplies(INITIAL_QUICK_REPLIES);
      }, 300);
    }

    inputEl?.focus();
  }

  function closeChat() {
    isOpen = false;
    chatWindow.classList.remove('open');
    bubble.setAttribute('aria-expanded', 'false');
  }

  // ── Init ──────────────────────────────────────────────────────────────────
  function init() {
    fab          = document.getElementById('chatbotFab');
    bubble       = document.getElementById('chatbotBubble');
    chatWindow   = document.getElementById('chatbotWindow');
    messagesEl   = document.getElementById('chatMessages');
    inputEl      = document.getElementById('chatbotInput');
    sendBtn      = document.getElementById('chatbotSendBtn');
    quickRepliesEl = document.getElementById('chatQuickReplies');

    if (!bubble || !chatWindow) return;

    bubble.addEventListener('click', () => isOpen ? closeChat() : openChat());
    document.getElementById('chatbotCloseBtn')?.addEventListener('click', closeChat);

    sendBtn?.addEventListener('click', () => sendMessage(inputEl.value));
    inputEl?.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        sendMessage(inputEl.value);
      }
    });

    // Pulse the notif badge after 4s to attract attention
    setTimeout(() => {
      if (!isOpen) bubble.querySelector('.chatbot-notif')?.classList.add('active');
    }, 4000);
  }

  return { init, open: openChat, close: closeChat };
})();
