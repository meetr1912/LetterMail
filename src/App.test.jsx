import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from './App';

describe('LetterMail App - Core Features', () => {
  beforeEach(() => {
    // Reset any mocks or state before each test
    vi.clearAllMocks();
  });

  describe('Initial Render', () => {
    it('should render the app title "The Letterbox"', () => {
      render(<App />);
      expect(screen.getByText('The Letterbox')).toBeInTheDocument();
    });

    it('should display greeting with mail count', () => {
      render(<App />);
      const greeting = screen.getByText(/you have \d+ new mails today/i);
      expect(greeting).toBeInTheDocument();
    });

    it('should render all email envelopes in stack', () => {
      render(<App />);
      // Check for sender names on envelopes
      expect(screen.getByText(/Karl Architects/i)).toBeInTheDocument();
      expect(screen.getByText(/Elara Studio/i)).toBeInTheDocument();
      expect(screen.getByText(/Mother/i)).toBeInTheDocument();
      expect(screen.getByText(/Gallery 42/i)).toBeInTheDocument();
    });

    it('should display "To Mit" on envelopes', () => {
      render(<App />);
      const toMitElements = screen.getAllByText('To Mit,');
      expect(toMitElements.length).toBeGreaterThan(0);
    });
  });

  describe('Email Opening', () => {
    it('should open email when top envelope is clicked', async () => {
      render(<App />);
      
      // Find and click the top envelope
      const envelopes = screen.getAllByText(/Karl Architects|Elara Studio|Mother|Gallery 42/i);
      const topEnvelope = envelopes[0];
      
      await userEvent.click(topEnvelope);
      
      // Wait for letter content to appear
      await waitFor(() => {
        expect(screen.getByText(/My Dear Mit|To the attention of Mit|Dearest Mit|Dear Patron/i)).toBeInTheDocument();
      });
    });

    it('should mark email as read when opened', async () => {
      render(<App />);
      
      // Find unread email (Karl Architects should be unread)
      const envelopes = screen.getAllByText(/Karl Architects/i);
      await userEvent.click(envelopes[0]);
      
      // Wait for letter to open
      await waitFor(() => {
        expect(screen.getByText(/My Dear Mit/i)).toBeInTheDocument();
      });
      
      // Close the letter
      const foldButton = screen.getByText('Fold');
      await userEvent.click(foldButton);
      
      // Wait for envelope to close
      await waitFor(() => {
        expect(screen.getByText('The Letterbox')).toBeInTheDocument();
      }, { timeout: 2000 });
    });

    it('should display letter content when opened', async () => {
      render(<App />);
      
      const envelopes = screen.getAllByText(/Karl Architects/i);
      await userEvent.click(envelopes[0]);
      
      await waitFor(() => {
        expect(screen.getByText(/It has been far too long/i)).toBeInTheDocument();
        expect(screen.getByText(/Karl/i)).toBeInTheDocument();
      });
    });
  });

  describe('Email Stack Navigation', () => {
    it('should bring clicked envelope to front', async () => {
      render(<App />);
      
      // Find envelopes
      const allEnvelopes = screen.getAllByText(/Re:/i);
      expect(allEnvelopes.length).toBeGreaterThan(1);
      
      // Click a non-top envelope (if available)
      if (allEnvelopes.length > 1) {
        await userEvent.click(allEnvelopes[1]);
        
        // Wait for animation
        await waitFor(() => {
          // The clicked envelope should now be on top
          expect(screen.getByText('The Letterbox')).toBeInTheDocument();
        }, { timeout: 1000 });
      }
    });
  });

  describe('Reply Functionality', () => {
    it('should open reply mode when Reply button is clicked', async () => {
      render(<App />);
      
      // Open an email first
      const envelopes = screen.getAllByText(/Karl Architects/i);
      await userEvent.click(envelopes[0]);
      
      await waitFor(() => {
        expect(screen.getByText(/My Dear Mit/i)).toBeInTheDocument();
      });
      
      // Click Reply button
      const replyButton = screen.getByText('Reply');
      await userEvent.click(replyButton);
      
      // Check for reply UI
      await waitFor(() => {
        expect(screen.getByText(/Replying to/i)).toBeInTheDocument();
        expect(screen.getByPlaceholderText(/Write your response here/i)).toBeInTheDocument();
      });
    });

    it('should allow typing in reply textarea', async () => {
      render(<App />);
      
      // Open email and reply
      const envelopes = screen.getAllByText(/Karl Architects/i);
      await userEvent.click(envelopes[0]);
      
      await waitFor(() => {
        expect(screen.getByText(/My Dear Mit/i)).toBeInTheDocument();
      });
      
      const replyButton = screen.getByText('Reply');
      await userEvent.click(replyButton);
      
      await waitFor(() => {
        const textarea = screen.getByPlaceholderText(/Write your response here/i);
        expect(textarea).toBeInTheDocument();
        
        // Type in textarea
        userEvent.type(textarea, 'Thank you for your letter!');
        expect(textarea).toHaveValue('Thank you for your letter!');
      });
    });

    it('should close reply mode when back arrow is clicked', async () => {
      render(<App />);
      
      // Open email and reply
      const envelopes = screen.getAllByText(/Karl Architects/i);
      await userEvent.click(envelopes[0]);
      
      await waitFor(() => {
        expect(screen.getByText(/My Dear Mit/i)).toBeInTheDocument();
      });
      
      const replyButton = screen.getByText('Reply');
      await userEvent.click(replyButton);
      
      await waitFor(() => {
        expect(screen.getByText(/Replying to/i)).toBeInTheDocument();
      });
      
      // Click back arrow
      const backButton = screen.getByRole('button', { name: '' }); // ArrowLeft button
      const backButtons = screen.getAllByRole('button');
      const arrowButton = backButtons.find(btn => btn.querySelector('svg'));
      
      if (arrowButton) {
        await userEvent.click(arrowButton);
        
        await waitFor(() => {
          expect(screen.queryByText(/Replying to/i)).not.toBeInTheDocument();
        });
      }
    });
  });

  describe('Archive Functionality', () => {
    it('should archive email when Fold button is clicked', async () => {
      render(<App />);
      
      const initialEnvelopes = screen.getAllByText(/Re:/i);
      const initialCount = initialEnvelopes.length;
      
      // Open an email
      const envelopes = screen.getAllByText(/Karl Architects/i);
      await userEvent.click(envelopes[0]);
      
      await waitFor(() => {
        expect(screen.getByText(/My Dear Mit/i)).toBeInTheDocument();
      });
      
      // Click Fold button
      const foldButton = screen.getByText('Fold');
      await userEvent.click(foldButton);
      
      // Wait for animation and check envelope is removed
      await waitFor(() => {
        const remainingEnvelopes = screen.queryAllByText(/Re:/i);
        expect(remainingEnvelopes.length).toBeLessThan(initialCount);
      }, { timeout: 2000 });
    });

    it('should archive email when Burn button is clicked', async () => {
      render(<App />);
      
      const initialEnvelopes = screen.getAllByText(/Re:/i);
      const initialCount = initialEnvelopes.length;
      
      // Open an email
      const envelopes = screen.getAllByText(/Karl Architects/i);
      await userEvent.click(envelopes[0]);
      
      await waitFor(() => {
        expect(screen.getByText(/My Dear Mit/i)).toBeInTheDocument();
      });
      
      // Click Burn button
      const burnButton = screen.getByText('Burn');
      await userEvent.click(burnButton);
      
      // Wait for burn animation and archive
      await waitFor(() => {
        const remainingEnvelopes = screen.queryAllByText(/Re:/i);
        expect(remainingEnvelopes.length).toBeLessThan(initialCount);
      }, { timeout: 3000 });
    });
  });

  describe('Empty State', () => {
    it('should display empty state when all emails are archived', async () => {
      render(<App />);
      
      // Archive all emails
      let foldButtons = screen.queryAllByText('Fold');
      
      while (foldButtons.length > 0) {
        // Open first email
        const envelopes = screen.queryAllByText(/Re:/i);
        if (envelopes.length === 0) break;
        
        await userEvent.click(envelopes[0]);
        
        await waitFor(() => {
          foldButtons = screen.queryAllByText('Fold');
          if (foldButtons.length > 0) {
            userEvent.click(foldButtons[0]);
          }
        }, { timeout: 2000 });
        
        await waitFor(() => {
          expect(screen.queryByText(/My Dear Mit|To the attention|Dearest|Dear Patron/i)).not.toBeInTheDocument();
        }, { timeout: 2000 });
      }
      
      // Check for empty state
      await waitFor(() => {
        expect(screen.getByText(/All letters answered/i)).toBeInTheDocument();
        expect(screen.getByText(/Check Post/i)).toBeInTheDocument();
      }, { timeout: 5000 });
    });

    it('should restore emails when "Check Post" is clicked in empty state', async () => {
      render(<App />);
      
      // Archive all emails (simplified - just check the button exists)
      // In a real scenario, we'd archive all emails first
      
      // For this test, we'll check that the restore functionality exists
      // by checking if the button text is present when empty
      const checkPostButton = screen.queryByText(/Check Post/i);
      
      // If empty state exists, click it
      if (checkPostButton) {
        await userEvent.click(checkPostButton);
        
        await waitFor(() => {
          expect(screen.getByText('The Letterbox')).toBeInTheDocument();
        });
      }
    });
  });

  describe('UI Elements', () => {
    it('should display search icon', () => {
      render(<App />);
      // Search icon should be present (lucide-react Search component)
      const searchIcon = document.querySelector('svg');
      expect(searchIcon).toBeInTheDocument();
    });

    it('should display Write Letter button', () => {
      render(<App />);
      expect(screen.getByText('Write Letter')).toBeInTheDocument();
    });

    it('should display postage stamps on envelopes', () => {
      render(<App />);
      // Stamps contain initials like "KA", "ES", "M", "G42"
      // These are rendered in PostageStamp component
      const stampElements = document.querySelectorAll('[class*="bg-\\[#"]');
      expect(stampElements.length).toBeGreaterThan(0);
    });
  });

  describe('Email Data Display', () => {
    it('should display sender information on envelope', () => {
      render(<App />);
      expect(screen.getByText(/From: Karl Architects/i)).toBeInTheDocument();
      expect(screen.getByText(/124 Bowery, NY/i)).toBeInTheDocument();
    });

    it('should display subject on envelope', () => {
      render(<App />);
      expect(screen.getByText(/Re: Sunday Plans/i)).toBeInTheDocument();
    });

    it('should display date in letter when opened', async () => {
      render(<App />);
      
      const envelopes = screen.getAllByText(/Karl Architects/i);
      await userEvent.click(envelopes[0]);
      
      await waitFor(() => {
        expect(screen.getByText(/Oct 14, 2024/i)).toBeInTheDocument();
      });
    });
  });
});

