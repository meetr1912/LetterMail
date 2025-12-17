/**
 * Gmail API Service
 * Handles authentication and fetching emails from Gmail API
 */

const GMAIL_API_BASE = 'https://gmail.googleapis.com/gmail/v1';
const SCOPES = 'https://www.googleapis.com/auth/gmail.readonly';

class GmailService {
  constructor() {
    this.tokenClient = null;
    this.accessToken = null;
    this.isInitialized = false;
  }

  /**
   * Initialize Google Identity Services
   */
  async initialize() {
    return new Promise((resolve, reject) => {
      if (window.google && window.google.accounts) {
        this.isInitialized = true;
        resolve();
        return;
      }

      // Load Google Identity Services script
      const script = document.createElement('script');
      script.src = 'https://accounts.google.com/gsi/client';
      script.async = true;
      script.defer = true;
      script.onload = () => {
        this.isInitialized = true;
        resolve();
      };
      script.onerror = () => reject(new Error('Failed to load Google Identity Services'));
      document.head.appendChild(script);
    });
  }

  /**
   * Initialize OAuth token client
   */
  async initTokenClient(clientId) {
    if (!this.isInitialized) {
      await this.initialize();
    }

    return new Promise((resolve) => {
      this.tokenClient = window.google.accounts.oauth2.initTokenClient({
        client_id: clientId,
        scope: SCOPES,
        callback: (response) => {
          if (response.error) {
            console.error('OAuth error:', response.error);
            if (this._authReject) {
              this._authReject(new Error(response.error));
              this._authResolve = null;
              this._authReject = null;
            }
            return;
          }
          this.accessToken = response.access_token;
          if (this._authResolve) {
            this._authResolve(this.accessToken);
            this._authResolve = null;
            this._authReject = null;
          }
        },
      });
      resolve();
    });
  }

  /**
   * Request access token
   */
  async requestAccess() {
    if (!this.tokenClient) {
      throw new Error('Token client not initialized. Call initTokenClient first.');
    }

    return new Promise((resolve, reject) => {
      // Store resolve/reject to be called from callback
      this._authResolve = resolve;
      this._authReject = reject;
      
      // Request token - callback will be called by initTokenClient
      this.tokenClient.requestAccessToken({ prompt: 'consent' });
      
      // Timeout after 30 seconds
      setTimeout(() => {
        if (!this.accessToken && this._authReject) {
          this._authReject(new Error('Authentication timeout'));
          this._authResolve = null;
          this._authReject = null;
        }
      }, 30000);
    });
  }

  /**
   * Revoke access token
   */
  revokeAccess() {
    if (this.accessToken && window.google?.accounts?.oauth2) {
      window.google.accounts.oauth2.revoke(this.accessToken, () => {
        this.accessToken = null;
      });
    }
  }

  /**
   * Check if user is authenticated
   */
  isAuthenticated() {
    return !!this.accessToken;
  }

