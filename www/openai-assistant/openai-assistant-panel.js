// Import lit from a local copy to avoid unresolved module errors
import { LitElement, html, css } from './lit.js';

class OpenAIAssistantPanel extends LitElement {
  static styles = css`
    :host {
      display: block;
      padding: 16px;
      background: var(--primary-background-color);
      color: var(--primary-text-color);
    }

    .container {
      max-width: 1200px;
      margin: 0 auto;
    }

    .header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 24px;
      padding-bottom: 16px;
      border-bottom: 1px solid var(--divider-color);
    }

    .title {
      display: flex;
      align-items: center;
      font-size: 28px;
      font-weight: 300;
      color: var(--primary-text-color);
    }

    .title ha-icon {
      margin-right: 12px;
      color: var(--accent-color);
    }

    .stats {
      display: flex;
      gap: 16px;
      margin-bottom: 24px;
    }

    .stat-card {
      background: var(--card-background-color);
      border-radius: 12px;
      padding: 16px;
      flex: 1;
      box-shadow: var(--ha-card-box-shadow);
      border: 1px solid var(--divider-color);
    }

    .stat-title {
      font-size: 14px;
      color: var(--secondary-text-color);
      margin-bottom: 8px;
      display: flex;
      align-items: center;
    }

    .stat-title ha-icon {
      margin-right: 8px;
    }

    .stat-value {
      font-size: 24px;
      font-weight: 500;
      color: var(--primary-text-color);
    }

    .main-content {
      display: grid;
      grid-template-columns: 1fr 300px;
      gap: 24px;
    }

    @media (max-width: 768px) {
      .main-content {
        grid-template-columns: 1fr;
      }
      
      .stats {
        grid-template-columns: 1fr 1fr;
      }
    }

    .chat-container {
      background: var(--card-background-color);
      border-radius: 12px;
      box-shadow: var(--ha-card-box-shadow);
      border: 1px solid var(--divider-color);
      display: flex;
      flex-direction: column;
      height: 600px;
    }

    .chat-header {
      padding: 16px 20px;
      border-bottom: 1px solid var(--divider-color);
      display: flex;
      align-items: center;
      justify-content: space-between;
    }

    .chat-title {
      font-size: 18px;
      font-weight: 500;
      display: flex;
      align-items: center;
    }

    .chat-title ha-icon {
      margin-right: 8px;
      color: var(--accent-color);
    }

    .chat-messages {
      flex: 1;
      padding: 20px;
      overflow-y: auto;
      display: flex;
      flex-direction: column;
      gap: 16px;
    }

    .message {
      display: flex;
      align-items: flex-start;
      gap: 12px;
      animation: slideIn 0.3s ease-out;
    }

    .message.user {
      flex-direction: row-reverse;
    }

    .message-avatar {
      width: 32px;
      height: 32px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }

    .message.user .message-avatar {
      background: var(--accent-color);
      color: white;
    }

    .message.assistant .message-avatar {
      background: var(--primary-color);
      color: white;
    }

    .message-content {
      background: var(--secondary-background-color);
      padding: 12px 16px;
      border-radius: 18px;
      max-width: 70%;
      word-wrap: break-word;
    }

    .message.user .message-content {
      background: var(--accent-color);
      color: white;
      border-bottom-right-radius: 4px;
    }

    .message.assistant .message-content {
      border-bottom-left-radius: 4px;
    }

    .message-time {
      font-size: 12px;
      color: var(--secondary-text-color);
      margin-top: 4px;
    }

    .chat-input {
      padding: 16px 20px;
      border-top: 1px solid var(--divider-color);
      display: flex;
      gap: 12px;
      align-items: flex-end;
    }

    .input-container {
      flex: 1;
      position: relative;
    }

    textarea {
      width: 100%;
      min-height: 40px;
      max-height: 120px;
      padding: 12px 16px;
      border: 1px solid var(--divider-color);
      border-radius: 20px;
      background: var(--secondary-background-color);
      color: var(--primary-text-color);
      resize: none;
      font-family: inherit;
      font-size: 14px;
      outline: none;
      transition: border-color 0.2s;
    }

    textarea:focus {
      border-color: var(--accent-color);
    }

    .send-button {
      background: var(--accent-color);
      color: white;
      border: none;
      border-radius: 50%;
      width: 40px;
      height: 40px;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      transition: background-color 0.2s, transform 0.1s;
      flex-shrink: 0;
    }

    .send-button:hover {
      background: var(--accent-color);
      filter: brightness(1.1);
    }

    .send-button:active {
      transform: scale(0.95);
    }

    .send-button:disabled {
      background: var(--disabled-text-color);
      cursor: not-allowed;
      transform: none;
    }

    .sidebar {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }

    .quick-actions {
      background: var(--card-background-color);
      border-radius: 12px;
      box-shadow: var(--ha-card-box-shadow);
      border: 1px solid var(--divider-color);
      padding: 20px;
    }

    .quick-actions h3 {
      margin: 0 0 16px 0;
      font-size: 16px;
      font-weight: 500;
      color: var(--primary-text-color);
      display: flex;
      align-items: center;
    }

    .quick-actions h3 ha-icon {
      margin-right: 8px;
      color: var(--accent-color);
    }

    .action-buttons {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    .action-button {
      background: var(--primary-color);
      color: var(--text-primary-color);
      border: none;
      border-radius: 8px;
      padding: 12px 16px;
      cursor: pointer;
      font-size: 14px;
      font-weight: 500;
      transition: all 0.2s;
      display: flex;
      align-items: center;
      justify-content: flex-start;
      gap: 8px;
    }

    .action-button:hover {
      background: var(--primary-color);
      filter: brightness(1.1);
      transform: translateY(-1px);
    }

    .action-button.analyze {
      background: var(--info-color, #2196F3);
    }

    .action-button.optimize {
      background: var(--success-color, #4CAF50);
    }

    .action-button.security {
      background: var(--warning-color, #FF9800);
    }

    .loading {
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 20px;
      color: var(--secondary-text-color);
    }

    .typing-indicator {
      display: flex;
      align-items: center;
      gap: 4px;
      padding: 16px;
      color: var(--secondary-text-color);
      font-style: italic;
    }

    .typing-dots {
      display: flex;
      gap: 2px;
    }

    .typing-dot {
      width: 4px;
      height: 4px;
      border-radius: 50%;
      background: var(--secondary-text-color);
      animation: typing 1.4s infinite;
    }

    .typing-dot:nth-child(2) { animation-delay: 0.2s; }
    .typing-dot:nth-child(3) { animation-delay: 0.4s; }

    @keyframes typing {
      0%, 60%, 100% { transform: translateY(0); opacity: 0.4; }
      30% { transform: translateY(-8px); opacity: 1; }
    }

    @keyframes slideIn {
      from {
        opacity: 0;
        transform: translateY(10px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }
  `;

