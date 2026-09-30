import React, { useState } from 'react';
import { MessageCircle, X, Send, Sparkles, PhoneCall } from 'lucide-react';
import { playPopSound, playPowSound } from '../utils/sound';

export const WhatsAppButton = ({ isOpenOverride, onCloseOverride }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');

  const activeOpen = isOpenOverride !== undefined ? isOpenOverride : isOpen;
  const handleToggle = () => {
    playPopSound();
    if (onCloseOverride && isOpenOverride) {
      onCloseOverride();
    } else {
      setIsOpen(!isOpen);
    }
  };

  const handleSendWhatsApp = (customText) => {
    playPowSound();
    const textToSend = customText || message || "Hi Chef Bommi! I want to order a custom comic cake!";
    const url = `https://wa.me/919884426664?text=${encodeURIComponent(textToSend)}`;
    window.open(url, '_blank');
    setMessage('');
    if (onCloseOverride) onCloseOverride();
    else setIsOpen(false);
  };

  const QUICK_QUESTIONS = [
    '🎂 Can I customize a 3D Superhero Fondant Cake?',
    '⚡ Can I get delivery in under 2 hours?',
    '📸 How do I send my photo for edible printing?',
    '🌱 Are all cakes 100% pure eggless vegetarian?'
  ];

  return (
    <div className="fixed bottom-5 right-5 z-40 flex flex-col items-end">
      
      {/* Interactive Comic Chat Modal Popover */}
      {activeOpen && (
        <div className="mb-3 w-80 sm:w-96 bg-white border-4 border-black rounded-3xl shadow-comic-xl overflow-hidden animate-pop">
          
          {/* Header */}
          <div className="bg-[#25D366] text-black border-b-4 border-black p-3.5 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 bg-white border-2 border-black rounded-full flex items-center justify-center text-xl shadow-comic-sm">
                👨‍🍳
              </div>
              <div>
                <h4 className="font-comic text-lg text-black leading-none flex items-center gap-1">
                  CHEF BOMMI LIVE <span className="w-2 h-2 rounded-full bg-black animate-ping" />
                </h4>
                <span className="text-[11px] font-bold text-black/80">
                  Online • Replies in &lt; 2 minutes
                </span>
              </div>
            </div>

            <button
              onClick={handleToggle}
              className="w-7 h-7 bg-white hover:bg-black hover:text-white border-2 border-black rounded-full flex items-center justify-center font-bold"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Chat Body */}
          <div className="p-4 bg-comic-cream/60 space-y-3 max-h-80 overflow-y-auto">
            {/* Chef Bommi greeting bubble */}
            <div className="bg-white border-2 border-black rounded-2xl p-3 shadow-comic-sm text-xs font-bold space-y-1">
              <span className="font-comic text-sm text-comic-red block">
                POW! Hey there, Super Baker! 👋
              </span>
              <p className="text-gray-700">
                Need help picking the best flavor, customizing a tiered cake, or placing an express order? Tap below or message us!
              </p>
            </div>

            {/* Quick Prompts */}
            <div className="space-y-1.5 pt-1">
              <span className="text-[10px] font-comic text-gray-500 uppercase tracking-wider block">
                POPULAR QUICK QUESTIONS:
              </span>
              {QUICK_QUESTIONS.map((q, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSendWhatsApp(q)}
                  className="w-full text-left text-[11px] font-bold bg-white hover:bg-comic-yellow border border-black rounded-lg p-2 transition-colors flex items-center justify-between group"
                >
                  <span className="truncate">{q}</span>
                  <span className="text-comic-red font-comic group-hover:translate-x-0.5 transition-transform">→</span>
                </button>
              ))}
            </div>
          </div>

          {/* Text Input Footer */}
          <div className="p-3 bg-white border-t-3 border-black flex gap-2">
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Ask Chef Bommi anything..."
              onKeyDown={(e) => e.key === 'Enter' && handleSendWhatsApp()}
              className="flex-1 px-3 py-1.5 bg-gray-50 border-2 border-black rounded-xl text-xs font-bold"
            />
            <button
              onClick={() => handleSendWhatsApp()}
              className="comic-btn bg-[#25D366] text-black px-3 py-1.5 rounded-xl text-xs font-comic flex items-center gap-1"
            >
              <Send className="w-3.5 h-3.5" />
              <span>SEND</span>
            </button>
          </div>

        </div>
      )}

      {/* Main Floating Trigger Button with Comic Speech Bubble */}
      <div className="flex items-center gap-2">
        {!activeOpen && (
          <div 
            onClick={handleToggle}
            className="hidden sm:block cursor-pointer bg-white border-3 border-black rounded-2xl px-3 py-1.5 text-xs font-comic tracking-wide shadow-comic transform hover:scale-105 transition-transform"
          >
            💬 NEED A SUPER-CAKE? CHAT ON WHATSAPP!
          </div>
        )}

        <button
          onClick={handleToggle}
          aria-label="WhatsApp Support"
          className="w-14 h-14 bg-[#25D366] hover:bg-[#20bd5a] text-black border-4 border-black rounded-full shadow-comic-lg flex items-center justify-center transition-transform transform hover:-translate-y-1 active:translate-y-0.5"
        >
          <MessageCircle className="w-7 h-7 text-black fill-black" />
          <span className="absolute -top-1 -right-1 bg-comic-red text-white text-[10px] font-comic px-1.5 py-0.2 rounded-full border border-black">
            LIVE!
          </span>
        </button>
      </div>

    </div>
  );
};
