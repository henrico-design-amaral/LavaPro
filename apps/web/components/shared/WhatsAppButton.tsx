import React from 'react';
import { MessageCircle } from 'lucide-react'; // Assuming lucide-react is used for icons

interface WhatsAppButtonProps {
  phone: string;
  message?: string;
  className?: string;
}

export function WhatsAppButton({ phone, message = "Olá! Seu veículo está pronto na LavaPro.", className = "" }: WhatsAppButtonProps) {
  // Format phone number to numbers only
  const formattedPhone = phone.replace(/\D/g, '');
  const encodedMessage = encodeURIComponent(message);
  
  const href = `https://wa.me/${formattedPhone}?text=${encodedMessage}`;

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={`inline-flex items-center gap-2 bg-[#25D366] hover:bg-[#128C7E] text-white px-4 py-2 rounded-md font-medium transition-colors ${className}`}
    >
      <MessageCircle size={18} />
      <span>WhatsApp</span>
    </a>
  );
}