  static properties = {
    hass: { type: Object },
    conversations: { type: Array },
    isLoading: { type: Boolean },
    stats: { type: Object }
  };

  constructor() {
    super();
    this.conversations = [];
    this.isLoading = false;
    this.stats = {
      totalConversations: 0,
      todayConversations: 0,
      totalSuggestions: 0,
      lastActivity: null
    };
  }

  connectedCallback() {
    super.connectedCallback();
    this.loadStats();
    this.setupEventListeners();
  }

  setupEventListeners() {
    if (!this.hass) return;

    this.hass.connection.subscribeEvents((event) => {
      if (event.event_type === 'openai_assistant_response') {
        this.handleNewMessage(event.data);
      }
    });
  }

  loadStats() {
    // Load stats from Home Assistant sensors
    const statusSensor = this.hass?.states['sensor.openai_assistant_status'];
    if (statusSensor) {
      const attrs = statusSensor.attributes;
      this.stats = {
        totalConversations: attrs.total_conversations || 0,
        todayConversations: attrs.conversations_today || 0,
        totalSuggestions: attrs.total_suggestions || 0,
        lastActivity: attrs.last_interaction
      };
    }
    this.requestUpdate();
  }

  handleNewMessage(data) {
    this.conversations = [...this.conversations, {
      id: Date.now(),
      user: data.message,
      assistant: data.response,
      timestamp: data.timestamp
    }];
    this.isLoading = false;
    this.loadStats();
    this.requestUpdate();
    
    // Scroll to bottom
    setTimeout(() => {
      const chatMessages = this.shadowRoot.querySelector('.chat-messages');
      if (chatMessages) {
        chatMessages.scrollTop = chatMessages.scrollHeight;
      }
    }, 100);
  }

  async sendMessage() {
    const textarea = this.shadowRoot.querySelector('textarea');
    const message = textarea.value.trim();
    
    if (!message || this.isLoading) return;

    this.isLoading = true;
    textarea.value = '';
    this.requestUpdate();

    try {
      await this.hass.callService('openai_assistant', 'ask_chatgpt', {
        message: message,
        include_context: true
      });
    } catch (error) {
      console.error('Error sending message:', error);
      this.isLoading = false;
    }
  }

