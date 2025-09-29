export interface ClientServerMessage {
    content: string | null;
    senderUserName : string | null;
    receiverUserName : string |null;
    date : string | null;
    type : string;
}