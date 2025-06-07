import React from 'react';
import { EmailMessage } from '../types/email.types';

interface Props {
  emails: EmailMessage[];
  onSelect: (email: EmailMessage) => void;
}

const EmailList: React.FC<Props> = ({ emails, onSelect }) => {
  return (
    <div className="flex-1 overflow-y-auto divide-y">
      {emails.map(email => (
        <div
          key={email.id}
          onClick={() => onSelect(email)}
          className="p-3 hover:bg-gray-100 cursor-pointer"
        >
          <div className="font-semibold">{email.subject}</div>
          <div className="text-sm text-gray-600">{email.from_address}</div>
          <div className="text-xs text-gray-400">{new Date(email.received_at).toLocaleString()}</div>
        </div>
      ))}
    </div>
  );
};

export default EmailList;