  async quickAction(action) {
    if (this.isLoading) return;

    this.isLoading = true;
    this.requestUpdate();

    const messages = {
      analyze: "Analyse complète de mon système Home Assistant avec recommandations d'optimisation",
      optimize: "Quelles sont les meilleures optimisations que je peux appliquer à mon installation ?",
      security: "Vérifie la sécurité de ma configuration Home Assistant et propose des améliorations"
    };

    try {
      await this.hass.callService('openai_assistant', 'ask_chatgpt', {
        message: messages[action],
        include_context: true
      });
    } catch (error) {
      console.error('Error with quick action:', error);
      this.isLoading = false;
    }
  }

  handleKeyDown(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      this.sendMessage();
    }
  }

  formatTime(timestamp) {
    if (!timestamp) return '';
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }

  render() {
    return html`
      <div class="container">
        <div class="header">
          <div class="title">
            <ha-icon icon="mdi:robot"></ha-icon>
            OpenAI Assistant
          </div>
        </div>

        <div class="stats">
          <div class="stat-card">
            <div class="stat-title">
              <ha-icon icon="mdi:chat"></ha-icon>
              Conversations aujourd'hui
            </div>
            <div class="stat-value">${this.stats.todayConversations}</div>
          </div>
          <div class="stat-card">
            <div class="stat-title">
              <ha-icon icon="mdi:chat-processing"></ha-icon>
              Total conversations
            </div>
            <div class="stat-value">${this.stats.totalConversations}</div>
          </div>
          <div class="stat-card">
            <div class="stat-title">
              <ha-icon icon="mdi:lightbulb-on"></ha-icon>
              Suggestions
            </div>
            <div class="stat-value">${this.stats.totalSuggestions}</div>
          </div>
        </div>

        <div class="main-content">
          <div class="chat-container">
            <div class="chat-header">
              <div class="chat-title">
                <ha-icon icon="mdi:chat"></ha-icon>
                Chat avec ChatGPT
              </div>
            </div>
            
            <div class="chat-messages">
              ${this.conversations.length === 0 ? html`
                <div class="loading">
                  <ha-icon icon="mdi:robot"></ha-icon>
                  <span style="margin-left: 8px;">Prêt à analyser votre Home Assistant !</span>
                </div>
              ` : ''}
              
              ${this.conversations.map(conv => html`
                <div class="message user">
                  <div class="message-avatar">
                    <ha-icon icon="mdi:account"></ha-icon>
                  </div>
                  <div>
                    <div class="message-content">${conv.user}</div>
                    <div class="message-time">${this.formatTime(conv.timestamp)}</div>
                  </div>
                </div>
                <div class="message assistant">
                  <div class="message-avatar">
                    <ha-icon icon="mdi:robot"></ha-icon>
                  </div>
                  <div>
                    <div class="message-content">${conv.assistant}</div>
                    <div class="message-time">${this.formatTime(conv.timestamp)}</div>
                  </div>
                </div>
              `)}
              
              ${this.isLoading ? html`
                <div class="typing-indicator">
                  <ha-icon icon="mdi:robot"></ha-icon>
                  <span>ChatGPT réfléchit</span>
                  <div class="typing-dots">
                    <div class="typing-dot"></div>
                    <div class="typing-dot"></div>
                    <div class="typing-dot"></div>
                  </div>
                </div>
              ` : ''}
            </div>
            
            <div class="chat-input">
              <div class="input-container">
                <textarea 
                  placeholder="Posez une question sur votre Home Assistant..."
                  @keydown=${this.handleKeyDown}
                ></textarea>
              </div>
              <button 
                class="send-button" 
                @click=${this.sendMessage}
                ?disabled=${this.isLoading}
              >
                <ha-icon icon="mdi:send"></ha-icon>
              </button>
            </div>
          </div>

          <div class="sidebar">
            <div class="quick-actions">
              <h3>
                <ha-icon icon="mdi:lightning-bolt"></ha-icon>
                Actions rapides
              </h3>
              <div class="action-buttons">
                <button class="action-button analyze" @click=${() => this.quickAction('analyze')}>
                  <ha-icon icon="mdi:magnify-scan"></ha-icon>
                  Analyser le système
                </button>
                <button class="action-button optimize" @click=${() => this.quickAction('optimize')}>
                  <ha-icon icon="mdi:tune"></ha-icon>
                  Optimiser
                </button>
                <button class="action-button security" @click=${() => this.quickAction('security')}>
                  <ha-icon icon="mdi:shield-check"></ha-icon>
                  Vérifier sécurité
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
  }
}

customElements.define('openai-assistant-panel', OpenAIAssistantPanel);
