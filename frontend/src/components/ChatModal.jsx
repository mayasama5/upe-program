import React, { useState, useRef, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { ScrollArea } from './ui/scroll-area';
import { Send, MessageCircle, User, Bot } from 'lucide-react';

export default function ChatModal({ isOpen, onClose, user }) {
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'bot',
      text: '¡Hola! Soy tu asistente virtual de UPE. ¿En qué puedo ayudarte hoy?',
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollAreaRef = useRef(null);
  const messagesEndRef = useRef(null);

  // Auto-scroll al último mensaje
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Respuestas automáticas del bot
  const getBotResponse = (userMessage) => {
    const message = userMessage.toLowerCase();

    if (message.includes('curso') || message.includes('cursos')) {
      return 'Tenemos más de 40 cursos gratuitos disponibles en diferentes categorías como Programación, Marketing, Diseño y más. ¿Te gustaría ver los cursos disponibles?';
    }
    if (message.includes('evento') || message.includes('eventos')) {
      return 'Contamos con eventos online y presenciales en Paraguay y Latinoamérica. Puedes ver todos nuestros eventos en la sección de Eventos.';
    }
    if (message.includes('vacante') || message.includes('trabajo') || message.includes('empleo')) {
      return 'Publicamos vacantes laborales en tecnología, diseño, marketing y más áreas. Visita nuestra sección de Vacantes para ver las oportunidades disponibles.';
    }
    if (message.includes('beca') || message.includes('becas')) {
      return 'Ofrecemos información sobre becas educativas. Visita nuestra sección de Becas para conocer las oportunidades disponibles.';
    }
    if (message.includes('certificado') || message.includes('certificación')) {
      return 'Tenemos información sobre certificaciones profesionales en nuestra plataforma. ¿Te interesa alguna certificación en particular?';
    }
    if (message.includes('hola') || message.includes('buenos') || message.includes('buenas')) {
      return `¡Hola${user ? ' ' + user.name : ''}! ¿Cómo puedo ayudarte hoy? Puedo informarte sobre cursos, eventos, vacantes laborales y más.`;
    }
    if (message.includes('gracias')) {
      return '¡De nada! Si tienes alguna otra pregunta, no dudes en escribirme. 😊';
    }
    if (message.includes('ayuda') || message.includes('?')) {
      return 'Puedo ayudarte con información sobre:\n• Cursos gratuitos\n• Eventos profesionales\n• Vacantes laborales\n• Becas educativas\n• Certificaciones\n• Consejos profesionales\n\n¿Sobre qué te gustaría saber más?';
    }

    return 'Gracias por tu mensaje. Para obtener información más detallada, te recomiendo explorar nuestras secciones de Cursos, Eventos y Vacantes. ¿Hay algo específico en lo que pueda ayudarte?';
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    // Agregar mensaje del usuario
    const userMessage = {
      id: messages.length + 1,
      type: 'user',
      text: inputMessage,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsTyping(true);

    // Simular delay de respuesta del bot
    setTimeout(() => {
      const botMessage = {
        id: messages.length + 2,
        type: 'bot',
        text: getBotResponse(inputMessage),
        timestamp: new Date()
      };
      setMessages(prev => [...prev, botMessage]);
      setIsTyping(false);
    }, 1000);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const formatTime = (date) => {
    return date.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] h-[600px] p-0 bg-slate-900 border-slate-700">
        {/* Header */}
        <DialogHeader className="border-b border-slate-700 p-4 bg-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-cyan-500 flex items-center justify-center">
              <MessageCircle className="w-5 h-5 text-black" />
            </div>
            <div>
              <DialogTitle className="text-white text-lg">Asistente UPE</DialogTitle>
              <p className="text-xs text-gray-400">En línea</p>
            </div>
          </div>
        </DialogHeader>

        {/* Messages Area */}
        <ScrollArea className="flex-1 p-4 h-[420px]" ref={scrollAreaRef}>
          <div className="space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex gap-3 ${message.type === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
              >
                {/* Avatar */}
                {message.type === 'bot' ? (
                  <div className="w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center bg-cyan-500">
                    <Bot className="w-4 h-4 text-black" />
                  </div>
                ) : user && user.picture ? (
                  <img
                    src={user.picture}
                    alt={user.name || 'Usuario'}
                    className="w-8 h-8 rounded-full flex-shrink-0 object-cover border border-slate-600"
                  />
                ) : (
                  <div className="w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center bg-slate-700">
                    <User className="w-4 h-4 text-white" />
                  </div>
                )}

                {/* Message Bubble */}
                <div className={`flex flex-col max-w-[75%] ${message.type === 'user' ? 'items-end' : 'items-start'}`}>
                  <div className={`rounded-lg px-4 py-2 ${
                    message.type === 'bot'
                      ? 'bg-slate-800 text-gray-100'
                      : 'bg-cyan-500 text-black'
                  }`}>
                    <p className="text-sm whitespace-pre-wrap">{message.text}</p>
                  </div>
                  <span className="text-xs text-gray-500 mt-1">
                    {formatTime(message.timestamp)}
                  </span>
                </div>
              </div>
            ))}

            {/* Typing Indicator */}
            {isTyping && (
              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-full bg-cyan-500 flex-shrink-0 flex items-center justify-center">
                  <Bot className="w-4 h-4 text-black" />
                </div>
                <div className="bg-slate-800 rounded-lg px-4 py-2">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>

        {/* Input Area */}
        <div className="border-t border-slate-700 p-4 bg-slate-800">
          <div className="flex gap-2">
            <Input
              placeholder="Escribe tu mensaje..."
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              className="bg-slate-900 border-slate-700 text-white placeholder:text-gray-500 focus:border-cyan-500"
            />
            <Button
              onClick={handleSendMessage}
              disabled={!inputMessage.trim()}
              className="bg-cyan-500 hover:bg-cyan-600 text-black"
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
          <p className="text-xs text-gray-500 mt-2 text-center">
            Presiona Enter para enviar
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
