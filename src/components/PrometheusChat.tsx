import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MessageSquare,
  X,
  Send,
  Sparkles,
  Bot,
  Loader2,
  Mic,
  MicOff,
  Globe,
  Volume2,
  VolumeX,
  Mail,
  Phone,
  ExternalLink,
  Github,
  Linkedin,
  Youtube,
  Calendar
} from 'lucide-react';

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  card?: 'contact' | 'git' | 'collab' | 'youtube' | 'none';
}

interface LanguageOption {
  code: string;
  name: string;
  flag: string;
}

const languages: LanguageOption[] = [
  { code: 'en-US', name: 'English', flag: '🇺🇸' },
  { code: 'te-IN', name: 'Telugu', flag: '🇮🇳' },
  { code: 'hi-IN', name: 'Hindi', flag: '🇮🇳' },
  { code: 'es-ES', name: 'Spanish', flag: '🇪🇸' },
  { code: 'de-DE', name: 'German', flag: '🇩🇪' },
];

const API_BASE = 'https://portfolio-likith.onrender.com';

declare global {
  interface Window {
    SpeechRecognition?: any;
    webkitSpeechRecognition?: any;
  }
}

export default function PrometheusChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: 'assistant',
      content: "Hi! I'm Prometheus, Likith's AI Assistant. Ask me anything about his projects, technical expertise, or collaborations. You can speak or type in English, Telugu, Hindi, Spanish, or German!",
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [selectedLang, setSelectedLang] = useState('en-US');
  const [isListening, setIsListening] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [showLangMenu, setShowLangMenu] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);

  // Initialize Speech Recognition
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = selectedLang;

      recognition.onstart = () => {
        setIsListening(true);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInputValue((prev) => (prev ? prev + ' ' + transcript : transcript));
      };

      recognition.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
      };

      recognitionRef.current = recognition;
    }
  }, [selectedLang]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping, isListening]);

  const toggleListening = () => {
    if (!recognitionRef.current) {
      alert('Speech Recognition is not supported in this browser. Try Chrome or Safari.');
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
    } else {
      try {
        recognitionRef.current.start();
      } catch (err) {
        console.error(err);
      }
    }
  };

  // Web Speech Synthesis Readback
  const speakText = (text: string, langCode: string) => {
    if (!('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();

    // Strip markdown formatting symbols and card tokens
    const cleanText = text
      .replace(/\[\[CARD:[^\]]*\]\]/g, '')
      .replace(/[*_#`\-]/g, '')
      .trim();

    if (!cleanText) return;

    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.lang = langCode;

    // Dynamically retrieve matching voices for accuracy
    const voices = window.speechSynthesis.getVoices();
    let voice = voices.find((v) => v.lang === langCode);
    if (!voice) {
      const primaryLang = langCode.split('-')[0];
      voice = voices.find((v) => v.lang.startsWith(primaryLang));
    }

    if (voice) {
      utterance.voice = voice;
    }

    window.speechSynthesis.speak(utterance);
  };

  const submitMessage = async (textToSend: string) => {
    if (!textToSend.trim() || isTyping) return;

    const userMessage = textToSend.trim();
    setInputValue('');
    setMessages((prev) => [...prev, { role: 'user', content: userMessage }]);
    setIsTyping(true);

    // Cancel speech when user communicates
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }

    try {
      const history = messages
        .filter((_, idx) => idx > 0)
        .map((msg) => ({
          role: msg.role === 'user' ? 'user' : 'assistant',
          content: msg.content,
        }));

      const response = await fetch(`${API_BASE}/api/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: userMessage,
          history: history,
          language: selectedLang,
        }),
      });

      if (!response.ok) {
        throw new Error('Network error');
      }

      setMessages((prev) => [...prev, { role: 'assistant', content: '' }]);

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      let assistantResponse = '';
      let accumulatedRawText = '';

      if (reader) {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const chunk = decoder.decode(value, { stream: true });
          accumulatedRawText += chunk;

          let cleanContent = accumulatedRawText;
          let detectedCard = undefined;

          if (accumulatedRawText.includes('[[CARD:')) {
            const parts = accumulatedRawText.split('[[CARD:');
            cleanContent = parts[0];
            const cardPart = parts[1].replace(']]', '').trim();
            if (cardPart && cardPart !== 'none') {
              detectedCard = cardPart;
            }
          }

          assistantResponse = cleanContent;

          setMessages((prev) => {
            const updated = [...prev];
            const lastIdx = updated.length - 1;
            if (updated[lastIdx].role === 'assistant') {
              updated[lastIdx] = {
                ...updated[lastIdx],
                content: cleanContent,
                card: detectedCard as any
              };
            }
            return updated;
          });
        }
      }

      // Play audio if unmuted
      if (!isMuted && assistantResponse) {
        speakText(assistantResponse, selectedLang);
      }
    } catch (err) {
      console.error('Chat failed:', err);
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: 'Sorry, I am facing a connection issue right now. Please feel free to email Likith directly at likith.anumakonda@gmail.com.',
        },
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    submitMessage(inputValue);
  };

  const renderInlineStyles = (text: string) => {
    let parts: Array<{ type: 'text' | 'bold' | 'code' | 'link'; content: string; url?: string }> = [
      { type: 'text', content: text }
    ];

    // Parse inline code: `code`
    let newParts: typeof parts = [];
    parts.forEach(part => {
      if (part.type !== 'text') {
        newParts.push(part);
        return;
      }
      const splitCode = part.content.split(/(`[^`]+`)/g);
      splitCode.forEach(subStr => {
        if (subStr.startsWith('`') && subStr.endsWith('`')) {
          newParts.push({ type: 'code', content: subStr.slice(1, -1) });
        } else if (subStr) {
          newParts.push({ type: 'text', content: subStr });
        }
      });
    });
    parts = newParts;

    // Parse bold: **bold**
    newParts = [];
    parts.forEach(part => {
      if (part.type !== 'text') {
        newParts.push(part);
        return;
      }
      const splitBold = part.content.split(/(\*\*[^*]+\*\*)/g);
      splitBold.forEach(subStr => {
        if (subStr.startsWith('**') && subStr.endsWith('**')) {
          newParts.push({ type: 'bold', content: subStr.slice(2, -2) });
        } else if (subStr) {
          newParts.push({ type: 'text', content: subStr });
        }
      });
    });
    parts = newParts;

    // Parse links: [label](url)
    newParts = [];
    parts.forEach(part => {
      if (part.type !== 'text') {
        newParts.push(part);
        return;
      }
      const splitLink = part.content.split(/(\[[^\]]+\]\([^)]+\))/g);
      splitLink.forEach(subStr => {
        const linkMatch = subStr.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
        if (linkMatch) {
          newParts.push({ type: 'link', content: linkMatch[1], url: linkMatch[2] });
        } else if (subStr) {
          newParts.push({ type: 'text', content: subStr });
        }
      });
    });
    parts = newParts;

    return (
      <>
        {parts.map((part, idx) => {
          if (part.type === 'bold') {
            return (
              <span key={idx} className="font-semibold text-white tracking-wide">
                {part.content}
              </span>
            );
          }
          if (part.type === 'code') {
            return (
              <code key={idx} className="font-mono text-xs text-[#BE4C00] bg-white/5 border border-white/10 rounded px-1.5 py-0.5 mx-0.5">
                {part.content}
              </code>
            );
          }
          if (part.type === 'link') {
            return (
              <a
                key={idx}
                href={part.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#B600A8] hover:text-[#BE4C00] transition-colors underline font-medium inline-flex items-center gap-0.5"
              >
                {part.content}
                <ExternalLink size={10} className="inline animate-pulse" />
              </a>
            );
          }
          return <span key={idx}>{part.content}</span>;
        })}
      </>
    );
  };

  const renderMessageContent = (text: string) => {
    if (!text) return null;
    const lines = text.split('\n');

    return (
      <div className="flex flex-col gap-2.5 text-[#D7E2EA] font-light leading-relaxed tracking-wide text-[13.5px]">
        {lines.map((line, lineIdx) => {
          const currentLine = line.trim();
          
          if (!currentLine) {
            return <div key={lineIdx} className="h-2" />;
          }

          // Headers
          const headerMatch = currentLine.match(/^(#{1,6})\s+(.*)$/);
          if (headerMatch) {
            const level = headerMatch[1].length;
            const content = headerMatch[2];
            const sizeClass = level === 1 ? 'text-lg font-black' : level === 2 ? 'text-base font-bold' : 'text-sm font-semibold';
            return (
              <h4 key={lineIdx} className={`text-white uppercase tracking-wider mt-2 mb-1 flex items-center gap-1.5 ${sizeClass}`}>
                <span className="w-1 h-3.5 bg-gradient-to-b from-[#B600A8] to-[#BE4C00] rounded-full inline-block" />
                {renderInlineStyles(content)}
              </h4>
            );
          }

          // Bullet List Items
          if (currentLine.startsWith('- ') || currentLine.startsWith('* ')) {
            const content = currentLine.substring(2);
            return (
              <div key={lineIdx} className="flex items-start gap-2.5 pl-2 my-0.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#B600A8] mt-2 flex-shrink-0 shadow-[0_0_8px_#B600A8]" />
                <span className="flex-1">{renderInlineStyles(content)}</span>
              </div>
            );
          }

          // Numbered List Items
          const numListMatch = currentLine.match(/^(\d+)\.\s+(.*)$/);
          if (numListMatch) {
            const num = numListMatch[1];
            const content = numListMatch[2];
            return (
              <div key={lineIdx} className="flex items-start gap-2.5 pl-2 my-0.5">
                <span className="font-bold text-[#B600A8] text-xs mt-0.5 flex-shrink-0 w-4 text-right">{num}.</span>
                <span className="flex-1">{renderInlineStyles(content)}</span>
              </div>
            );
          }

          // Normal Paragraph Lines
          return (
            <p key={lineIdx} className="my-0.5">
              {renderInlineStyles(line)}
            </p>
          );
        })}
      </div>
    );
  };

  const renderCard = (cardType: string) => {
    switch (cardType) {
      case 'contact':
        return (
          <div className="p-3.5 rounded-2xl bg-black/50 border border-white/10 flex flex-col gap-2.5 shadow-lg backdrop-blur-md mt-2">
            <span className="text-[10px] text-white/40 uppercase tracking-widest font-semibold flex items-center gap-1">
              <Mail size={10} /> Contact Channels
            </span>
            <div className="flex flex-col gap-1.5 text-xs">
              <div className="flex items-center gap-2 text-white">
                <Mail size={12} className="text-[#B600A8]" />
                <a href="mailto:likith.anumakonda@gmail.com" className="hover:underline hover:text-[#B600A8] transition-colors select-all">likith.anumakonda@gmail.com</a>
              </div>
              <div className="flex items-center gap-2 text-white">
                <Phone size={12} className="text-[#BE4C00]" />
                <a href="tel:+919440113763" className="hover:underline hover:text-[#BE4C00] transition-colors">+91 9440113763</a>
              </div>
            </div>

            <div className="flex gap-2 border-t border-white/5 pt-2.5">
              <a
                href="https://linkedin.com/in/likith-naidu-anumakonda-33a347327"
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 py-1.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-[10px] uppercase font-bold text-center text-white flex items-center justify-center gap-1 transition-all"
              >
                <Linkedin size={10} /> LinkedIn
              </a>
              <a
                href="https://github.com/LIKITH-3012-MAC"
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 py-1.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-[10px] uppercase font-bold text-center text-white flex items-center justify-center gap-1 transition-all"
              >
                <Github size={10} /> GitHub
              </a>
            </div>

            <button
              onClick={() => window.dispatchEvent(new CustomEvent('open-collab-modal'))}
              className="w-full py-2 bg-gradient-to-r from-[#B600A8] to-[#BE4C00] hover:opacity-90 transition-opacity text-white rounded-xl text-[10px] font-bold uppercase tracking-wider flex items-center justify-center gap-1 cursor-pointer border border-white/10"
            >
              <Calendar size={10} /> Let's Collaborate
            </button>
          </div>
        );
      case 'collab':
        return (
          <div className="p-3.5 rounded-2xl bg-black/50 border border-white/10 flex flex-col gap-3 text-center shadow-lg backdrop-blur-md mt-2">
            <span className="text-xs text-white/95 font-semibold">Initiate Secure Collaboration Request</span>
            <p className="text-[10px] text-white/50 leading-relaxed">
              Submit your request to store details in our secure MySQL analytics database.
            </p>
            <button
              onClick={() => window.dispatchEvent(new CustomEvent('open-collab-modal'))}
              className="w-full py-2 bg-white text-black hover:bg-opacity-95 rounded-xl text-[10px] font-bold uppercase tracking-wider flex items-center justify-center gap-1 transition-colors cursor-pointer"
            >
              <Calendar size={10} /> Open Collaboration Form
            </button>
          </div>
        );
      case 'git':
        return (
          <div className="p-3.5 rounded-2xl bg-black/50 border border-white/10 flex flex-col gap-2.5 shadow-lg backdrop-blur-md mt-2">
            <span className="text-[10px] text-white/40 uppercase tracking-widest font-semibold flex items-center gap-1">
              <Github size={10} /> Git Repositories
            </span>
            <div className="flex flex-col gap-1.5">
              <a
                href="https://github.com/LIKITH-3012-MAC/my_chatbot.git"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 flex items-center justify-between text-[11px] text-white transition-all group"
              >
                <div>
                  <span className="font-bold block group-hover:text-[#B600A8] transition-colors">my_chatbot.git</span>
                  <span className="text-[9px] text-white/40">Prometheus AI V2.0 Core</span>
                </div>
                <ExternalLink size={10} className="text-white/40" />
              </a>

              <a
                href="https://github.com/LIKITH-3012-MAC/SYNAPTIX_2026_404-FOUND_TEAM.git"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 flex items-center justify-between text-[11px] text-white transition-all group"
              >
                <div>
                  <span className="font-bold block group-hover:text-[#B600A8] transition-colors">SYNAPTIX_2026_404</span>
                  <span className="text-[9px] text-white/40">ResolvIt Team Repository</span>
                </div>
                <ExternalLink size={10} className="text-white/40" />
              </a>

              <a
                href="https://github.com/LIKITH-3012-MAC"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 flex items-center justify-between text-[11px] text-white transition-all group"
              >
                <div>
                  <span className="font-bold block group-hover:text-[#B600A8] transition-colors">GitHub Profile</span>
                  <span className="text-[9px] text-white/40">@LIKITH-3012-MAC</span>
                </div>
                <ExternalLink size={10} className="text-white/40" />
              </a>
            </div>
          </div>
        );
      case 'youtube':
        return (
          <div className="p-3.5 rounded-2xl bg-black/50 border border-white/10 flex flex-col gap-2.5 shadow-lg backdrop-blur-md mt-2">
            <span className="text-[10px] text-white/40 uppercase tracking-widest font-semibold flex items-center gap-1">
              <Youtube size={10} className="text-red-500" /> Media Hub
            </span>
            <p className="text-[11px] text-white/70">
              Watch Likith's classical piano recitals and technical architecture systems.
            </p>
            <a
              href="https://youtube.com/@LIKITH_NAIDU_ANUMAKONDA"
              target="_blank"
              rel="noopener noreferrer"
              className="py-2 bg-[#FF0000] hover:bg-red-700 transition-colors text-white rounded-xl text-[10px] font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 text-center"
            >
              <Youtube size={12} /> Visit YouTube Channel
            </a>
          </div>
        );
      default:
        return null;
    }
  };

  const activeLang = languages.find((l) => l.code === selectedLang) || languages[0];

  return (
    <div className="fixed bottom-6 right-6 z-50 font-kanit">
      <style>{`
        .chat-scroll-container::-webkit-scrollbar {
          width: 4px;
        }
        .chat-scroll-container::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.01);
          border-radius: 4px;
        }
        .chat-scroll-container::-webkit-scrollbar-thumb {
          background: linear-gradient(180deg, #B600A8 0%, #BE4C00 100%);
          border-radius: 4px;
        }
        .chat-scroll-container::-webkit-scrollbar-thumb:hover {
          background: #B600A8;
        }
      `}</style>

      {/* Floating launcher button */}
      <motion.button
        onClick={() => {
          const nextOpen = !isOpen;
          setIsOpen(nextOpen);
          if (!nextOpen && 'speechSynthesis' in window) {
            window.speechSynthesis.cancel();
          }
        }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="rounded-full w-14 h-14 flex items-center justify-center text-white cursor-pointer shadow-2xl relative border border-white/20 transition-all duration-500 overflow-hidden"
        style={{
          background: 'radial-gradient(circle at 50% 0%, rgba(181, 0, 167, 0.4) 0%, rgba(24, 1, 31, 0.8) 100%)',
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
          boxShadow: isOpen
            ? 'inset 0 1px 1px rgba(255,255,255,0.2), 0 0 30px rgba(182, 0, 168, 0.6)'
            : 'inset 0 1px 1px rgba(255,255,255,0.2), 0 4px 20px rgba(0, 0, 0, 0.5), 0 0 15px rgba(182, 0, 168, 0.3)',
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-tr from-[#B600A8]/30 to-[#BE4C00]/30 opacity-0 hover:opacity-100 transition-opacity duration-500" />
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.div
              key="close"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="relative z-10"
            >
              <X size={24} />
            </motion.div>
          ) : (
            <motion.div
              key="open"
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.5, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="flex items-center justify-center relative z-10"
            >
              <MessageSquare size={24} />
            </motion.div>
          )}
        </AnimatePresence>

        {!isOpen && (
          <span className="absolute -top-1 -right-1 bg-white text-black p-1 rounded-full text-[10px] animate-pulse z-10">
            <Sparkles size={8} />
          </span>
        )}
      </motion.button>

      {/* Chat Container */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="absolute bottom-20 right-0 w-[90vw] sm:w-[390px] h-[535px] rounded-3xl border border-white/10 bg-[#060608]/75 backdrop-blur-2xl shadow-[inset_0_1px_1px_rgba(255,255,255,0.15),_0_8px_32px_rgba(0,0,0,0.6),_0_0_35px_rgba(182,0,168,0.25)] flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div
              className="px-6 py-4.5 flex items-center justify-between border-b border-white/10 relative z-10"
              style={{
                background: 'linear-gradient(90deg, rgba(24, 1, 31, 0.9) 0%, rgba(118, 33, 176, 0.4) 100%)',
              }}
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center border border-white/15 shadow-[0_0_15px_rgba(255,255,255,0.1)]">
                  <Bot size={22} className="text-[#D7E2EA]" />
                </div>
                <div className="flex flex-col">
                  <span className="font-bold text-white text-sm tracking-wide flex items-center gap-1.5 font-kanit">
                    PROMETHEUS AI
                    <Sparkles size={12} className="text-[#BE4C00] animate-spin" style={{ animationDuration: '6s' }} />
                  </span>
                  <span className="text-[10px] text-white/50 uppercase tracking-widest flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#B600A8] animate-pulse" />
                    Multilingual Agent
                  </span>
                </div>
              </div>

              {/* Controls */}
              <div className="flex items-center gap-2">
                {/* Voice Mute/Unmute toggle */}
                <button
                  type="button"
                  onClick={() => {
                    const newMute = !isMuted;
                    setIsMuted(newMute);
                    if (newMute && 'speechSynthesis' in window) {
                      window.speechSynthesis.cancel();
                    }
                  }}
                  className={`p-2 rounded-xl border transition-all duration-300 flex items-center justify-center cursor-pointer ${
                    isMuted
                      ? 'bg-white/5 border-white/10 text-white/40 hover:text-white'
                      : 'bg-[#B600A8]/20 border-[#B600A8]/40 text-white shadow-[0_0_10px_rgba(182,0,168,0.3)] animate-pulse'
                  }`}
                  title={isMuted ? "Unmute Voice Responses" : "Mute Voice Responses"}
                >
                  {isMuted ? <VolumeX size={14} /> : <Volume2 size={14} />}
                </button>

                <div className="relative">
                  <button
                    onClick={() => setShowLangMenu(!showLangMenu)}
                    className="p-2 rounded-xl bg-white/5 border border-white/10 text-white hover:bg-white/10 transition-colors flex items-center gap-1 cursor-pointer text-xs uppercase tracking-wider font-semibold"
                  >
                    <Globe size={14} className="text-[#BE4C00]" />
                    <span>{activeLang.flag}</span>
                  </button>

                  <AnimatePresence>
                    {showLangMenu && (
                      <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        className="absolute right-0 mt-2 w-32 bg-[#0C0C0E] border border-white/15 rounded-2xl overflow-hidden shadow-2xl z-30"
                      >
                        {languages.map((lang) => (
                          <button
                            key={lang.code}
                            onClick={() => {
                              setSelectedLang(lang.code);
                              setShowLangMenu(false);
                            }}
                            className={`w-full px-4 py-2.5 text-left text-xs hover:bg-white/5 transition-colors flex items-center justify-between cursor-pointer ${
                              selectedLang === lang.code ? 'text-[#B600A8] font-bold bg-[#B600A8]/5' : 'text-[#D7E2EA]'
                            }`}
                          >
                            <span>{lang.name}</span>
                            <span>{lang.flag}</span>
                          </button>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                <button
                  onClick={() => {
                    setIsOpen(false);
                    if ('speechSynthesis' in window) {
                      window.speechSynthesis.cancel();
                    }
                  }}
                  className="text-white/40 hover:text-white transition-colors cursor-pointer"
                >
                  <X size={20} />
                </button>
              </div>
            </div>

            {/* Message Area */}
            <div
              ref={scrollRef}
              className="flex-1 overflow-y-auto px-6 py-5 flex flex-col gap-4 bg-gradient-to-b from-[#060608]/50 to-[#020202]/80 chat-scroll-container"
            >
              {messages.map((msg, i) => (
                <div
                  key={i}
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed relative ${
                      msg.role === 'user'
                        ? 'bg-[#B600A8]/10 text-white border border-[#B600A8]/30 shadow-[0_0_15px_rgba(182,0,168,0.05)]'
                        : 'bg-white/5 text-[#D7E2EA] border border-white/5'
                    }`}
                  >
                    {msg.content ? (
                      renderMessageContent(msg.content)
                    ) : (
                      <span className="flex items-center gap-1.5 text-white/50">
                        <Loader2 className="animate-spin text-[#B600A8]" size={14} />
                        Generating response...
                      </span>
                    )}

                    {/* Inline Interactive Card Module */}
                    {msg.role === 'assistant' && msg.card && renderCard(msg.card)}
                  </div>
                </div>
              ))}

              {/* Suggestion Chips */}
              {messages.length === 1 && !isTyping && !isListening && (
                <div className="flex flex-col gap-2 mt-2.5 px-1">
                  <span className="text-[10px] text-white/30 uppercase tracking-widest font-semibold ml-1">Suggested Queries</span>
                  <div className="grid grid-cols-1 gap-2">
                    {[
                      { text: '🚀 Tell me about Resolvit AI', val: 'Tell me about Resolvit AI' },
                      { text: '💼 Likith\'s Tech Stack & Systems', val: 'What is Likith\'s tech stack and experience?' },
                      { text: '🤖 Prometheus AI Architecture', val: 'Tell me about the design of Prometheus AI chatbot' },
                      { text: '💬 Initiate Collaboration request', val: 'How do I collaborate with Likith?' }
                    ].map((chip) => (
                      <button
                        key={chip.val}
                        type="button"
                        onClick={() => submitMessage(chip.val)}
                        className="px-3.5 py-2.5 bg-white/5 hover:bg-[#B600A8]/15 border border-white/10 hover:border-[#B600A8]/45 text-left text-xs text-[#D7E2EA] rounded-xl hover:text-white transition-all duration-300 cursor-pointer shadow-md flex items-center justify-between group"
                      >
                        <span>{chip.text}</span>
                        <Sparkles size={11} className="opacity-0 group-hover:opacity-100 text-[#B600A8] transition-opacity" />
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {isTyping && messages[messages.length - 1].content && (
                <div className="flex justify-start">
                  <div className="bg-white/5 border border-white/5 text-[#D7E2EA] rounded-2xl px-4 py-3 text-sm flex items-center gap-1">
                    <span className="w-1.5 h-1.5 bg-white/40 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="w-1.5 h-1.5 bg-white/40 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="w-1.5 h-1.5 bg-white/40 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              )}
            </div>

            {/* Voice Listening Overlay */}
            <AnimatePresence>
              {isListening && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                  className="px-6 py-4 bg-[#18011F]/90 border-t border-[#B600A8]/30 flex flex-col items-center justify-center gap-3 relative z-10"
                >
                  <div className="flex items-center gap-1 justify-center h-8">
                    {[1, 2, 3, 4, 5, 6, 7].map((bar) => (
                      <motion.div
                        key={bar}
                        className="w-1 bg-[#B600A8] rounded-full"
                        animate={{
                          height: [8, 28, 8],
                        }}
                        transition={{
                          duration: 0.6,
                          repeat: Infinity,
                          delay: bar * 0.08,
                          ease: 'easeInOut',
                        }}
                      />
                    ))}
                  </div>
                  <span className="text-xs text-[#D7E2EA]/85 uppercase tracking-widest animate-pulse flex items-center gap-1.5 font-bold">
                    Listening ({activeLang.name})... Speak now
                  </span>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Input Form */}
            <form
              onSubmit={handleSendMessage}
              className="p-4 border-t border-white/10 bg-[#060608]/90 flex gap-2 items-center relative z-10"
            >
              {/* Mic Button */}
              <button
                type="button"
                onClick={toggleListening}
                className={`w-10 h-10 rounded-xl flex items-center justify-center border cursor-pointer flex-shrink-0 transition-all duration-300 ${
                  isListening
                    ? 'bg-red-500 border-red-600 text-white animate-pulse'
                    : 'bg-white/5 border-white/10 text-white/50 hover:text-white hover:bg-white/10'
                }`}
              >
                {isListening ? <MicOff size={16} /> : <Mic size={16} />}
              </button>

              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder={isListening ? "Listening..." : `Type in ${activeLang.name}...`}
                className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-white/20 focus:outline-none focus:border-[#B600A8]/60 transition-colors"
                disabled={isListening}
              />
              <button
                type="submit"
                disabled={!inputValue.trim() || isTyping || isListening}
                className="rounded-xl w-10 h-10 flex items-center justify-center bg-white text-black hover:bg-opacity-90 disabled:opacity-30 disabled:hover:bg-white transition-all cursor-pointer flex-shrink-0"
              >
                <Send size={16} />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
