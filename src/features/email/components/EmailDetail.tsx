import React from 'react';
import { EmailMessage } from '../types/email.types';

interface Props {
  email: EmailMessage;
}

const EmailDetail: React.FC<Props> = ({ email }) => {
  return (
    <div className="p-6 space-y-4">
      <h1 className="text-xl font-bold">{email.subject}</h1>
      <div className="text-sm text-gray-500">
        From: {email.from_address} <br />
        To: {email.to_address} <br />
        Received: {new Date(email.received_at).toLocaleString()}
      </div>
      <div className="border-t pt-4 whitespace-pre-wrap text-sm">
        {email.body}
      </div>

      {email.attachments.length > 0 && (
        <div className="pt-4">
          <h3 className="font-semibold">Attachments</h3>
          <ul className="list-disc pl-5">
            {email.attachments.map(att => (
              <li key={att.id}>
                <a
                  href={`/attachments/${att.local_path}`}
                  target="_blank"
                  className="text-blue-600 underline"
                  rel="noreferrer"
                >
                  {att.filename}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default EmailDetail;
