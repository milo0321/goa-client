import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import EmailList from '../components/EmailList';
import EmailDetail from '../components/EmailDetail';
import { EmailMessage } from '../types/email.types';
import { getAllEmails } from '../api/email.api';

const MailClient: React.FC = () => {
  const [emails, setEmails] = useState<EmailMessage[]>([]);
  const [selectedEmail, setSelectedEmail] = useState<EmailMessage | null>(null);

  useEffect(() => {
    getAllEmails().then(setEmails);
  }, []);

  return (
    <div className="flex h-screen">
      {/* 左侧账户&文件夹 */}
      <Sidebar />

      {/* 中间邮件列表 */}
      <div className="w-1/3 border-r overflow-y-auto">
        <EmailList emails={emails} onSelect={setSelectedEmail} />
      </div>

      {/* 右侧邮件详情 */}
      <div className="flex-1 overflow-y-auto">
        {selectedEmail ? (
          <EmailDetail email={selectedEmail} />
        ) : (
          <div className="p-8 text-center text-muted-foreground">Select an email to view details</div>
        )}
      </div>
    </div>
  );
};

export default MailClient;
