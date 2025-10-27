import React, { useState } from 'react';
import { MessageCircle } from 'lucide-react';
import ChatModal from './ChatModal';

export default function ChatButton({ user }) {
  const [isChatOpen, setIsChatOpen] = useState(false);

  return (
    <>
      {/* Botón flotante de chat - Responsive */}
      <button
        onClick={() => setIsChatOpen(true)}
        className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 w-12 h-12 sm:w-14 sm:h-14 bg-cyan-500 hover:bg-cyan-600 text-black rounded-full shadow-lg flex items-center justify-center transition-all hover:scale-110 z-50"
        aria-label="Abrir chat"
      >
        <MessageCircle className="w-5 h-5 sm:w-6 sm:h-6" />
      </button>

      {/* Modal de chat */}
      <ChatModal
        isOpen={isChatOpen}
        onClose={() => setIsChatOpen(false)}
        user={user}
      />
    </>
  );
}
