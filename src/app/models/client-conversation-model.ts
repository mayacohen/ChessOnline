import { ClientMessageModel } from "./client-message-model";
export interface ClientConversationModel {
    chatPartnerUserName : string;
    messages:  ClientMessageModel[];
}