  /**
   * Make authenticated API request
   */
  async apiRequest(endpoint, options = {}) {
    if (!this.accessToken) {
      throw new Error('Not authenticated. Please authenticate first.');
    }

    const response = await fetch(`${GMAIL_API_BASE}${endpoint}`, {
      ...options,
      headers: {
        'Authorization': `Bearer ${this.accessToken}`,
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    if (!response.ok) {
      if (response.status === 401) {
        // Token expired, clear it
        this.accessToken = null;
        throw new Error('Authentication expired. Please sign in again.');
      }
      throw new Error(`Gmail API error: ${response.status} ${response.statusText}`);
    }

    return response.json();
  }

  /**
   * Decode base64 email content
   */
  decodeBase64(data) {
    try {
      // Replace URL-safe base64 characters
      const base64 = data.replace(/-/g, '+').replace(/_/g, '/');
      // Add padding if needed
      const padded = base64 + '='.repeat((4 - (base64.length % 4)) % 4);
      return decodeURIComponent(
        atob(padded)
          .split('')
          .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      );
    } catch (error) {
      console.error('Error decoding base64:', error);
      return '';
    }
  }

  /**
   * Extract email headers
   */
  getHeader(headers, name) {
    const header = headers.find((h) => h.name.toLowerCase() === name.toLowerCase());
    return header ? header.value : '';
  }

  /**
   * Parse email body from message parts
   */
  parseEmailBody(message) {
    let body = '';
    
    const getBodyFromPart = (part) => {
      if (part.body?.data) {
        const decoded = this.decodeBase64(part.body.data);
        if (part.mimeType === 'text/plain' || part.mimeType === 'text/html') {
          return decoded;
        }
      }
      
      if (part.parts) {
        for (const subPart of part.parts) {
          const result = getBodyFromPart(subPart);
          if (result) return result;
        }
      }
      
      return '';
    };

    if (message.payload) {
      body = getBodyFromPart(message.payload);
      
      // Strip HTML tags if it's HTML
      if (body.includes('<')) {
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = body;
        body = tempDiv.textContent || tempDiv.innerText || '';
      }
    }

    return body.trim();
  }

  /**
   * Transform Gmail message to app format
   */
  transformGmailMessage(message, index) {
    const headers = message.payload.headers;
    const from = this.getHeader(headers, 'From');
    const subject = this.getHeader(headers, 'Subject') || '(No Subject)';
    const date = this.getHeader(headers, 'Date');
    const messageId = message.id;

    // Parse sender name and email
    const fromMatch = from.match(/(.*?)\s*<(.+?)>/) || from.match(/(.+)/);
    const senderName = fromMatch ? (fromMatch[1] || fromMatch[2] || 'Unknown').trim() : 'Unknown';
    const senderEmail = fromMatch && fromMatch[2] ? fromMatch[2].trim() : from.trim();

    // Generate initials
    const initials = senderName
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2) || '??';

    // Generate stamp color based on sender
    const colors = [
      'bg-[#8B4513]',
      'bg-[#2F4F4F]',
      'bg-[#556B2F]',
      'bg-[#800000]',
      'bg-[#4B0082]',
      'bg-[#006400]',
      'bg-[#8B0000]',
      'bg-[#2E8B57]',
    ];
    const stampColor = colors[Math.abs(senderEmail.split('').reduce((a, b) => a + b.charCodeAt(0), 0)) % colors.length];

    // Parse date
    let formattedDate = 'Today';
    if (date) {
      try {
        const dateObj = new Date(date);
        const now = new Date();
        const diffDays = Math.floor((now - dateObj) / (1000 * 60 * 60 * 24));
        
        if (diffDays === 0) {
          formattedDate = 'Today';
        } else if (diffDays === 1) {
          formattedDate = 'Yesterday';
        } else if (diffDays < 7) {
          formattedDate = dateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        } else {
          formattedDate = dateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        }
      } catch (e) {
        formattedDate = 'Recent';
      }
    }

    // Parse body
    const body = this.parseEmailBody(message);
    const preview = body.substring(0, 50).replace(/\n/g, ' ') + '...';

    // Extract signature (last paragraph or line)
    const bodyLines = body.split('\n').filter((l) => l.trim());
    const signature = bodyLines[bodyLines.length - 1]?.trim() || senderName;

    return {
      id: messageId || `gmail-${index}`,
      read: message.labelIds?.includes('UNREAD') === false,
      sender: senderName,
      name: senderName,
      address: senderEmail,
      initials,
      stampColor,
      subject,
      date: formattedDate,
      preview,
      body,
      signature,
      gmailMessageId: messageId,
    };
  }

  /**
   * Fetch list of emails
   */
  async fetchEmails(maxResults = 10) {
    try {
      // First, get list of message IDs
      const listResponse = await this.apiRequest(
        `/users/me/messages?maxResults=${maxResults}&q=in:inbox`
      );

      if (!listResponse.messages || listResponse.messages.length === 0) {
        return [];
      }

      // Fetch full message details for each email
      const messagePromises = listResponse.messages.map((msg) =>
        this.apiRequest(`/users/me/messages/${msg.id}?format=full`)
      );

      const messages = await Promise.all(messagePromises);

      // Transform messages to app format
      return messages.map((msg, index) => this.transformGmailMessage(msg, index));
    } catch (error) {
      console.error('Error fetching emails:', error);
      throw error;
    }
  }

  /**
   * Mark email as read
   */
  async markAsRead(messageId) {
    try {
      await this.apiRequest(`/users/me/messages/${messageId}/modify`, {
        method: 'POST',
        body: JSON.stringify({
          removeLabelIds: ['UNREAD'],
        }),
      });
    } catch (error) {
      console.error('Error marking email as read:', error);
      throw error;
    }
  }
}

export default new GmailService();
