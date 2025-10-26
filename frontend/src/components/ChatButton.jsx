import React, { useState } from 'react';
import { MessageCircle } from 'lucide-react';
import ChatModal from './ChatModal';

export default function ChatButton({ user }) {
  const [isChatOpen, setIsChatOpen] = useState(false);

  return (
    <>
      {/* Botón flotante de chat */}
      <button
        onClick={() => setIsChatOpen(true)}
        className="fixed bottom-6 right-6 w-14 h-14 bg-cyan-500 hover:bg-cyan-600 text-black rounded-full shadow-lg flex items-center justify-center transition-all hover:scale-110 z-50"
        aria-label="Abrir chat"
      >
        <MessageCircle className="w-6 h-6" />
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
