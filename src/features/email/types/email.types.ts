import { BaseEntity } from '../../../types/base';

export interface EmailAttachment extends BaseEntity {
    filename: string;
    local_path: string;
}

export interface EmailMessage extends BaseEntity {
    subject: string;
    from_address: string;
    to_address: string;
    received_at: string;
    body: string;
    attachments: EmailAttachment[];
}

export interface EmailAccount extends BaseEntity {
    email_address: string;
    imap_server: string;
    imap_port: number;
    username: string;
    password: string;
    use_ssl: boolean;
}

export interface CreateEmailAccount {
    email_address: string;
    imap_server: string;
    imap_port: number;
    username: string;
    password: string;
    use_ssl: boolean;
}

export type UpdateEmailAccount = Partial<CreateEmailAccount>

